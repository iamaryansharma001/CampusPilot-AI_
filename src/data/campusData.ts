export interface CampusLocation {
  id: string;
  name: string;
  shortName: string;
  category: 'academic' | 'labs' | 'amenities' | 'student-services' | 'sports';
  categoryLabel: string;
  block: string;
  floor: string;
  description: string;
  facilities: string[];
  openHours: string;
  coordinates: { x: number; y: number }; // SVG map percentage coordinates
  popularScore: number;
  contact?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  tagline: string;
  category: 'hackathon' | 'technical' | 'cultural' | 'academic' | 'sports';
  categoryLabel: string;
  date: string;
  time: string;
  locationId: string;
  locationName: string;
  roomOrHall: string;
  status: 'upcoming' | 'ongoing' | 'past';
  attendeesCount: number;
  description: string;
  highlights: string[];
  bannerGradient: string;
}

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'turing-center',
    name: 'Alan Turing Computing Center',
    shortName: 'Turing Lab 4',
    category: 'labs',
    categoryLabel: 'Labs & Tech',
    block: 'Block A (East Wing)',
    floor: '2nd Floor, Rooms 201-208',
    description: 'Premier computing facility housing Advanced AI & ML labs, GPU clusters, and high-throughput research workstations for CSE & AIML students.',
    facilities: ['Lab 4 (AI/ML & Deep Learning)', 'NVIDIA RTX Workstations', 'Cloud Sandbox Terminals', 'High-Speed LAN & Wi-Fi 6', 'Server Rack Room'],
    openHours: '08:00 AM – 09:30 PM (Mon-Sat)',
    coordinates: { x: 74, y: 32 },
    popularScore: 98,
    contact: 'Prof. K. Verma, Incharge'
  },
  {
    id: 'kalam-block',
    name: 'Dr. APJ Abdul Kalam Tech Block',
    shortName: 'Kalam Block & Audi-3',
    category: 'academic',
    categoryLabel: 'Academic Block',
    block: 'Block B (Central Campus)',
    floor: 'Ground & 1st Floor',
    description: 'Central engineering complex hosting grand auditoriums, lecture theatres, and cross-department innovation workshops.',
    facilities: ['Audi-3 (800-seat acoustic hall)', 'Robotics & IoT Prototyping Lab', 'Smart Interactive Classrooms', 'Department Conference Lounge'],
    openHours: '08:30 AM – 08:00 PM',
    coordinates: { x: 50, y: 44 },
    popularScore: 95,
    contact: 'Dean Academics Office'
  },
  {
    id: 'ramanujan-block',
    name: 'Ramanujan Mathematical Science Block',
    shortName: 'Ramanujan Block',
    category: 'academic',
    categoryLabel: 'Academic Block',
    block: 'Block C (North Campus)',
    floor: '2nd Floor, Cabin 214',
    description: 'Home to the Department of Applied Mathematics and computing theory halls. Center for tutorial evaluations and faculty counseling.',
    facilities: ['Cabin 214 (Dr. S. Rao)', 'Statistical Modeling Lab', 'Lecture Theatres LT-1 to LT-6', 'Faculty Consultation Rooms'],
    openHours: '09:00 AM – 05:30 PM',
    coordinates: { x: 28, y: 24 },
    popularScore: 88,
    contact: 'Dr. S. Rao (Cabin 214)'
  },
  {
    id: 'central-library',
    name: 'Dr. Vikram Sarabhai Central Library',
    shortName: 'Central Library',
    category: 'amenities',
    categoryLabel: 'Library & Study',
    block: 'Knowledge Complex',
    floor: '3 Floors (Levels 1-3)',
    description: 'Quiet study sanctuaries with 85,000+ volumes, IEEE digital repositories, collaborative discussion pods, and 24x7 reading zones.',
    facilities: ['24x7 Digital Reading Hall', 'Discussion Cubicles', 'IEEE & ACM Digital Kiosks', 'Photocopy & Printing Hub', 'Book Borrowing Desks'],
    openHours: '24 Hours (Digital Section) | 08:00 AM - 10:00 PM (Lending)',
    coordinates: { x: 52, y: 18 },
    popularScore: 96,
    contact: 'library@campus.edu'
  },
  {
    id: 'cafeteria',
    name: 'Campus Food Court & Nescafe Lounge',
    shortName: 'Campus Cafeteria',
    category: 'amenities',
    categoryLabel: 'Dining & Social',
    block: 'Student Plaza',
    floor: 'Ground & Terrace Level',
    description: 'Lively social hub serving multi-cuisine meals, artisanal coffees, fresh juices, and grab-and-go student lunch combos.',
    facilities: ['Multi-cuisine Food Counters', 'Nescafe Coffee Kiosk', 'Outdoor Shaded Seating', 'Digital UPI Express Checkout'],
    openHours: '07:30 AM – 11:00 PM',
    coordinates: { x: 30, y: 65 },
    popularScore: 92,
    contact: 'Student Welfare Catering'
  },
  {
    id: 'amphitheatre',
    name: 'Central Open-Air Amphitheatre',
    shortName: 'OAT & Cultural Quad',
    category: 'amenities',
    categoryLabel: 'Events & Culture',
    block: 'Central Quadrangle',
    floor: 'Open Amphitheatre',
    description: 'Tiered stone amphitheatre with stage lighting and acoustic surround, hosting university hackathons, fests, and musical nights.',
    facilities: ['Tiered Seating for 2,500', 'Elevated Performance Stage', 'High-Lumen Projector Screen', 'Green Rooms & AV Booth'],
    openHours: '06:00 AM – 10:00 PM',
    coordinates: { x: 70, y: 68 },
    popularScore: 90,
    contact: 'Student Council Secretariat'
  },
  {
    id: 'admin-block',
    name: 'Chanakya Administrative Block',
    shortName: 'Admin & Exam Cell',
    category: 'student-services',
    categoryLabel: 'Student Services',
    block: 'Administration Gateway',
    floor: 'Ground Floor',
    description: 'Primary administrative focal point for fee clearances, exam hall tickets, scholarship dockets, and student verification registries.',
    facilities: ['Academic Cell Counter A & B', 'Exam Controller Room 102', 'Fee Counter & Accounts Desk', 'Registrar Office'],
    openHours: '09:00 AM – 05:00 PM (Lunch 1-2 PM)',
    coordinates: { x: 18, y: 46 },
    popularScore: 84,
    contact: 'admin.desk@campus.edu'
  },
  {
    id: 'sports-complex',
    name: 'Major Dhyan Chand Sports Complex',
    shortName: 'Sports Complex',
    category: 'sports',
    categoryLabel: 'Sports & Fitness',
    block: 'South Athletics Zone',
    floor: 'Indoor Arena & Outdoor Ground',
    description: 'Comprehensive athletics center featuring wooden badminton courts, indoor squash, gym cardio suite, and athletic tracks.',
    facilities: ['Indoor Badminton Courts', 'Cardio & Strength Gym', 'Table Tennis Arena', 'Locker & Shower Rooms'],
    openHours: '06:00 AM – 09:00 AM & 04:30 PM – 09:00 PM',
    coordinates: { x: 82, y: 84 },
    popularScore: 86,
    contact: 'Physical Education Dept'
  }
];

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'event-copilot',
    title: 'GitHub Copilot Dev Days / OSEN Edition',
    tagline: 'Hands-on AI-assisted engineering and developer tools showcase',
    category: 'hackathon',
    categoryLabel: 'Special Edition',
    date: 'Today • Oct 16, 2026',
    time: '10:00 AM – 05:30 PM',
    locationId: 'kalam-block',
    locationName: 'Dr. APJ Abdul Kalam Tech Block',
    roomOrHall: 'Audi-3 Auditorium',
    status: 'ongoing',
    attendeesCount: 380,
    description: 'Flagship open-source developer summit featuring keynotes on agentic workflows, GitHub Copilot ecosystem, and modern UI engineering.',
    highlights: ['Developer Keynotes', 'Live Hackathon Track', 'Copilot Swag & Badges', 'Networking Lunch'],
    bannerGradient: 'from-[#4d8eff]/30 via-[#571bc1]/30 to-[#4cd7f6]/20'
  },
  {
    id: 'event-genai-bootcamp',
    title: 'Generative AI & LLM Hands-on BootCamp',
    tagline: 'Build agentic pipelines with Python and modern model APIs',
    category: 'technical',
    categoryLabel: 'Workshop',
    date: 'Oct 18 – 19, 2026',
    time: '09:30 AM – 04:30 PM',
    locationId: 'turing-center',
    locationName: 'Alan Turing Computing Center',
    roomOrHall: 'Lab 4 (AI/ML Lab)',
    status: 'upcoming',
    attendeesCount: 120,
    description: 'Two-day rigorous hands-on technical workshop for 2nd and 3rd year CSE/AIML scholars covering fine-tuning, embeddings, and rag pipelines.',
    highlights: ['Hands-on GPU terminals', 'Python 3.11 starter kits', 'Certificate of Excellence', 'Industry Mentorship'],
    bannerGradient: 'from-[#009eb9]/30 via-[#4d8eff]/30 to-[#571bc1]/20'
  },
  {
    id: 'event-hostel-hackathon',
    title: 'Inter-Hostel Innovation Night & Tech Showcase',
    tagline: '24-hour rapid prototyping under the stars',
    category: 'hackathon',
    categoryLabel: 'Hackathon',
    date: 'Oct 24, 2026',
    time: '06:00 PM – Next Day 06:00 PM',
    locationId: 'amphitheatre',
    locationName: 'Central Open-Air Amphitheatre',
    roomOrHall: 'OAT Quad Stage',
    status: 'upcoming',
    attendeesCount: 450,
    description: 'Annual flagship overnight innovation festival bringing together hostel squads across campus for hardware hacks, AI apps, and pitch battles.',
    highlights: ['Cash Prizes ₹50,000', 'Midnight Pizza & RedBull', 'Live Stage Demos', 'Hostel Trophy'],
    bannerGradient: 'from-[#571bc1]/40 via-[#4d8eff]/30 to-[#4cd7f6]/20'
  },
  {
    id: 'event-maths-seminar',
    title: 'Modern Optimization & Linear Algebra Seminar',
    tagline: 'Practical geometric intuition behind deep neural architectures',
    category: 'academic',
    categoryLabel: 'Guest Lecture',
    date: 'Oct 22, 2026',
    time: '02:00 PM – 04:00 PM',
    locationId: 'ramanujan-block',
    locationName: 'Ramanujan Mathematical Science Block',
    roomOrHall: 'Lecture Hall LT-2',
    status: 'upcoming',
    attendeesCount: 160,
    description: 'Special lecture on matrix eigenvalues, singular value decomposition (SVD), and multivariable gradient descent in high dimensions.',
    highlights: ['Speaker: Dr. S. Rao', 'Tutorial Sheet 4 Discussions', 'Research Paper Insights'],
    bannerGradient: 'from-[#4cd7f6]/30 via-[#4d8eff]/30 to-[#571bc1]/20'
  },
  {
    id: 'event-sports-meet',
    title: 'Inter-Branch Badminton Championship',
    tagline: 'Fast-paced doubles and singles branch knockout tournament',
    category: 'sports',
    categoryLabel: 'Athletics',
    date: 'Oct 28, 2026',
    time: '05:00 PM – 09:00 PM',
    locationId: 'sports-complex',
    locationName: 'Major Dhyan Chand Sports Complex',
    roomOrHall: 'Indoor Court 1 & 2',
    status: 'upcoming',
    attendeesCount: 210,
    description: 'Cheer on branch teams as CSAIML takes on ECE and Mechanical in the inter-branch autumn badminton trophy.',
    highlights: ['Professional Synthetic Courts', 'Branch Rivalries', 'Live Scoreboards'],
    bannerGradient: 'from-[#adc6ff]/30 via-[#009eb9]/30 to-[#3b82f6]/20'
  }
];

