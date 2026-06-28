import type { Metadata } from 'next';
import { Mail, Linkedin, Phone, MapPin, Download, Globe } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { getResumeData } from '@/lib/resume/getResumeData';
import type { ResumeData } from '@/lib/resume/getResumeData';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Atulya Mohan — education, experience, skills, and publications.',
};

const resumeData = getResumeData();

export default function ResumePage() {
  return (
    <div className="min-h-screen md:fixed md:inset-0 md:h-full md:w-full md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* ===== DESKTOP LAYOUT ===== */}
      <section
        className="hidden md:block px-4 h-full"
        style={{ '--gap': '12px', '--gutter': '22px' } as React.CSSProperties}
      >
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          <div className="mb-3 flex-shrink-0 flex justify-between items-center border-b border-[var(--border)] pb-2">
            <div>
              <h1 className="font-header text-4xl uppercase text-[var(--foreground)]">{resumeData.name}</h1>
              <p className="font-mono text-lg text-[var(--foreground)]">{resumeData.title}</p>
            </div>
            <a
              href="/Atulya_Mohan_Resume.pdf"
              download="Atulya_Mohan_Resume.pdf"
              className="btn-press flex items-center gap-2 border-2 border-[var(--accent)] bg-[var(--accent)] px-3 py-1.5 font-mono text-sm text-white transition-colors hover:bg-opacity-80 flex-shrink-0"
              title="Download Resume PDF"
            >
              <Download className="h-4 w-4" />
              DOWNLOAD PDF
            </a>
          </div>

          <div className="grid flex-1 min-h-0 grid-cols-3 gap-[var(--gap)]">
            <div className="col-span-1 flex flex-col gap-[var(--gap)]">
              <div className="card p-3 flex-shrink-0">
                <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2">Contact</h2>
                <div className="space-y-1 font-mono text-xs">
                  {resumeData.contact.email && <ContactItem icon={Mail} text={resumeData.contact.email} href={`mailto:${resumeData.contact.email}`} />}
                  {resumeData.contact.phone && <ContactItem icon={Phone} text={resumeData.contact.phone} />}
                  {resumeData.contact.linkedin && <ContactItem icon={Linkedin} text={resumeData.contact.linkedin} href={`https://${resumeData.contact.linkedin}`} target="_blank"/>}
                  {resumeData.contact.website && <ContactItem icon={Globe} text={resumeData.contact.website} href={`https://${resumeData.contact.website}`} target="_blank"/>}
                  {resumeData.contact.location && <ContactItem icon={MapPin} text={resumeData.contact.location} />}
                </div>
              </div>

              <div className="card p-3 flex-1 min-h-0 flex flex-col">
                <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 flex-shrink-0">Skills</h2>
                <div className="flex-1 overflow-y-auto content-scrollbar pr-1 space-y-3">
                  {Object.entries(resumeData.skills).map(([category, skillsList]) => (
                    <div key={category}>
                      <h3 className="font-mono font-bold text-sm text-[var(--foreground)] mb-1">{category}</h3>
                      <div className="flex flex-wrap gap-1">
                        {skillsList.map(skill => <Badge key={skill} label={skill} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-2 card-elevated p-3 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto content-scrollbar pr-2 space-y-4">
                {resumeData.summary && (
                  <div>
                    <p className="font-body text-sm text-[var(--foreground)] leading-relaxed">{resumeData.summary}</p>
                  </div>
                )}
                <ResumeContent data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden pt-20 pb-8 px-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-header text-3xl uppercase text-[var(--foreground)]">{resumeData.name}</h1>
            <p className="font-mono text-sm text-[var(--muted)]">{resumeData.title}</p>
          </div>
          <a
            href="/Atulya_Mohan_Resume.pdf"
            download="Atulya_Mohan_Resume.pdf"
            className="btn-press flex items-center gap-1.5 border-2 border-[var(--accent)] bg-[var(--accent)] px-2.5 py-1 font-mono text-xs text-white shrink-0"
            title="Download Resume PDF"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>
        </div>

        {/* Contact */}
        <div className="card p-3">
          <h2 className="font-header text-lg uppercase text-[var(--foreground)] mb-2">Contact</h2>
          <div className="space-y-1 font-mono text-xs">
            {resumeData.contact.email && <ContactItem icon={Mail} text={resumeData.contact.email} href={`mailto:${resumeData.contact.email}`} />}
            {resumeData.contact.phone && <ContactItem icon={Phone} text={resumeData.contact.phone} />}
            {resumeData.contact.linkedin && <ContactItem icon={Linkedin} text={resumeData.contact.linkedin} href={`https://${resumeData.contact.linkedin}`} target="_blank"/>}
            {resumeData.contact.website && <ContactItem icon={Globe} text={resumeData.contact.website} href={`https://${resumeData.contact.website}`} target="_blank"/>}
            {resumeData.contact.location && <ContactItem icon={MapPin} text={resumeData.contact.location} />}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="card p-3">
            <p className="font-body text-sm text-[var(--foreground)] leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Main resume content */}
        <div className="card p-3 space-y-4">
          <ResumeContent data={resumeData} />
        </div>

        {/* Skills */}
        <div className="card p-3">
          <h2 className="font-header text-lg uppercase text-[var(--foreground)] mb-2">Skills</h2>
          <div className="space-y-3">
            {Object.entries(resumeData.skills).map(([category, skillsList]) => (
              <div key={category}>
                <h3 className="font-mono font-bold text-sm text-[var(--foreground)] mb-1">{category}</h3>
                <div className="flex flex-wrap gap-1">
                  {skillsList.map(skill => <Badge key={skill} label={skill} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Shared Resume Sections (used by both desktop & mobile) ---
function ResumeContent({ data }: { data: ResumeData }) {
  return (
    <>
      {/* Education */}
      <div>
        <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 border-t border-[var(--border)] pt-3">Education</h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-mono font-bold text-base text-[var(--foreground)]">{edu.institution}</h3>
                <span className="font-mono text-xs text-[var(--foreground)]">{edu.dates}</span>
              </div>
              <p className="font-mono text-sm text-[var(--foreground)]">{edu.degree}</p>
              {edu.details && (
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {edu.details.map((detail, dIdx) => (
                    <li key={dIdx} className="font-body text-xs text-[var(--muted)]">{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 border-t border-[var(--border)] pt-3">Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5">
                <h3 className="font-mono font-bold text-base text-[var(--foreground)]">{exp.company}</h3>
                <span className="font-mono text-xs text-[var(--foreground)]">{exp.dates}</span>
              </div>
              <p className="font-mono text-sm text-[var(--foreground)] mb-1">
                {exp.role}{" "}
                <span className="text-[var(--muted)]">{` // ${exp.location}`}</span>
              </p>
              <ul className="list-disc list-inside space-y-1">
                {exp.points.map((point, pIdx) => (
                  <li key={pIdx} className="font-body text-xs text-[var(--muted)] leading-snug">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <div>
          <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 border-t border-[var(--border)] pt-3">Publications</h2>
          <div className="space-y-3">
            {data.publications.map((pub, idx) => (
              <div key={idx}>
                <h3 className="font-mono font-bold text-base text-[var(--foreground)]">{pub.title}</h3>
                <p className="font-body text-xs text-[var(--muted)]">{pub.authors}</p>
                <p className="font-mono text-xs text-[var(--foreground)]">
                  {pub.journal ? `${pub.journal}, ` : ''}{pub.date}
                  {pub.doi && (
                    <Link href={pub.href || `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline ml-2">
                      [DOI: {pub.doi}]
                    </Link>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h2 className="font-header text-xl uppercase text-[var(--foreground)] mb-2 border-t border-[var(--border)] pt-3">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-0.5">
                  <h3 className="font-mono font-bold text-base text-[var(--foreground)]">{proj.title}</h3>
                  <span className="font-mono text-xs text-[var(--foreground)]">{proj.dates}</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {proj.points.map((point, pIdx) => (
                    <li key={pIdx} className="font-body text-xs text-[var(--muted)] leading-snug">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// --- Helper Components ---
function ContactItem({ icon: Icon, text, href, target }: { icon: React.ElementType; text: string; href?: string; target?: string }) {
  const content = (
    <span className="flex items-center gap-1.5 group">
      <Icon className="h-3.5 w-3.5 text-[var(--foreground)] group-hover:text-[var(--accent)]" strokeWidth={2} />
      <span>{text}</span>
    </span>
  );
  if (href) {
    return <Link href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="block text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">{content}</Link>;
  }
  return <div className="flex items-center gap-1.5 text-[var(--foreground)]">{content}</div>;
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-[var(--border)]/50 bg-transparent px-1.5 py-0.5 text-[10px] font-mono font-bold text-[var(--foreground)]">
      {label}
    </span>
  );
}
