import { supabaseServer } from '../supabase/server';

// --- UPDATED: Added color to SkillGroup type ---
// --- UPDATED: Extended TimelineSeg to include detailed data ---
export type TimelineSeg = {
  start: string;
  end?: string | null;
  label?: string | null;
  logo_url?: string | null;
  id?: string; // Added to link to detailed data
  type?: string | null; // 'education' or 'experience'
  details?: TimelineEducation | TimelineExperience | null;
};

export type TimelineEducation = {
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  description?: string | null;
  achievements?: string[] | null;
  gpa?: string | null;
  location?: string | null;
};

export type TimelineExperience = {
  company: string;
  position: string;
  description?: string | null;
  responsibilities?: string[] | null;
  technologies?: string[] | null;
  location?: string | null;
};
export type SkillGroup = { 
  name: string; 
  skills: string[]; 
  color?: string | null;  // ADDED: color field
};
export type Interest   = { 
  label: string; 
  icon_name?: string | null;
  color?: string | null;
};
export type ContactLink = { label: string; url: string; icon_name?: string | null };

export async function getAboutData() {
  const supabase = supabaseServer();

  if (!supabase) {
    console.warn('[getAboutData] Supabase client unavailable. Returning fallback content.');
    return {
      profile: {
        name: null,
        bio: null,
        photoUrl: null,
      },
      timeline: { top: [], bottom: [] },
      skills: [] as SkillGroup[],
      interests: [] as Interest[],
      contacts: [] as ContactLink[],
    };
  }

  console.log('=== Starting getAboutData ===');

  /* ---------- Profile (name, bio, photo) ---------- */
  const { data: profileRow, error: profileError } = await supabase
    .from('about_profile')
    .select('full_name, bio, photo_url')
    .limit(1)
    .maybeSingle();

  console.log('Profile query result:', { profileRow, profileError });

  let photoUrl: string | null = null;
  console.log('Photo URL from DB:', profileRow?.photo_url);
  
  if (profileRow?.photo_url) {
    // If it's already a full URL, use it directly
    if (profileRow.photo_url.startsWith('http')) {
      photoUrl = profileRow.photo_url;
      console.log('Using full URL from DB:', photoUrl);
    } else {
      // It's a file path - generate public URL from storage
      console.log('Generating public URL for path:', profileRow.photo_url);
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(profileRow.photo_url);
      photoUrl = data?.publicUrl ?? null;
      console.log('Generated public URL:', photoUrl);
    }
  } else {
    console.log('No photo_url in database - using fallback');
  }

  /* ---------- Timeline (top/bottom) ---------- */
  const { data: topRaw, error: topError } = await supabase
    .from('timeline_segments')
    .select('start_ym, end_ym, label, band, sort_index, logo_url')
    .eq('band', 'top')
    .order('sort_index', { ascending: true });

  console.log('Timeline top:', { count: topRaw?.length, topError });

  const { data: botRaw, error: botError } = await supabase
    .from('timeline_segments')
    .select('start_ym, end_ym, label, band, sort_index, logo_url')
    .eq('band', 'bottom')
    .order('sort_index', { ascending: true });

  console.log('Timeline bottom:', { count: botRaw?.length, botError });

  const top: TimelineSeg[] =
    (topRaw ?? []).map(r => ({
      start: r.start_ym,
      end: r.end_ym,
      label: r.label ?? undefined,
      logo_url: r.logo_url ?? undefined,
    }));
  const bottom: TimelineSeg[] =
    (botRaw ?? []).map(r => ({
      start: r.start_ym,
      end: r.end_ym,
      label: r.label ?? undefined,
      logo_url: r.logo_url ?? undefined,
    }));

  /* ---------- Skills (groups + skills) ---------- */
  // UPDATED: Select color field from skill_groups
  const { data: groups, error: groupsError } = await supabase
    .from('skill_groups')
    .select('id, name, color, sort_index')
    .order('sort_index', { ascending: true });

  console.log('Skill groups:', { count: groups?.length, groups, groupsError });

  const groupIds = (groups ?? []).map(g => g.id);
  const skillsByGroup: Record<string, string[]> = {};
  if (groupIds.length) {
    const { data: skillsRows, error: skillsError } = await supabase
      .from('skills')
      .select('group_id, label, sort_index')
      .in('group_id', groupIds)
      .order('sort_index', { ascending: true });

    console.log('Skills:', { count: skillsRows?.length, skillsError });

    for (const g of groups ?? []) skillsByGroup[g.id] = [];
    for (const s of skillsRows ?? []) (skillsByGroup[s.group_id] ??= []).push(s.label);
  }
  
  // UPDATED: Map to include color field
  const skills: SkillGroup[] = (groups ?? []).map(g => ({
    name: g.name,
    skills: skillsByGroup[g.id] ?? [],
    color: g.color ?? null,
  }));

  console.log('Final skills with colors:', skills);

  /* ---------- Interests ---------- */
  const { data: interests, error: interestsError } = await supabase
    .from('interests')
    .select('label, icon_name, color, sort_index')
    .order('sort_index', { ascending: true });

  console.log('Interests:', { count: interests?.length, interests, interestsError });

  /* ---------- Contact links ---------- */
  const { data: contacts, error: contactsError } = await supabase
    .from('contact_links')
    .select('label, url, icon_name, sort_index')
    .order('sort_index', { ascending: true });

  console.log('Contacts:', { count: contacts?.length, contacts, contactsError });

  const result = {
    profile: {
      name: profileRow?.full_name ?? null,
      bio:  profileRow?.bio ?? null,
      photoUrl: photoUrl,
    },
    timeline: { top, bottom },
    skills,
    interests: (interests ?? []) as Interest[],
    contacts:  (contacts  ?? []) as ContactLink[],
  };

  console.log('=== Final result ===', JSON.stringify(result, null, 2));
  return result;
}