export interface NavigationRouteStep {
  instruction: string;
  distance: string;
  icon: string;
}

export interface NavigationRoute {
  fromId: string;
  toId: string;
  distanceMeters: number;
  walkingMinutes: number;
  steps: NavigationRouteStep[];
}

export function getCalculatedRoute(fromId: string, toId: string): NavigationRoute {
  const fromLoc = CAMPUS_LOCATIONS.find(l => l.id === fromId) || CAMPUS_LOCATIONS[0];
  const toLoc = CAMPUS_LOCATIONS.find(l => l.id === toId) || CAMPUS_LOCATIONS[1];

  // Calculate approximate distance based on coordinates
  const dx = (toLoc.coordinates.x - fromLoc.coordinates.x);
  const dy = (toLoc.coordinates.y - fromLoc.coordinates.y);
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = Math.max(60, Math.round(pixelDist * 6.5));
  const walkingMinutes = Math.max(1, Math.round(distanceMeters / 75));

  const steps: NavigationRouteStep[] = [
    {
      instruction: `Start from ${fromLoc.name} (${fromLoc.block})`,
      distance: '0 m',
      icon: 'my_location'
    },
    {
      instruction: 'Head towards the central pedestrian avenue and follow covered walkway',
      distance: `${Math.round(distanceMeters * 0.4)} m`,
      icon: 'straight'
    },
    {
      instruction: `Turn ${toLoc.coordinates.x > fromLoc.coordinates.x ? 'right' : 'left'} past the Student Plaza fountain`,
      distance: `${Math.round(distanceMeters * 0.35)} m`,
      icon: toLoc.coordinates.x > fromLoc.coordinates.x ? 'turn_right' : 'turn_left'
    },
    {
      instruction: `Arrive at ${toLoc.name} (${toLoc.floor})`,
      distance: `${Math.round(distanceMeters * 0.25)} m`,
      icon: 'location_on'
    }
  ];

  return {
    fromId,
    toId,
    distanceMeters,
    walkingMinutes,
    steps
  };
}

