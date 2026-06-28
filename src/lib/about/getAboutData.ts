import type {
  AboutProfile,
  SkillGroupData,
  SkillData,
  SkillGroup,
  InterestData,
  Interest,
  ContactLinkData,
  ContactLink,
} from '@/lib/types';

import aboutProfileData from '@/data/about-profile.json';
import skillGroupsData from '@/data/skill-groups.json';
import skillsData from '@/data/skills.json';
import interestsData from '@/data/interests.json';
import contactLinksData from '@/data/contact-links.json';
import { careerTop, careerBottom } from './careerTimeline';

const profiles = aboutProfileData as AboutProfile[];
const groups = skillGroupsData as SkillGroupData[];
const skills = skillsData as SkillData[];
const interests = interestsData as InterestData[];
const contacts = contactLinksData as ContactLinkData[];

export function getAboutData() {
  const profile = profiles[0] ?? null;

  const skillsByGroup: Record<string, string[]> = {};
  for (const g of groups) skillsByGroup[g.id] = [];
  for (const s of skills) (skillsByGroup[s.group_id] ??= []).push(s.label);

  const skillGroups: SkillGroup[] = groups.map(g => ({
    name: g.name,
    skills: skillsByGroup[g.id] ?? [],
    color: g.color ?? null,
  }));

  return {
    profile: {
      name: profile?.full_name ?? null,
      bio: profile?.bio ?? null,
      photoUrl: profile?.photo_url ?? null,
    },
    timeline: { top: careerTop, bottom: careerBottom },
    skills: skillGroups,
    interests: interests as Interest[],
    contacts: contacts as ContactLink[],
  };
}
