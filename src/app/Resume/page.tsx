'use client';

import { Mail, Linkedin, Phone, MapPin, Download, Globe } from 'lucide-react'; // Added Globe icon
import Link from 'next/link';
import React, { useMemo } from 'react';

// UPDATED: Replaced placeholder data with data extracted from the PDF
const resumeData = {
    name: "Atulya Mohan",
    title: "Mechanical Engineer & ETIM MS Candidate", // Slightly adjusted title
    contact: {
        email: "mohan.atulya26@gmail.com",
        phone: "+1 (848)-264-1381",
        linkedin: "linkedin.com/in/atulya-mohan",
        website: "atulyamohan.com", // Added website from PDF
        location: "Pittsburgh, PA",
    },
    summary: "MS candidate in Engineering & Technology Innovation Management at Carnegie Mellon (GPA: 3.74), complementing a B.S. in Mechanical Engineering from Purdue (GPA: 3.2). Experienced in converting R&D concepts into manufacturable products through hardware design, simulation, prototyping, and data analysis. Demonstrated ability to lead projects, streamline processes, and contribute to technical publications. Seeking roles focused on hardware innovation, product development, and technical strategy in dynamic environments like startups or climate/energy sectors.", // Crafted summary based on PDF content
    education: [
        { institution: "Carnegie Mellon University", degree: "MS in Engineering & Technology Innovation Management", dates: "Jan 2025 - Dec 2025", location: "Pittsburgh, PA", details: ["GPA: 3.74", "Coursework: Quantitative Entrepreneurship, Product Management, Electromechanical Systems Design, Data Science"] },
        { institution: "Purdue University", degree: "Bachelor of Science in Mechanical Engineering", dates: "Aug 2020 - May 2024", location: "West Lafayette, IN", details: ["GPA: 3.2", "Coursework: Thermodynamics, Statics & Dynamics, Fluid Mechanics, Controls, FEA, Machine Design, Heat & Mass Transfer"] },
    ],
    experience: [
        { company: "Fourier", role: "Hardware Engineering Intern", dates: "May 2025 - Aug 2025", location: "Mountain View, CA", points: ["Converted hydrogen dryer from PSA to TSA, integrating PID control and redesigning insulation/sensor layout; stabilized dew-point readings.", "Characterized dryer behavior via experiments; evaluated desiccants.", "Delivered pilot-ready MVP (aluminum & stainless dryers), boosting runtime ~5x (6 hrs to ~30 hrs).", "Built sheet-metal I2C power-supply test stand using OSH Cut fabrication.", "Developed leak-mitigating 3D-printed housings for electrolyzer stacks with vibration damping."] },
        { company: "Michelin", role: "Research & Development Intern", dates: "Sep 2024 - Dec 2024", location: "Pune, India", points: ["Designed and developed a Power App streamlining regional homologation, improving workflow efficiency.", "Standardized tire testing by creating a dashboard consolidating methods and codes.", "Analyzed mold geometry data, linking it to production variations and field wear reports.", "Produced multi-material 3D-printed tire models for demos and education."] },
        { company: "Purdue University", role: "Controls Teaching Assistant", dates: "Jun 2023 - Dec 2023", location: "West Lafayette, IN", points: ["Assisted lab instructor for Controls II, helping students implement LabVIEW programs.", "Supported teams building path-following robots, troubleshooting sensors, motors, and PID tuning.", "Graded assignments and provided help during lab/office hours."] },
        { company: "Purdue University - BIPL", role: "Undergraduate Research Assistant", dates: "May 2023 - Dec 2023", location: "West Lafayette, IN", points: ["Designed and simulated 2D DEA arrays in Abaqus using custom user elements and realistic boundary conditions.", "Built automation scripts for batch simulations, strain computation, and output processing.", "Co-authored peer-reviewed paper (10.34133/cbsystems.0155) on strain-field customization in DEA bioreactors."] },
        { company: "Michelin North America (PRIME)", role: "Process Quality Engineering Intern", dates: "May 2022 - Aug 2022", location: "Greenville, SC", points: ["Investigated scrap defect via machine operation, visual inspection (>500 tires), and data recording.", "Analyzed data to isolate root cause, defined routine test/calibration procedures.", "Designed go/no-go gauge, iterated 3D prototypes with operator feedback, finalized DFM stainless steel design.", "Managed external vendor fabrication for 100-unit order, standardizing checks.", "Presented findings and recommendations to stakeholders and leadership."] },
    ],
    skills: {
        "Design & Simulation Tools": ["SOLIDWORKS", "Siemens NX", "Fusion 360", "Abaqus", "COMSOL", "Figma"],
        "Programming & Data Tools": ["MATLAB", "Python", "R", "Excel", "Power BI"], // Simplified from PDF list
        // Combining Technical Skills from PDF into relevant categories
        "Technical Expertise": ["Controls", "Thermodynamics", "Fluid Mechanics", "Heat Transfer", "FEA", "Machine Design", "DFM/DFA", "GD&T"], // Added from coursework/experience
        "Manufacturing & Prototyping": ["3D Printing", "Rapid Prototyping", "Process Quality Analysis", "Calibration"], // Added from experience
        "Languages": ["English (Native)", "Hindi (Fluent)"]
    },
    publications: [
        { title: "Deep Learning for Strain Field Customization in Bioreactor with Dielectric Elastomer Actuator Array", authors: "Jue Wang, Dhirodaatto Sarkar, Atulya Mohan", journal: "Cyborg and Bionic Systems", date: "Aug 2024", doi: "10.34133/cbsystems.0155", href: "https://doi.org/10.34133/cbsystems.0155" }
    ],
    projects: [
        { title: "Navigation Device for the Visually Impaired", dates: "Jan 2024 - May 2024", points: ["Developed assistive device integrating ultrasonic, infrared sensors, and haptic motors.", "Utilized I2C protocol with Arduino Nano for control, reducing size/complexity."] }
    ]
};

