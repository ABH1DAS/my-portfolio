/**
 * Project Data & Gallery Strip
 * All project descriptions, metadata, and (Up close) gallery items live here.
 */

export const featuredProjects = [
  {
    id: "civease",
    number: "01",
    name: "CivEase",
    category: "CIVIC ISSUE REPORTING & RESOLUTION",
    year: "2025",
    status: "FULL-STACK PLATFORM",
    description: "Full-stack civic issue reporting and resolution platform connecting citizens with local authorities to report potholes, waste, and waterlogging with photo uploads, geolocation, and an authority analytics dashboard.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel"],
    liveUrl: "https://civease-app.vercel.app/",
    githubUrl: "https://github.com/ABH1DAS/civease-app"
  },
  {
    id: "aquapulse",
    number: "02",
    name: "AquaPulse",
    category: "IOT FLOOD & WATERLOGGING ALERT",
    year: "2026",
    status: "STPI IOT PROJECT",
    description: "IoT-based flood and waterlogging alert system developed during the STPI IoT project. Uses ESP32 and waterproof ultrasonic sensors to monitor road water levels in real time, triggering alerts via LEDs, buzzer, web dashboards, and a mobile app with GPS tracking.",
    tags: ["ESP32", "C/C++", "FastAPI", "Python", "Supabase", "React", "Leaflet Maps", "Flutter", "NEO-6M GPS"],
    liveUrl: "https://stpi-flood-alert-system.vercel.app/",
    githubUrl: "https://github.com/mymailhridipsarma/stpi-flood-alert-system"
  },
  {
    id: "zivan",
    number: "03",
    name: "Zivan",
    category: "HEALTHCARE & WELLBEING",
    year: "2026",
    status: "HEALTH PLATFORM",
    description: "Healthcare and wellbeing platform connecting everyday health monitoring with emergency assistance. Features a patient-focused dashboard tracking vital signs, sleep, hydration, and mental wellbeing, alongside an SOS system locating nearby hospitals.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Health Vitals", "Emergency SOS", "Hospital Locator", "Vercel"],
    liveUrl: "https://nexora-zivan-patient.vercel.app/",
    githubUrl: "https://github.com/ABH1DAS/Nexora-ZIVAN-patient"
  },
  {
    id: "sakhi",
    number: "04",
    name: "SAKHI",
    category: "WOMEN'S SAFETY & TRANSIT",
    year: "2026",
    status: "REALTIME SAFETY COMPANION",
    description: "Privacy-focused women's safety and transit companion providing real-time GPS tracking, SOS alerts, emergency contact management, safe-route navigation via Google Maps, and safety analytics with journey-risk monitoring.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase Realtime", "WebSockets", "Google Maps API", "Framer Motion"],
    liveUrl: "https://sakhi-five-smoky.vercel.app/",
    githubUrl: "https://github.com/prachisaud04-cyber/sakhi"
  }
];

// Extra Hobbies items for interactive draggable filmstrip
export const galleryItems = [
  {
    id: "hobby-1",
    index: "01",
    title: "Singing & Vocals",
    category: "MUSIC",
    caption: "Acoustic covers, vocal harmonies, and finding rhythm and melody outside of screen code."
  },
  {
    id: "hobby-2",
    index: "02",
    title: "Acoustic Guitar",
    category: "MUSIC",
    caption: "Fingerpicking melodies, learning chord progressions, and acoustic evening jam sessions."
  },
  {
    id: "hobby-3",
    index: "03",
    title: "Badminton",
    category: "SPORTS",
    caption: "High-energy court rallies, fast footwork, and competitive weekend matches with friends."
  },
  {
    id: "hobby-4",
    index: "04",
    title: "Volleyball",
    category: "SPORTS",
    caption: "Team coordination, precision sets, defensive digs, and spikes on the sand or court."
  },
  {
    id: "hobby-5",
    index: "05",
    title: "Arts & Crafts",
    category: "CREATIVE",
    caption: "Sketching, hands-on DIY builds, papercraft, and tactile making with physical materials."
  },
  {
    id: "hobby-6",
    index: "06",
    title: "Crochet & Yarn",
    category: "CRAFT",
    caption: "Weaving intricate yarn stitches, tactile textures, and handmade crochet creations."
  },
  {
    id: "hobby-7",
    index: "07",
    title: "Exploring & Trails",
    category: "OUTDOORS",
    caption: "Wandering through unseen city corners, weekend trail walks, and discovering new places."
  }
];
