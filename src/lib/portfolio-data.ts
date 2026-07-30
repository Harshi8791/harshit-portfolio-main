export const profile = {
  name: "Harshit Chandola",
  role: "Gen AI / Machine Learning Engineer",
  tagline:
    "I build applied GenAI systems — LLM apps, RAG pipelines and end-to-end ML workflows in Python.",
  location: "Dehradun, Uttarakhand 248001, India",
  phone: "+91 8791256848",
  email: "hofficial996@gmail.com",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
  objective:
    "Machine Learning Engineer with a strong foundation in classical ML (Scikit-learn, Pandas, NumPy) and hands-on experience building end-to-end pipelines. Actively building applied GenAI/LLM skills (LangChain, RAG) to extend into modern AI application development. Seeking an entry-level ML/AI role to solve real-world problems with data-driven solutions.",
};

export const roleRotation = [
  "GenAI / LLM Applications",
  "RAG Pipelines with LangChain",
  "Applied Machine Learning",
  "Python Data Engineering",
];

export const stats = [
  { value: "<2s", label: "LLM response latency shipped" },
  { value: "50–70", label: "users on live face-recognition system" },
  { value: "2", label: "industry internships completed" },
  { value: "1st", label: "place, college hackathon" },
];

export const skillGroups = [
  {
    title: "GenAI / LLM",
    note: "actively building",
    items: ["LangChain", "Prompt engineering", "RAG pipelines", "Groq API", "LLaMA 3.3"],
  },
  {
    title: "Machine Learning",
    note: "core strength",
    items: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Data cleaning",
      "Feature engineering",
      "Model evaluation",
    ],
  },
  {
    title: "Languages",
    note: "daily driver",
    items: ["Python", "SQL", "HTML5", "CSS3", "JavaScript"],
  },
  {
    title: "Tools & Databases",
    note: "workflow",
    items: ["Git / GitHub", "MySQL", "PyCharm", "python-dotenv", "OpenCV"],
  },
];

export const marqueeSkills = [
  "Python",
  "LangChain",
  "RAG",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "OpenCV",
  "Groq API",
  "LLaMA 3.3",
  "SQL",
  "MySQL",
  "Git",
  "Prompt Engineering",
];

export const projects = [
  {
    name: "CLI Chatbot — LLM Application",
    kind: "GenAI",
    summary:
      "Low-latency conversational AI chatbot built on LangChain with Meta's LLaMA 3.3 served through the Groq API.",
    points: [
      "Sub-2-second response time per query through a streamlined LangChain chain.",
      "Secure API key management with python-dotenv, following environment-variable best practices.",
      "Terminal-first interface designed for fast iteration on prompts and chains.",
    ],
    stack: ["LangChain", "LLaMA 3.3", "Groq API", "Python", "dotenv"],
  },
  {
    name: "Face Recognition Attendance System",
    kind: "Computer Vision",
    summary:
      "Real-time face recognition attendance system in OpenCV and Python that replaced manual logging for 50–70 users.",
    points: [
      "Face detection and recognition pipeline wired to a live camera feed.",
      "Instant identity verification with automatic log generation — no manual entry.",
      "Eliminated human error in day-to-day attendance records.",
    ],
    stack: ["Python", "OpenCV", "NumPy", "Pandas"],
  },
  {
    name: "Responsive Web Applications",
    kind: "Frontend",
    summary:
      "Responsive front-end architectures built with HTML5, CSS3 and JavaScript, accelerated with the Antigravity AI-assisted IDE.",
    points: [
      "Mobile-first layouts that hold up across breakpoints.",
      "AI-assisted boilerplate generation to shorten build cycles.",
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
  },
];

export const experience = [
  {
    role: "Technical Intern",
    org: "Uttarakhand Power Corporation Ltd. (UPCL)",
    period: "Jul 2024 – Aug 2024",
    points: [
      "Applied Python for data preprocessing and automation.",
      "Cleaned and analysed large utility datasets using Pandas and NumPy.",
      "Enhanced accuracy in data-driven insights for the energy sector.",
    ],
  },
  {
    role: "Web Developer Intern",
    org: "Oasis Infobyte",
    period: "Aug 2024 – Sep 2024",
    points: [
      "Developed responsive front-end architectures with HTML5, CSS3 and JavaScript for client-facing pages.",
      "Refactored existing code to optimize load performance and improve page speed.",
    ],
  },
];

export const education = [
  {
    degree: "Master of Computer Applications (MCA), AI & Machine Learning",
    school: "Uttaranchal University, Dehradun",
    period: "2025 – 2027",
  },
  {
    degree: "B.Sc. Information Technology",
    school: "Himalayan Institute of Technology, Dehradun",
    period: "2022 – 2025",
  },
  {
    degree: "AISSCE (Class XII)",
    school: "Kendriya Vidyalaya No. 2, SOI, Dehradun",
    period: "2022",
  },
];

export const achievements = [
  "Hackathon Winner — 1st place, college-level hackathon competition",
  "Web Technologies Certification — HTML5 & CSS3, STP Computer Education",
  "Industrial Internship Completion Certificate — UPCL",
];
