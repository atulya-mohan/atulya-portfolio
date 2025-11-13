// src/lib/about/getAboutData.ts
'use server';

import { supabaseServer } from '../supabase/server';
import type {
  TimelineSeg,
  TimelineEducation,
  TimelineExperience,
} from '@/lib/about/types';

export const runtime = 'nodejs';

export type SkillGroup = {
  name: string;
  skills: string[];
  color?: string | null;
};
export type Interest = {
  label: string;
  icon_name?: string | null;
  color?: string | null;
};
export type ContactLink = { label: string; url: string; icon_name?: string | null };

const FALLBACK = {
  profile: { name: null as string | null, bio: null as string | null, photoUrl: null as string | null },
  timeline: { top: [] as TimelineSeg[], bottom: [] as TimelineSeg[] },
  skills: [] as SkillGroup[],
  interests: [] as Interest[],
  contacts: [] as ContactLink[],
};

export async function getAboutData() {
  const supabase = supabaseServer();
  if (!supabase) {
    console.warn('[getAboutData] Supabase client unavailable. Returning fallback content.');
    return FALLBACK;
  }

  console.log('=== Starting getAboutData ===');

  /* ---------- Profile (name, bio, photo) ---------- */
  const { data: profileRow, error: profileError } = await supabase
    .from('about_profile')
    .select('full_name, bio, photo_url')
    .limit(1)
    .maybeSingle();

  if (profileError) console.error('[getAboutData] profile error:', profileError);

  let photoUrl: string | null = null;
  if (profileRow?.photo_url) {
    if (/^https?:\/\//i.test(profileRow.photo_url)) {
      photoUrl = profileRow.photo_url;
    } else {
      // NOTE: change 'portfolio' if your bucket name differs
      const { data } = supabase.storage.from('portfolio').getPublicUrl(profileRow.photo_url);
      photoUrl = data?.publicUrl ?? null;
    }
  }

  /* ---------- Timeline: segments + details ---------- */
  // Grab all segments once; we’ll split top/bottom and join details by type
  const { data: segs, error: segError } = await supabase
    .from('timeline_segments')
    .select('id, band, start_ym, end_ym, label, logo_url, type, sort_index')
    .order('sort_index', { ascending: true });

  if (segError) console.error('[getAboutData] timeline_segments error:', segError);

  const allSegs = segs ?? [];
  const eduIds = allSegs.filter(s => s.type === 'education').map(s => s.id);
  const expIds = allSegs.filter(s => s.type === 'experience').map(s => s.id);

  const [eduRes, expRes] = await Promise.all([
    eduIds.length
      ? supabase
          .from('timeline_education')
          .select(
            'timeline_segment_id, institution, degree, field_of_study, description, achievements, gpa, location'
          )
          .in('timeline_segment_id', eduIds)
      : Promise.resolve({ data: [] as any[], error: null }),
    expIds.length
      ? supabase
          .from('timeline_experience')
          .select(
            'timeline_segment_id, company, position, description, responsibilities, technologies, location'
          )
          .in('timeline_segment_id', expIds)
      : Promise.resolve({ data: [] as any[], error: null }),
  ]);

  if ('error' in eduRes && eduRes.error) console.error('[getAboutData] timeline_education error:', eduRes.error);
  if ('error' in expRes && expRes.error) console.error('[getAboutData] timeline_experience error:', expRes.error);

  const eduMap: Record<string, TimelineEducation> = {};
  for (const r of (eduRes as any).data ?? []) {
    eduMap[r.timeline_segment_id] = {
      institution: r.institution,
      degree: r.degree ?? null,
      field_of_study: r.field_of_study ?? null,
      description: r.description ?? null,
      achievements: (r.achievements as string[] | null) ?? null,
      gpa: r.gpa ?? null,
      location: r.location ?? null,
    };
  }

  const expMap: Record<string, TimelineExperience> = {};
  for (const r of (expRes as any).data ?? []) {
    expMap[r.timeline_segment_id] = {
      company: r.company,
      position: r.position,
      description: r.description ?? null,
      responsibilities: (r.responsibilities as string[] | null) ?? null,
      technologies: (r.technologies as string[] | null) ?? null,
      location: r.location ?? null,
    };
  }

  const mapSeg = (r: any): TimelineSeg => ({
    id: r.id,
    start: r.start_ym,
    end: r.end_ym,
    label: r.label ?? undefined,
    logo_url: r.logo_url ?? undefined,
    type: r.type ?? null,
    details: r.type === 'education' ? eduMap[r.id] ?? null : r.type === 'experience' ? expMap[r.id] ?? null : null,
  });

  const top: TimelineSeg[] = allSegs.filter(s => s.band === 'top').map(mapSeg);
  const bottom: TimelineSeg[] = allSegs.filter(s => s.band === 'bottom').map(mapSeg);

  /* ---------- Skills (groups + skills) ---------- */
  const { data: groups, error: groupsError } = await supabase
    .from('skill_groups')
    .select('id, name, color, sort_index')
    .order('sort_index', { ascending: true });

  if (groupsError) console.error('[getAboutData] skill_groups error:', groupsError);

  let skills: SkillGroup[] = [];
  if (groups?.length) {
    const groupIds = groups.map(g => g.id);
    const { data: skillsRows, error: skillsError } = await supabase
      .from('skills')
      .select('group_id, label, sort_index')
      .in('group_id', groupIds)
      .order('sort_index', { ascending: true });

    if (skillsError) console.error('[getAboutData] skills error:', skillsError);

    const byGroup: Record<string, string[]> = {};
    for (const g of groups) byGroup[g.id] = [];
    for (const s of skillsRows ?? []) (byGroup[s.group_id] ??= []).push(s.label);

    skills = groups.map(g => ({
      name: g.name,
      skills: byGroup[g.id] ?? [],
      color: g.color ?? null,
    }));
  }

  /* ---------- Interests ---------- */
  const { data: interestsRows, error: interestsError } = await supabase
    .from('interests')
    .select('label, icon_name, color, sort_index')
    .order('sort_index', { ascending: true });

  if (interestsError) console.error('[getAboutData] interests error:', interestsError);

  /* ---------- Contact links ---------- */
  const { data: contactsRows, error: contactsError } = await supabase
    .from('contact_links')
    .select('label, url, icon_name, sort_index')
    .order('sort_index', { ascending: true });

  if (contactsError) console.error('[getAboutData] contact_links error:', contactsError);

  const result = {
    profile: {
      name: profileRow?.full_name ?? null,
      bio: profileRow?.bio ?? null,
      photoUrl,
    },
    timeline: { top, bottom },
    skills,
    interests: (interestsRows ?? []) as Interest[],
    contacts: (contactsRows ?? []) as ContactLink[],
  };

  console.log('=== Final getAboutData === OK', {
    profile: !!profileRow,
    top: top.length,
    bottom: bottom.length,
    skillsGroups: skills.length,
    interests: (interestsRows ?? []).length,
    contacts: (contactsRows ?? []).length,
  });

  return result;
}
