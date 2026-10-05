
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
      name: 'Prof. Dr. Minakshi Atre ',
      role: 'Head of Department',
      department: 'Computer & AI/DS',
      image: '/faculty/hod_photo.png',
      bio: 'Guiding the overarching vision of aIDEAS, fostering academic excellence, research initiatives, and student empowerment across AI/DS.',
      linkedin: 'https://linkedin.com',
      email: 'hod@pvg.edu',
    },
    {
      id: 'coordinator',
      name: 'Prof. Mrunal U. Buchade',
      role: 'Faculty Coordinator',
      department: 'Assistant Professor',
      image: '/faculty/faculty_coordinator_photo.png',
      bio: 'Mentoring student leaders, coordinating department activities, industry workshops, and student academic welfare.',
      linkedin: 'https://www.linkedin.com/in/mrunal-buchade-98b2241ba',
      email: 'mrunal.buchade@pvgcoet.ac.in',
    },
    {
      id: 'coordinator2',
      name: 'Prof. Krittika Goswami',
      role: 'Faculty Coordinator',
      department: 'Assistant Professor',
      image: '/faculty/kritika_goswami.png',
      bio: 'Guiding technical initiatives, mentoring student leads, coordinating department activities and student welfare.',
      linkedin: 'https://www.linkedin.com/in/krittika-goswami-347203140',
      email: 'krittika.goswami@pvgcoet.ac.in',
    },
    {
      id: 'gs',
      name: 'Soham Muley',
      role: 'General Secretary (GS)',
      department: 'Executive Leadership',
      image: '/members/gs.webp',
      bio: 'Leading overall student operations, strategic initiatives, flagship events, and industry collaborations.',
      linkedin: 'https://www.linkedin.com/in/soham-muley-44b81430a',
      instagram: 'https://www.instagram.com/_sohammmmmm_',
      email: 'sohammuley1702@gmail.com',
    },
    {
      id: 'jgs',
      name: 'Saumya Raut',
      role: 'Joint General Secretary (JGS)',
      department: 'Executive Operations',
      image: '/members/jgs.webp',
      bio: 'Coordinating vice executive operations, team logistics, cross-department alignment, and student community growth.',
      linkedin: 'https://www.linkedin.com/in/saumya-raut-98474a37b',
      instagram: 'https://www.instagram.com/sau_meow_',
      email: 'saumyaraut2006@gmail.com',
    },
  ],
  heads: [
    {
      id: 'aa_th',
      name: 'Aditya Ajay Tilekar',
      role: 'Technical Head',
      department: 'Technical Team',
      image: '/members/divesh_th.webp',
      bio: 'Leads technical projects, hackathons, cloud deployments, and AI coding competitions.',
      linkedin: 'https://www.linkedin.com/in/aditya-tilekar-7b3614320',
      email: 'adi06tilekar@gmail.com',
    },
    {
      id: 'divesh_th',
      name: 'Divya Chaudhari',
      role: 'Technical Co-Head',
      department: 'Technical Team',
      image: '/members/aa_th.webp',
      bio: 'Co-leads technical hackathons, AI model workshops, coding sprints, and dev infrastructure.',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'pk_th',
      name: 'Saanidhi Gade',
      role: 'Technical Co-Head',
      department: 'Technical Team',
      image: '/members/pk_th.webp',
      bio: 'Manages student development teams and software engineering workshops.',
      linkedin: 'https://www.linkedin.com/in/saanidhi-gade/',
      email: 'gadesaanidhi@gmail.com',
    },
    {
      id: 'sanket_desig',
      name: 'Aarya Maynal',
      role: 'Design Head',
      department: 'Design Team',
      image: '/members/sanket_desig.webp',
      bio: 'Crafts visual identities, UI design systems, event banners, and brand guidelines.',
      linkedin: 'https://www.linkedin.com/in/aarya-m-23629829b',
      email: 'aaryascientist1@gmail.com',
    },
    {
      id: 'kinjal_desig',
      name: 'Krish Yogesh Chobe',
      role: 'Design Co-Head',
      department: 'Design Team',
      image: '/members/kinjal_desig.webp',
      bio: 'Co-creates UI design layouts, promotional graphics, and brand visuals for aIDEAS.',
      linkedin: 'https://www.linkedin.com/in/krish-chobe-761361368/',
      email: 'krishchobe@gmail.com',
    },
    {
      id: 'pranshu_em',
      name: 'Pranali Wadghule',
      role: 'Event Management Head',
      department: 'Events Team',
      image: '/members/pranshu_em.webp',
      bio: 'Manages national hackathons, guest speaker series, AI summits, and student workshops.',
      linkedin: 'https://www.linkedin.com/in/pranali-wadghule-9493b1316',
      email: 'pranaliwadghule2006@gmail.com',
    },
    {
      id: 'anvi_event',
      name: 'Tushar Katre',
      role: 'Event Management Co-Head',
      department: 'Events Team',
      image: '/members/anvi_event.webp',
      bio: 'Co-coordinates event operations, schedule planning, and stage management.',
      linkedin: 'https://www.linkedin.com/in/tushar-katre-3a5a65342',
      email: 'tusharkatre215@gmail.com',
    },
    {
      id: 'kush_marketing',
      name: 'Aariya Vora',
      role: 'Marketing Head',
      department: 'Marketing Team',
      image: '/members/kush_marketing.webp',
      bio: 'Drives marketing campaigns, sponsorship outreach, and brand publicity.',
      linkedin: 'https://www.linkedin.com/in/aariya-harshad-vora-6b8755312',
      email: 'aariyavora@gmail.com',
    },
    {
      id: 'manish_marketing',
      name: 'Aditya Krishnaswamy',
      role: 'Marketing Co-Head',
      department: 'Marketing Team',
      image: '/members/manish_marketing_cohead.webp',
      bio: 'Co-leads outreach strategy, brand promotion, and public relations.',
      linkedin: 'https://www.linkedin.com/in/aditya-krishnaswamy-40b443340',
      email: 'adityark1524@gmail.com',
    },
    {
      id: 'atharva_media',
      name: 'Ganesh Rokade',
      role: 'Media Head',
      department: 'Media & Production',
      image: '/members/atharva_mediahead.webp',
      bio: 'Spearheads video production, event coverage, and multimedia content.',
      linkedin: 'https://www.linkedin.com/in/ganeshrokade06',
      email: 'rokadeganesh701@gmail.com',
    },
    {
      id: 'arnav_media',
      name: 'Sarvadny Manish Pawar',
      role: 'Media Co-Head',
      department: 'Media & Production',
      image: '/members/arnav_media.webp',
      bio: 'Co-coordinates photography, reel production, and media archives.',
      linkedin: 'https://www.linkedin.com/in/sarvadny-pawar-229265373',
      email: 'sarvadnypawar007@gmail.com',
    },
    {
      id: 'priti_edito',
      name: 'Omkar Mulage',
      role: 'Editorial Head',
      department: 'Editorial Team',
      image: '/members/priti_edito.webp',
      bio: 'Authors technical blogs, newsletter publications, and association documentation.',
      linkedin: 'https://www.linkedin.com/in/omkar-mulage-708b77320',
      email: 'omkarmulage9@gmail.com',
    },
    {
      id: 'nishi_treasurer',
      name: 'Kartik Mitkar',
      role: 'Treasurer',
      department: 'Finance & Treasury',
      image: '/members/nishi_treasurer.webp',
      bio: 'Manages financial budgeting, event expense tracking, and treasury accounts.',
      linkedin: 'https://www.linkedin.com/in/kartik-mitkar-14938a3b2',
      email: 'kartikmitkar0706@gmail.com',
    },
  ],
};