export default function ResumePage() {
    const cssVars = useMemo(
    () =>
      ({
        '--nav-h': '56px',
        '--gap': '12px',
        '--gutter': '22px',
      }) as React.CSSProperties,
    []
  );

  return (
    // Main container prevents page scroll
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-[#F0F2E6] text-black">
      {/* Scrollbar styles for internal scrolling */}
      <style jsx global>{`
        .content-scrollbar::-webkit-scrollbar { width: 8px; height: 8px;}
        .content-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .content-scrollbar::-webkit-scrollbar-thumb { background: transparent; border-radius: 4px; border: 2px solid transparent; background-clip: padding-box; }
        .content-scrollbar:hover::-webkit-scrollbar-thumb { background: black; }
        .content-scrollbar { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .content-scrollbar:hover { scrollbar-color: black transparent; }
      `}</style>
      <section className="px-4 h-full" style={cssVars}>
         {/* Main container uses flex column and calculated height */}
        <div className="pt-[calc(var(--nav-h)+var(--gap))] pb-[var(--gap)] h-full flex flex-col">
          {/* ===== Header Row ===== */}
          <div className="mb-3 flex-shrink-0 flex justify-between items-center border-b border-black pb-2">
            <div>
                 <h1 className="font-header text-4xl uppercase text-black">{resumeData.name}</h1>
                 <p className="font-mono text-lg text-black/80">{resumeData.title}</p>
            </div>
             {/* Download Button */}
             <a
                href="/Atulya_Mohan_Resume.pdf" // UPDATED: Path to the PDF in the public folder
                download="Atulya_Mohan_Resume.pdf"
                className="flex items-center gap-2 border-2 border-[#FF4F00] bg-[#FF4F00] px-3 py-1.5 font-mono text-sm text-white transition-colors hover:bg-opacity-80 flex-shrink-0"
                title="Download Resume PDF"
             >
                <Download className="h-4 w-4" />
                DOWNLOAD PDF
             </a>
          </div>

          {/* ===== Main Content Grid (takes remaining space) ===== */}
          <div className="grid flex-1 min-h-0 grid-cols-3 gap-[var(--gap)]">

            {/* --- Left Column (Contact, Skills) --- */}
            <div className="col-span-1 flex flex-col gap-[var(--gap)]">
                {/* Contact Info */}
                <div className="border border-black p-3 flex-shrink-0">
                    <h2 className="font-header text-xl uppercase text-black mb-2">Contact</h2>
                    <div className="space-y-1 font-mono text-xs">
                        {resumeData.contact.email && <ContactItem icon={Mail} text={resumeData.contact.email} href={`mailto:${resumeData.contact.email}`} />}
                        {resumeData.contact.phone && <ContactItem icon={Phone} text={resumeData.contact.phone} />}
                        {resumeData.contact.linkedin && <ContactItem icon={Linkedin} text={resumeData.contact.linkedin} href={`https://${resumeData.contact.linkedin}`} target="_blank"/>}
                        {resumeData.contact.website && <ContactItem icon={Globe} text={resumeData.contact.website} href={`https://${resumeData.contact.website}`} target="_blank"/>} {/* Added Website */}
                        {resumeData.contact.location && <ContactItem icon={MapPin} text={resumeData.contact.location} />}
                    </div>
                </div>

                {/* Skills */}
                <div className="border border-black p-3 flex-1 min-h-0 flex flex-col">
                    <h2 className="font-header text-xl uppercase text-black mb-2 flex-shrink-0">Skills</h2>
                    <div className="flex-1 overflow-y-auto content-scrollbar pr-1 space-y-3">
                        {Object.entries(resumeData.skills).map(([category, skillsList]) => (
                            <div key={category}>
                                <h3 className="font-mono font-bold text-sm text-black mb-1">{category}</h3>
                                <div className="flex flex-wrap gap-1">
                                    {skillsList.map(skill => <Badge key={skill} label={skill} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Right Column (Summary, Education, Experience, Publications, Projects) --- */}
            <div className="col-span-2 border border-black p-3 flex flex-col min-h-0">
                {/* Content area scrolls if needed */}
                <div className="flex-1 overflow-y-auto content-scrollbar pr-2 space-y-4">
                     {/* Summary */}
                    {resumeData.summary && (
                        <div>
                             <p className="font-body text-sm text-zinc-800 leading-relaxed">{resumeData.summary}</p>
                        </div>
                     )}

                     {/* Education */}
                     <div>
                        <h2 className="font-header text-xl uppercase text-black mb-2 border-t border-black pt-3">Education</h2>
                        <div className="space-y-3">
                            {resumeData.education.map((edu, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-mono font-bold text-base text-black">{edu.institution}</h3>
                                        <span className="font-mono text-xs text-black/70">{edu.dates}</span>
                                    </div>
                                    <p className="font-mono text-sm text-black/90">{edu.degree}</p>
                                    {edu.details && (
                                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                                            {edu.details.map((detail, dIdx) => (
                                                <li key={dIdx} className="font-body text-xs text-zinc-700">{detail}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Experience */}
                     <div>
                        <h2 className="font-header text-xl uppercase text-black mb-2 border-t border-black pt-3">Experience</h2>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp, idx) => (
                                <div key={idx}>
                                     <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-mono font-bold text-base text-black">{exp.company}</h3>
                                        <span className="font-mono text-xs text-black/70">{exp.dates}</span>
                                    </div>
                                    <p className="font-mono text-sm text-black/90 mb-1">
                                        {exp.role}{" "}
                                        <span className="text-black/60">{` // ${exp.location}`}</span>
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                         {exp.points.map((point, pIdx) => (
                                            <li key={pIdx} className="font-body text-xs text-zinc-700 leading-snug">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Publications - ADDED */}
                     {resumeData.publications && resumeData.publications.length > 0 && (
                        <div>
                            <h2 className="font-header text-xl uppercase text-black mb-2 border-t border-black pt-3">Publications</h2>
                            <div className="space-y-3">
                                {resumeData.publications.map((pub, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-mono font-bold text-base text-black">{pub.title}</h3>
                                        <p className="font-body text-xs text-zinc-700">{pub.authors}</p>
                                        <p className="font-mono text-xs text-black/70">
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

                     {/* Projects - ADDED */}
                      {resumeData.projects && resumeData.projects.length > 0 && (
                        <div>
                            <h2 className="font-header text-xl uppercase text-black mb-2 border-t border-black pt-3">Projects</h2>
                            <div className="space-y-4">
                                {resumeData.projects.map((proj, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-mono font-bold text-base text-black">{proj.title}</h3>
                                            <span className="font-mono text-xs text-black/70">{proj.dates}</span>
                                        </div>
                                        <ul className="list-disc list-inside space-y-1">
                                            {proj.points.map((point, pIdx) => (
                                                <li key={pIdx} className="font-body text-xs text-zinc-700 leading-snug">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                      )}

                 </div> {/* End scrollable content area */}
             </div> {/* End right column */}

          </div> {/* End main grid */}
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---
function ContactItem({ icon: Icon, text, href, target }: { icon: React.ElementType, text: string, href?: string, target?: string }) {
    const content = (
        <span className="flex items-center gap-1.5 group">
             <Icon className="h-3.5 w-3.5 text-black/70 group-hover:text-[#FF4F00]" strokeWidth={2}/>
             <span>{text}</span>
        </span>
    );
    if (href) {
        return <Link href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="block text-black hover:text-[#FF4F00] transition-colors">{content}</Link>;
    }
    return <div className="flex items-center gap-1.5 text-black">{content}</div>;
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-black/50 bg-transparent px-1.5 py-0.5 text-[10px] font-mono font-bold text-black">
      {label}
    </span>
  );
}

