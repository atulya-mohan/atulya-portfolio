// Curated career timeline for the about-me page (TriBandTimeline).
// Top band = education, bottom band = experience. Each segment carries rich
// `details` surfaced by the in-box detail popup, plus an optional brand `logo_bg`.

import type { TimelineSeg } from '@/lib/types';

const L = '/images/timeline';

export const careerTop: TimelineSeg[] = [
  {
    id: 'purdue',
    start: '2020-08',
    end: '2024-05',
    label: 'Purdue University',
    logo_url: `${L}/purdue-p.svg`,
    type: 'education',
    details: {
      institution: 'Purdue University',
      degree: 'B.S. Mechanical Engineering',
      field_of_study: 'Machine Design · Controls · Thermofluids',
      location: 'West Lafayette, IN',
      description:
        'Built a hardware-engineering foundation — machine design, controls, FEA, statics & dynamics, fluid mechanics, thermodynamics, and heat & mass transfer.',
      achievements: [
        'Capstone: led design of an assistive wearable necklace — 8 ultrasonic + 8 IR sensors and 8 haptic motors relaying 360° environment via an I2C/Arduino system.',
      ],
    },
  },
  {
    id: 'cmu',
    start: '2025-01',
    end: '2025-12',
    label: 'Carnegie Mellon University',
    logo_url: `${L}/cmu.png`,
    type: 'education',
    details: {
      institution: 'Carnegie Mellon University',
      degree: 'M.S. Engineering & Technology Innovation Management (ETIM)',
      field_of_study: 'Product & Business Strategy',
      location: 'Pittsburgh, PA',
      description:
        'Broadened hardware depth with product management, data science, quantitative entrepreneurship, and how to scale systems and teams.',
      achievements: [
        'Coursework: Electromechanical Systems Design, Data Science, Quantitative Entrepreneurship, Product Management.',
        'Launch-A-Birdie: designed an automatic badminton shuttlecock launcher in Fusion 360 with Arduino-coordinated servo and stepper subsystems.',
      ],
    },
  },
];

export const careerBottom: TimelineSeg[] = [
  {
    id: 'michelin-sc',
    start: '2022-05',
    end: '2022-08',
    label: 'Michelin — PRIME',
    logo_url: `${L}/michelin.svg`,
    logo_bg: '#2a66b0',
    type: 'experience',
    details: {
      company: 'Michelin North America (PRIME)',
      position: 'Process Quality Engineering Intern',
      location: 'Greenville, SC',
      description: 'Drove a high-priority scrap-defect investigation on the tire production line.',
      responsibilities: [
        'Inspected 500+ tires and recorded multi-parameter data to isolate a high-priority scrap defect.',
        'Designed a go/no-go gauge and iterated 3D-printed prototypes with operator feedback.',
        'Drove a 100-unit stainless-steel rollout applying DFM principles.',
      ],
      technologies: ['DFM', '3D Printing', 'GD&T', 'Metrology'],
    },
  },
  {
    id: 'bipl',
    start: '2023-05',
    end: '2023-12',
    label: 'Purdue — BIPL',
    logo_url: `${L}/timeline_33c5c101-5a0a-4bdc-bbd1-8e1429668a84.svg`,
    type: 'experience',
    details: {
      company: 'Purdue University — BIPL',
      position: 'Undergraduate Research Assistant',
      location: 'West Lafayette, IN',
      description: 'Simulated smart-material actuators, contributing to a co-authored publication.',
      responsibilities: [
        'Designed and simulated strain-field behavior of 2D dielectric elastomer actuator arrays in Abaqus.',
        'Mapped temperature to applied voltage with equibiaxial prestretch and thermally coupled elements.',
        'Work led to a co-authored publication.',
      ],
      technologies: ['Abaqus', 'FEA', 'Smart Materials'],
    },
  },
  {
    id: 'michelin-in',
    start: '2024-09',
    end: '2024-12',
    label: 'Michelin — R&D',
    logo_url: `${L}/michelin.svg`,
    logo_bg: '#2a66b0',
    type: 'experience',
    details: {
      company: 'Michelin R&D',
      position: 'Research & Development Intern',
      location: 'Pune, India',
      description: 'Quantified how mold geometry drives final tire-geometry variation.',
      responsibilities: [
        'Analyzed lab-measured mold geometry and mapped mold codes to production tires and irregular-wear reports.',
        'Quantified the contribution of mold geometry to final tire-geometry variation.',
      ],
      technologies: ['Metrology', 'Data Analysis'],
    },
  },
  {
    id: 'fourier',
    start: '2025-05',
    end: '2025-08',
    label: 'Fourier',
    logo_url: `${L}/fourier.png`,
    logo_bg: '#b49a75',
    type: 'experience',
    details: {
      company: 'Fourier',
      position: 'Hardware Engineering Intern',
      location: 'Mountain View, CA',
      description: 'Owned a hydrogen-dryer program end-to-end for a green-hydrogen electrolyzer startup.',
      responsibilities: [
        'Inherited the hydrogen dryer program with zero documentation; characterized the existing PSA dryer and ruled out in-situ TSA conversion.',
        'Designed and built a 3-column aluminum dryer with ex-situ desiccant regeneration to hit a 1.5-month pilot deadline.',
        'Extended continuous drying from ~4 hours to ~30 hours and authored a full knowledge-transfer document.',
        'Built a sheet-metal test stand to evaluate power-supply behavior and troubleshoot I2C communication.',
      ],
      technologies: ['Fusion 360', 'Sheet Metal', 'PSA / TSA', 'I2C'],
    },
  },
  {
    id: 'roco',
    start: '2026-02',
    end: '2026-05',
    label: 'RoCo Global',
    logo_url: `${L}/roco.svg`,
    type: 'experience',
    details: {
      company: 'RoCo Global',
      position: 'NPI Engineer Intern',
      location: 'Pittsburgh, PA',
      description: 'New-product introduction for a polyurethane-recycling materials startup.',
      responsibilities: [
        'Designed and prototyped a custom automated sieve-feeding mechanism in Fusion 360, increasing manufacturing throughput by 300%.',
        'Coordinated with three external labs to test PU foam-additive and spray-foam formulations against ASTM standards.',
      ],
      technologies: ['Fusion 360', 'DFM', 'ASTM Testing'],
    },
  },
  {
    id: 'pebble',
    start: '2026-06',
    end: null,
    label: 'Pebble Mobility',
    logo_url: `${L}/pebble.svg`,
    logo_bg: '#575349',
    type: 'experience',
    details: {
      company: 'Pebble Mobility',
      position: 'Plumbing & Fluid Systems Design Engineer',
      location: 'California',
      description:
        'Incoming (June 2026): plumbing and fluid-systems design for Pebble’s all-electric travel trailer, the Pebble Flow.',
      responsibilities: [],
      technologies: ['Fluid Systems', 'CAD', 'DFM'],
    },
  },
];