/*

export interface Member {
  id: string;
  name: string;
  role: string;
  department?: string;
  domain?: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

export const NETWORK_DATA = {
  core: {
    id: 'core-node',
    name: 'AiDeas Network',
    role: 'Central Hub',
    department: 'PVGCOET',
    image: '/logo.png',
    bio: 'The core hub connecting all domains and leadership teams across AiDeas.',
  },
  leadership: [
    {
      id: 'faculty-1',
      name: 'Prof. M. R. Apsingekar',
      role: 'Faculty Coordinator',
      department: 'Faculty Advisor',
      image: '/members/gs.webp',
      bio: 'Guiding the AiDeas student organization towards academic and technical excellence.',
    },
    {
      id: 'gs-1',
      name: 'General Secretary',
      role: 'General Secretary (GS)',
      department: 'Executive Committee',
      image: '/members/gs.webp',
      bio: 'Leading overall operations and strategic direction for AiDeas.',
    },
    {
      id: 'jgs-1',
      name: 'Joint General Secretary',
      role: 'Joint General Secretary (JGS)',
      department: 'Executive Committee',
      image: '/members/jgs.webp',
      bio: 'Co-coordinating domain activities and organizational workflows.',
    },
  ],
  heads: [
    {
      id: 'tech-1',
      name: 'Tech Head 1',
      role: 'Technical Head',
      department: 'Technical Domain',
      image: '/members/tech-head-1.webp',
      bio: 'Overseeing software projects, hackathons, and technical initiatives.',
    },
    {
      id: 'tech-2',
      name: 'Tech Head 2',
      role: 'Technical Co-Head',
      department: 'Technical Domain',
      image: '/members/tech-head-2.webp',
      bio: 'Managing technical workshops and project execution.',
    },
    {
      id: 'tech-3',
      name: 'Tech Head 3',
      role: 'Technical Co-Head',
      department: 'Technical Domain',
      image: '/members/tech-head-3.webp',
      bio: 'Driving AI research and open-source contributions.',
    },
    {
      id: 'media-1',
      name: 'Media & Marketing Head',
      role: 'Media Head',
      department: 'Media & Marketing',
      image: '/members/media-marketing-head-1.webp',
      bio: 'Leading branding, social outreach, and media production.',
    },
    {
      id: 'media-2',
      name: 'Media & Marketing Co-Head',
      role: 'Media Co-Head',
      department: 'Media & Marketing',
      image: '/members/media-marketing-head-2.webp',
      bio: 'Co-coordinating media strategy, video edits, and public relations.',
    },
    {
      id: 'design-1',
      name: 'Design Head',
      role: 'Design Head',
      department: 'Design & UI/UX',
      image: '/members/design-head-1.webp',
      bio: 'Crafting visual brand identity, UI designs, and marketing assets.',
    },
    {
      id: 'design-2',
      name: 'Design Co-Head',
      role: 'Design Co-Head',
      department: 'Design & UI/UX',
      image: '/members/design-head-2.webp',
      bio: 'Assisting in graphics creation and event branding.',
    },
    {
      id: 'event-1',
      name: 'Event Management Head 1',
      role: 'Event Head',
      department: 'Event Operations',
      image: '/members/event-management-head-1.webp',
      bio: 'Managing event planning, venue arrangements, and logistics.',
    },
    {
      id: 'event-2',
      name: 'Event Management Head 2',
      role: 'Event Co-Head',
      department: 'Event Operations',
      image: '/members/event-management-head-2.webp',
      bio: 'Coordinating event execution and participant onboarding.',
    },
    {
      id: 'treasurer-1',
      name: 'Treasurer Head',
      role: 'Treasurer',
      department: 'Finance & Treasury',
      image: '/members/treasurer.webp',
      bio: 'Handling budgeting, financial tracking, and sponsor accounts.',
    },
    {
      id: 'editorial-1',
      name: 'Editorial Head',
      role: 'Documentation & Editorial Head',
      department: 'Editorial & PR',
      image: '/members/documentation-editorial.webp',
      bio: 'Managing event reports, official documentation, and newsletter content.',
    },
    {
      id: 'sponsorship-1',
      name: 'Sponsorship & PR Head',
      role: 'Sponsorship Head',
      department: 'Sponsorship & PR',
      image: '/members/sponsorship-pr-head.webp',
      bio: 'Securing corporate sponsors and managing industry partnerships.',
    },
    {
      id: 'sports-1',
      name: 'Sports Secretary',
      role: 'Sports Secretary',
      department: 'Sports & Student Activity',
      image: '/members/sports-secretary.webp',
      bio: 'Organizing sports events and student engagement activities.',
    },
  ],
};*/
