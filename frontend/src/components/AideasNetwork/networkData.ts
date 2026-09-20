export interface Member {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

export interface NetworkData {
  core: {
    id: string;
    name: string;
    role: string;
    logo: string;
    description: string;
  };
  leadership: Member[];
  heads: Member[];
}

export const NETWORK_DATA: NetworkData = {
  core: {
    id: 'aideas',
    name: 'aIDEAS',
    role: 'AI & Data Science Association',
    logo: '/logo.png',
    description: 'The student association representing AI & Data Science at PVG, driving innovation, collaborative research, and real-world tech projects.',
  },
  leadership: [
    {
      id: 'hod',
      name: 'Prof. Dr. S. A. Mahajan',
      role: 'Head of Department',
      department: 'Computer & AI/DS',
      image: '/faculty/hod_photo.png',
      bio: 'Guiding the overarching vision of aIDEAS, fostering academic excellence, research initiatives, and student empowerment across AI/DS.',
      linkedin: 'https://linkedin.com',
      email: 'hod@pvg.edu',
    },
    {
      id: 'coordinator',
      name: 'Prof. M. R. Apsingekar',
      role: 'Faculty Coordinator',
      department: 'Faculty Mentorship',
      image: '/faculty/faculty_coordinator_photo.png',
      bio: 'Mentoring student leaders, coordinating department activities, industry workshops, and student academic welfare.',
      linkedin: 'https://linkedin.com',
      email: 'coordinator@pvg.edu',
    },
    {
      id: 'gs',
      name: 'General Secretary',
      role: 'General Secretary (GS)',
      department: 'Executive Leadership',
      image: '/members/gs.png',
      bio: 'Leading overall student operations, strategic initiatives, flagship events, and industry collaborations.',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      id: 'jgs',
      name: 'Joint General Secretary',
      role: 'Joint General Secretary (JGS)',
      department: 'Executive Operations',
      image: '/members/jgs.png',
      bio: 'Coordinating vice executive operations, team logistics, cross-department alignment, and student community growth.',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  ],
  heads: [
    {
      id: 'divesh_th',
      name: 'Divesh',
      role: 'Technical Head',
      department: 'Technical Team',
      image: '/members/divesh_th.png',
      bio: 'Oversees technical hackathons, AI model workshops, coding sprints, and dev infrastructure.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'aa_th',
      name: 'Aaditya',
      role: 'Technical Co-Head',
      department: 'Technical Team',
      image: '/members/aa_th.png',
      bio: 'Co-leads technical projects, cloud deployments, and AI coding competitions.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'pk_th',
      name: 'Prathamesh',
      role: 'Technical Co-Head',
      department: 'Technical Team',
      image: '/members/pk_th.png',
      bio: 'Manages student development teams and software engineering workshops.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'sanket_desig',
      name: 'Sanket',
      role: 'Design Head',
      department: 'Design Team',
      image: '/members/sanket_desig.png',
      bio: 'Crafts visual identities, UI design systems, event banners, and brand guidelines.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'kinjal_desig',
      name: 'Kinjal',
      role: 'Design Co-Head',
      department: 'Design Team',
      image: '/members/kinjal_desig.png',
      bio: 'Co-creates UI design layouts, promotional graphics, and brand visuals for aIDEAS.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'pranshu_em',
      name: 'Pranshu',
      role: 'Event Management Head',
      department: 'Events Team',
      image: '/members/pranshu_em.png',
      bio: 'Manages national hackathons, guest speaker series, AI summits, and student workshops.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'anvi_event',
      name: 'Anvi',
      role: 'Event Management Co-Head',
      department: 'Events Team',
      image: '/members/anvi_event.png',
      bio: 'Co-coordinates event operations, schedule planning, and stage management.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'kush_marketing',
      name: 'Kush',
      role: 'Marketing Head',
      department: 'Marketing Team',
      image: '/members/kush_marketing.png',
      bio: 'Drives marketing campaigns, sponsorship outreach, and brand publicity.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'manish_marketing',
      name: 'Manish',
      role: 'Marketing Co-Head',
      department: 'Marketing Team',
      image: '/members/manish_marketing_cohead.png',
      bio: 'Co-leads outreach strategy, brand promotion, and public relations.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'atharva_media',
      name: 'Atharva',
      role: 'Media Head',
      department: 'Media & Production',
      image: '/members/atharva_mediahead.png',
      bio: 'Spearheads video production, event coverage, and multimedia content.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'arnav_media',
      name: 'Arnav',
      role: 'Media Co-Head',
      department: 'Media & Production',
      image: '/members/arnav_media.png',
      bio: 'Co-coordinates photography, reel production, and media archives.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'priti_edito',
      name: 'Priti',
      role: 'Editorial Head',
      department: 'Editorial Team',
      image: '/members/priti_edito.png',
      bio: 'Authors technical blogs, newsletter publications, and association documentation.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'tanvi_edito',
      name: 'Tanvi',
      role: 'Editorial Co-Head',
      department: 'Editorial Team',
      image: '/members/tanvi.png',
      bio: 'Co-edits technical articles, newsletter writeups, and event reports.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'nishi_treasurer',
      name: 'Nishi',
      role: 'Treasurer',
      department: 'Finance & Treasury',
      image: '/members/nishi_treasurer.png',
      bio: 'Manages financial budgeting, event expense tracking, and treasury accounts.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'pranav_treasurer',
      name: 'Pranav',
      role: 'Treasurer Co-Head',
      department: 'Finance & Treasury',
      image: '/members/pranav_treas.png',
      bio: 'Co-manages financial audits, event budget approvals, and sponsorship funds.',
      linkedin: 'https://linkedin.com',
    },
  ],
};