export interface MockChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggestion?: {
    type: 'navigate' | 'view_event' | 'view_location';
    targetId: string;
    label: string;
  };
}

export const DEMO_ASSISTANT_REPLIES: Record<string, { text: string; action?: { type: 'navigate' | 'view_event' | 'view_location'; targetId: string; label: string } }> = {
  'library': {
    text: 'Dr. Vikram Sarabhai Central Library is located in the Knowledge Complex (Level 1-3). The Digital Reading Section operates 24x7 with biometric entry for all enrolled students.',
    action: { type: 'navigate', targetId: 'central-library', label: 'Navigate to Central Library' }
  },
  'lab 4': {
    text: 'Lab 4 (Advanced AI & Machine Learning Lab) is situated on the 2nd Floor of the Alan Turing Computing Center (Block A). It houses high-performance GPU workstations and research terminals.',
    action: { type: 'navigate', targetId: 'turing-center', label: 'Get Directions to Turing Lab 4' }
  },
  'dr. s. rao': {
    text: 'Dr. S. Rao (Applied Mathematics) is in Cabin 214 on the 2nd floor of Ramanujan Block. Office hours are Tuesday & Thursday 2:00 PM – 4:00 PM for tutorial assignments.',
    action: { type: 'navigate', targetId: 'ramanujan-block', label: 'Navigate to Ramanujan Block' }
  },
  'events': {
    text: 'Today on campus we have the GitHub Copilot Dev Days / OSEN Edition happening right now at Audi-3 in Kalam Block! Upcoming events also include the Inter-Hostel Hackathon and GenAI Bootcamp.',
    action: { type: 'view_event', targetId: 'event-copilot', label: 'View Copilot Dev Days Details' }
  },
  'food': {
    text: 'The Campus Food Court and Nescafe Lounge is located at the Student Plaza (open until 11:00 PM). Fresh juices, lunch thalis, and quick bites are available with digital UPI payment.',
    action: { type: 'navigate', targetId: 'cafeteria', label: 'Directions to Food Court' }
  },
  'exam': {
    text: 'The Academic & Exam Cell is on the ground floor of Chanakya Administrative Block. Clearances and hall ticket discrepancies can be resolved between 9:00 AM and 5:00 PM.',
    action: { type: 'navigate', targetId: 'admin-block', label: 'Go to Admin & Exam Cell' }
  }
};
