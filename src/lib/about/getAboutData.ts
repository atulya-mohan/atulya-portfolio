import { supabaseServer } from '../supabase/server';
import type { TimelineSeg } from '@/lib/about/types';

export type SkillGroup = { name: string; skills: string[]; color?: string | null };
export type Interest   = { label: string; icon_name?: string | null; color?: string | null };
export type ContactLink = { label: string; url: string; icon_name?: string | null };

export async function getAboutData() {
  const supabase = supabaseServer();

  if (!supabase) {
    console.warn('[getAboutData] Supabase client unavailable. Returning fallback content.');
    return {
      profile: { name: null, bio: null, photoUrl: null },
      timeline: { top: [] as TimelineSeg[], bottom: [] as TimelineSeg[] },
      skills: [] as SkillGroup[],
      interests: [] as Interest[],
      contacts: [] as ContactLink[],
    };
  }

  /* ---------- Profile ---------- */
  const { data: profileRow, error: profileError } = await supabase
    .from('about_profile')
    .select('full_name, bio, photo_url')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (profileError) console.warn('[getAboutData] profileError:', profileError);

  let photoUrl: string | null = null;
  if (profileRow?.photo_url) {
    if (profileRow.photo_url.startsWith('http')) {
      photoUrl = profileRow.photo_url;
    } else {
      const { data } = supabase.storage.from('portfolio').getPublicUrl(profileRow.photo_url);
      photoUrl = data?.publicUrl ?? null;
    }
  }

  /* ---------- Timeline ---------- */
  const { data: topRaw,   error: topError } = await supabase
    .from('timeline_segments').select('start_ym, end_ym, label, band, sort_index, logo_url')
    .eq('band', 'top').order('sort_index', { ascending: true });

  const { data: botRaw,   error: botError } = await supabase
    .from('timeline_segments').select('start_ym, end_ym, label, band, sort_index, logo_url')
    .eq('band', 'bottom').order('sort_index', { ascending: true });

  if (topError) console.warn('[getAboutData] topError:', topError);
  if (botError) console.warn('[getAboutData] botError:', botError);

  const top: TimelineSeg[] = (topRaw ?? []).map(r => ({
    start: r.start_ym, end: r.end_ym ?? undefined, label: r.label ?? undefined, logo_url: r.logo_url ?? undefined,
  }));

  const bottom: TimelineSeg[] = (botRaw ?? []).map(r => ({
    start: r.start_ym, end: r.end_ym ?? undefined, label: r.label ?? undefined, logo_url: r.logo_url ?? undefined,
  }));

  /* ---------- Skills ---------- */
  const { data: groups, error: groupsError } = await supabase
    .from('skill_groups').select('id, name, color, sort_index').order('sort_index', { ascending: true });

  if (groupsError) console.warn('[getAboutData] groupsError:', groupsError);

  const groupIds = (groups ?? []).map(g => g.id);
  const skillsByGroup: Record<string, string[]> = {};
  if (groupIds.length) {
    const { data: skillsRows, error: skillsError } = await supabase
      .from('skills').select('group_id, label, sort_index')
      .in('group_id', groupIds).order('sort_index', { ascending: true });
    if (skillsError) console.warn('[getAboutData] skillsError:', skillsError);

    for (const g of groups ?? []) skillsByGroup[g.id] = [];
    for (const s of skillsRows ?? []) (skillsByGroup[s.group_id] ??= []).push(s.label);
  }

  const skills: SkillGroup[] = (groups ?? []).map(g => ({
    name: g.name,
    skills: skillsByGroup[g.id] ?? [],
    color: g.color ?? null,
  }));

  /* ---------- Interests ---------- */
  const { data: interests, error: interestsError } = await supabase
    .from('interests').select('label, icon_name, color, sort_index').order('sort_index', { ascending: true });
  if (interestsError) console.warn('[getAboutData] interestsError:', interestsError);

  /* ---------- Contacts ---------- */
  const { data: contacts, error: contactsError } = await supabase
    .from('contact_links').select('label, url, icon_name, sort_index').order('sort_index', { ascending: true });
  if (contactsError) console.warn('[getAboutData] contactsError:', contactsError);

  return {
    profile: { name: profileRow?.full_name ?? null, bio: profileRow?.bio ?? null, photoUrl },
    timeline: { top, bottom },
    skills,
    interests: (interests ?? []) as Interest[],
    contacts: (contacts ?? []) as ContactLink[],
  };
}
