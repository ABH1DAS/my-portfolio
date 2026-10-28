/**
 * Site Metadata, Author Profile, Framework & Section Copy
 * All editable text lives here. Components only render this data.
 */

export const siteConfig = {
  name: "Abhijeet Das",
  role: "Software Development Student & Creative Technologist",
  status: "AVAILABLE FOR WORK",
  location: "New Delhi, India",
  timezone: "Asia/Kolkata",
  email: "abhijeetdas1423@gmail.com",
  socials: [
    { label: "GITHUB", url: "https://github.com/ABH1DAS", external: true },
    { label: "LINKEDIN", url: "https://www.linkedin.com/in/abhijeet-das-2a6131303", external: true },
    { label: "TWITTER / X", url: "https://x.com", external: true }
  ],
  navLinks: [
    { label: "CAPABILITIES", href: "#capabilities" },
    { label: "PROJECTS", href: "#projects" },
    { label: "ABOUT", href: "#about" },
    { label: "HOBBIES", href: "#gallery" },
    { label: "CONTACT", href: "#contact" }
  ]
};

export const heroData = {
  tag: "// SOFTWARE DEVELOPER & AI STUDENT",
  headline: ["I BUILD", "THINGS THAT", "COME ALIVE."],
  subtext: "Software development student working across web, IoT and AI — shaping ideas into things people can use.",
  hintText: "SCROLL TO FOLLOW THE THREAD",
  marqueeSkills: [
    "WEB DEVELOPMENT", "IOT TELEMETRY", "APPLIED AI", "FASTAPI",
    "ESP32 & C++", "GSAP & LENIS", "TYPESCRIPT", "MQTT", "NODE.JS",
    "CREATIVE CODING", "RESPONSIVE UI", "WEBSOCKETS", "UI/UX PROTOTYPING"
  ]
};

export const frameworkSteps = [
  {
    step: "01", title: "IDEA", subtitle: "Discovery & Architecture",
    description: "Framing human needs, selecting right-sized hardware, and modeling clean system architecture."
  },
  {
    step: "02", title: "BUILD", subtitle: "Hardware & Software Craft",
    description: "Iterative programming across microcontrollers and modern web frameworks with tactile feedback."
  },
  {
    step: "03", title: "SHIP", subtitle: "Deployment & Telemetry",
    description: "Deploying production builds, establishing real-time monitoring, and iterating in the wild."
  }
];

export const capabilitiesData = {
  tag: "01 // CAPABILITIES",
  headline: ["From an idea", "to a working", "thing."],
  columns: [
    {
      index: "01", title: "WEB DEVELOPMENT",
      items: [
        { heading: "Frontend Architecture", detail: "Fluid, accessible interfaces crafted with tactile micro-interactions." },
        { heading: "Backend Systems", detail: "Resilient APIs, relational/document datastores, and scalable server logic." }
      ]
    },
    {
      index: "02", title: "INTERNET OF THINGS",
      items: [
        { heading: "Sensors & Microcontrollers", detail: "Interfacing physical sensors (ESP32, Arduino) with low-latency communication." },
        { heading: "Real-time Telemetry", detail: "Streaming live time-series data over MQTT and WebSockets to custom dashboards." }
      ]
    },
    {
      index: "03", title: "AI & CREATIVE TECH",
      items: [
        { heading: "Applied Agentic AI", detail: "Harnessing LLM endpoints (Gemini API) and task pipelines for practical utility." },
        { heading: "Interactive Experiments", detail: "Prototyping playful proof-of-concepts, canvas animations, and creative code." }
      ]
    }
  ]
};

export const aboutData = {
  tag: "03 // PHILOSOPHY & CRAFT",
  headline: ["Every project", "carries a", "curious mind."],
  statement: "Mine comes from learning in public, building small things often, and following ideas wherever they lead — whether into microcontrollers, web frameworks, or machine intelligence.",
  skillsMatrix: [
    { name: "TypeScript", type: "LANG", z: 20, rz: -3.5, rx: 2, ry: -2, layer: 2, delay: 0 },
    { name: "Python", type: "AI & BACKEND", z: 28, rz: 3.2, rx: -2, ry: 2, layer: 4, delay: 0.6 },
    { name: "C / C++", type: "SYSTEMS", z: 14, rz: -2.0, rx: 3, ry: -1, layer: 1, delay: 1.2 },
    { name: "Rust", type: "SYSTEMS", z: 26, rz: 4.0, rx: -1, ry: 3, layer: 5, delay: 1.8 },
    { name: "ESP32", type: "IOT & EMBEDDED", z: 34, rz: -4.5, rx: 2, ry: -3, layer: 8, delay: 0.3 },
    { name: "Node.js", type: "RUNTIME", z: 18, rz: 2.5, rx: -2, ry: 1, layer: 3, delay: 0.9 },
    { name: "GSAP & Lenis", type: "KINETIC UI", z: 30, rz: -3.0, rx: 3, ry: -2, layer: 7, delay: 1.5 },
    { name: "Tailwind CSS", type: "STYLING", z: 38, rz: 4.2, rx: -3, ry: 2, layer: 9, delay: 2.1 },
    { name: "Git & GitHub", type: "DEV TOOLS", z: 22, rz: -1.5, rx: 2, ry: -2, layer: 6, delay: 0.7 }
  ],
  signoff: "ABHIJEET DAS."
};

export const profile = {
  tag: "// PORTFOLIO / ©2026",
  firstName: "ABHIJEET",
  lastName: "DAS.",
  role: "Software Development student",
  field: "SOFTWARE DEVELOPMENT",
  university: "GAUHATI UNIVERSITY",
  state: "ASSAM"
};

export const contactData = {
  tag: "04 // INITIATE DIALOGUE",
  headline: ["Have an", "idea worth", "building?"],
  subtext: "Let's untangle the challenge together and shape it into something tangible.",
  submitLabel: "SEND MESSAGE →",
  successMessage: "THANKS — MESSAGE SENT ✓",
  endpoint: "" // Optional Formspree / Web3Forms / custom webhook
};
