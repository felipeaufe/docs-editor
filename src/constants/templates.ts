export const templates = [
  { 
    id: "blank", 
    label: "Blank Document", 
    imageUrl: "/blank-document.svg",
    initialContent: ``
  },
  { 
    id: "software-proposal", 
    label: "Software dovelopment proposal", 
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software dovelopment proposal</h1>
    `
  },
  { 
    id: "project-proposal", 
    label: "Project proposal", 
    imageUrl: "/project-proposal.svg",
    initialComponent: `
      <h1>Software development proposal</h1>
      <h2>Project Overview</h2>
      <p>Brief description of the proposed software development project.</p>

      <h2>Scope of Work</h2>
      <p>Detailed breakdown of project deliverables and requirements.</p>

      <h2>Timeline</h2>
      <p>Project milestones and delivery schedule</p>

      <h2>Budget</h2>
      <p>Cost breakdown and payment terms.</p>
    `
  },
  { 
    id: "business-letter", 
    label: "Business letter", 
    imageUrl: "/business-letter.svg",
    initialContent: `
      <h1>Business letter</h1>
    `
  },
  { 
    id: "resume", 
    label: "Resume", 
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>Resume</h1>
    `
  },
  { 
    id: "cover-letter", 
    label: "Cover letter", 
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <h1>Cover letter</h1>
    `
  },
  { 
    id: "letter", 
    label: "Letter", 
    imageUrl: "/letter.svg",
    initialContent: `
      <h1>Letter</h1>
    `
  },
]
