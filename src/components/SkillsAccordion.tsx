// src/components/SkillsAccordion.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SkillsAccordionProps {
  groups: Record<string, { skills: string[]; color: string }>;
}

export default function SkillsAccordion({ groups }: SkillsAccordionProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {Object.entries(groups).map(([groupName, { skills, color }]) => {
        const isOpen = openGroups.has(groupName);
        
        return (
          <div key={groupName} className="border border-[var(--border)]">
            <button
              onClick={() => toggleGroup(groupName)}
              className="btn-press w-full flex items-center justify-between p-3 text-left transition-colors group"
              style={{ backgroundColor: color }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF4F00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = color;
              }}
            >
              <span className="font-header text-lg uppercase text-gray-900 group-hover:text-white transition-colors">{groupName}</span>
              <ChevronDown
                className={`h-5 w-5 transition-[transform,color] text-gray-900 group-hover:text-white ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isOpen && (
              <div className="p-3 border-t border-[var(--border)]">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="border border-[var(--border-light)] px-3 py-1 text-xs font-mono text-gray-900"
                      style={{ backgroundColor: color }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}