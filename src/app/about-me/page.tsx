// src/app/about-me/page.tsx

import { getAboutData } from '@/lib/about/getAboutData';
import AboutPageClient from './AboutPageClient';

export const runtime = 'nodejs';

export default async function AboutPage() {
  let aboutData;
  try {
    aboutData = await getAboutData();
  } catch (error) {
    console.error('[AboutPage] Error fetching about data:', error);
    // Return fallback data structure
    aboutData = {
      profile: { name: null, bio: null, photoUrl: null },
      timeline: { top: [], bottom: [] },
      skills: [],
      interests: [],
      contacts: [],
    };
  }
  
  const { skills = [] } = aboutData ?? { skills: [] };

  // Transform skills data for SkillsAccordion component
  const skillsGroups: Record<string, { skills: string[]; color: string }> =
    skills && skills.length > 0
      ? skills.reduce((acc, g) => {
          acc[g.name] = { 
            skills: g.skills, 
            color: g.color || '#FFB3BA'
          };
          return acc;
        }, {} as Record<string, { skills: string[]; color: string }>)
      : {
          'CAD & Simulation': { skills: ['SOLIDWORKS', 'Siemens NX', 'Fusion 360', 'OnShape', 'Abaqus', 'COMSOL'], color: '#FFB3BA' },
          Software: { skills: ['MATLAB', 'Python', 'R', 'SQL', 'Figma', 'Power BI', 'Excel'], color: '#BAFFC9' },
          'Computer Environments': { skills: ['macOS', 'Windows', 'Linux', 'Git/GitHub'], color: '#BAE1FF' },
          'Manufacturing Processes': { skills: ['DFM/DFA', '3D Printing', 'CNC', 'Rapid Prototyping'], color: '#E0BBE4' },
        };

  const fallbackInterests = [
    { label: 'Music',   icon_name: 'Music', color: '#FFB3BA' },
    { label: 'Camera',  icon_name: 'Camera', color: '#BAFFC9' },
    { label: 'Gaming',  icon_name: 'Gamepad2', color: '#BAE1FF' },
    { label: 'Travel',  icon_name: 'Plane', color: '#FFFFBA' },
    { label: 'Tools',   icon_name: 'Wrench', color: '#E0BBE4' },
  ];

  return (
    <AboutPageClient 
      aboutData={aboutData} 
      skillsGroups={skillsGroups}
      fallbackInterests={fallbackInterests}
    />
  );
}