// ===== EDIT THIS SECTION TO UPDATE PORTFOLIO =====
// This is your single source of truth for all portfolio content

const portfolioConfig = {
  
  personal: {
    name: "Sanket Shrikant Kurve",
    title: "Full-Stack Developer",
    tagline: "From back-end logic to front-end magic. The full-stack advantage.",
    bio: "Passionate full-stack developer who thrives on learning new technologies. I build scalable web applications and AI-powered solutions that solve real-world problems.",
    superpower: "Lightning-fast technology adoption & AI integration",
    location: "India",
    availability: "Open to opportunities",
    resumeUrl: "/resume.pdf"
  },
  
  contact: {
    email: "sanketkurve.2005@gmail.com",
    github: {
      username: "SanketKurve",
      url: "https://github.com/SanketKurve"
    },
    linkedin: {
      url: "https://www.linkedin.com/in/sanket-kurve-03a8b3196",
      handle: "sanket-kurve"
    },
    twitter: null,
    portfolio: null,
  },
  
  // ===== ADD NEW SKILLS HERE =====
  // Copy this structure: { name: "Skill Name", category: "Category", level: 85 }
  skills: [
    { name: "C", category: "Programming", level: 80 },
    { name: "Java", category: "Programming", level: 85 },
    { name: "Python", category: "Programming", level: 90 },
    { name: "React", category: "Frontend", level: 85 },
    { name: "Node.js", category: "Backend", level: 80 },
    { name: "Express.js", category: "Backend", level: 80 },
    { name: "MongoDB", category: "Database", level: 75 },
    { name: "Django", category: "Backend", level: 75 },
    // ADD MORE SKILLS BELOW THIS LINE
  ],
  
  // ===== ADD NEW PROJECTS HERE =====
  projects: [
    {
      id: 1,
      title: "Hajeeri",
      tagline: "AI-powered attendance system",
      description: "Revolutionary attendance tracking system using AI face recognition to automate attendance marking and generate insights.",
      longDescription: "Hajeeri transforms traditional attendance systems with cutting-edge AI technology. Using advanced face recognition algorithms, it automatically marks attendance, eliminating manual errors and saving valuable time. The system provides real-time analytics and comprehensive reporting features.",
      tech: ["Python", "AI/ML", "Django", "React", "MongoDB"],
      features: [
        "Real-time face recognition",
        "Automated attendance marking",
        "Analytics dashboard",
        "Report generation"
      ],
      demoUrl: null,
      githubUrl: null,
      imageUrl: null,
      videoUrl: null,
      year: 2024,
      category: "AI",
      status: "completed"
    },
    {
      id: 2,
      title: "Gradient",
      tagline: "AI-powered student expense tracker",
      description: "Smart expense tracking app for students with AI-powered insights and budget recommendations.",
      longDescription: "Gradient helps students take control of their finances with intelligent expense tracking and AI-powered budget suggestions. The app categorizes expenses automatically, provides spending insights, and sends timely reminders for bills and payments.",
      tech: ["React", "Node.js", "AI/ML", "MongoDB"],
      features: [
        "Expense categorization",
        "AI budget suggestions",
        "Spending analytics",
        "Bill reminders"
      ],
      demoUrl: null,
      githubUrl: null,
      imageUrl: null,
      videoUrl: null,
      year: 2024,
      category: "Web App",
      status: "completed"
    }
  ],
  
  // ===== ADD CERTIFICATES HERE =====
  certificates: [
    // ADD CERTIFICATES LIKE THIS:
    // {
    //   id: 1,
    //   name: "AWS Certified Developer",
    //   issuer: "Amazon Web Services",
    //   date: "2024",
    //   description: "Cloud development expertise",
    //   credentialId: "ABC123",
    //   verifyUrl: "https://...",
    //   status: "active"
    // }
  ],
  
  // ===== ACHIEVEMENTS (GAMIFICATION) =====
  achievements: [
    {
      id: 1,
      title: "Quick Learner",
      description: "Mastered 8+ technologies",
      icon: "Zap",
      unlocked: true
    },
    {
      id: 2,
      title: "AI Pioneer",
      description: "Built 2 AI-powered apps",
      icon: "Brain",
      unlocked: true
    },
    {
      id: 3,
      title: "Full-Stack Master",
      description: "Frontend + Backend + AI",
      icon: "Code2",
      unlocked: true
    }
  ],
  
  experience: [
    {
      id: 1,
      title: "Project Experience",
      company: "Personal Projects",
      period: "2023 - Present",
      description: "Building innovative AI-powered applications",
      achievements: [
        "Developed 2+ full-stack AI applications",
        "Learned 8+ technologies in record time",
        "Solved real-world problems with code"
      ]
    }
  ],
  
  metadata: {
    siteTitle: "Sanket Kurve | Full-Stack Developer",
    siteDescription: "Portfolio of Sanket Kurve - Full-Stack Developer specializing in AI-powered web applications",
    siteUrl: "https://sanketkurve.com",
    keywords: ["Full-Stack Developer", "React", "Node.js", "AI", "Python", "Web Development"]
  }
}

// ===== DON'T EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING =====
export default portfolioConfig;
