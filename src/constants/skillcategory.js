// index.js
import { Code2, Database, Wrench } from "lucide-react";

const skillCategories = [
  {
    category: "Frontend",
    icon: Code2,
    skills: [
      { name: "HTML", level: 5, expertise: "Master" },
      { name: "CSS", level: 5, expertise: "Master" },
      { name: "JavaScript", level: 5, expertise: "Expert" },
      { name: "React.js", level: 4, expertise: "Expert" },
      { name: "Bootstrap", level: 5, expertise: "Master" },
      { name: "Tailwind CSS", level: 5, expertise: "Expert" },
      {name:"GSAP",level:2,expertise:"intermediate"},
    ],
  },
  {
    category: "Backend",
    icon: Database,
    skills: [
      { name: "Python", level: 5, expertise: "Master" },
      { name: "Django", level: 5, expertise: "Expert" },
      { name: "Django REST Framework", level: 4, expertise: "Expert" },
      { name: "REST API Integration", level: 5, expertise: "Master" },
      { name: "PostgreSQL", level: 4, expertise: "Expert" },
      { name: "MySQL", level: 4, expertise: "Expert" },
    ],
  },
  {
    category: "Tools & Utilities",
    icon: Wrench,
    skills: [
      { name: "Git & GitHub", level: 5, expertise: "Master" },
      { name: "VS Code", level: 5, expertise: "Master" },
      { name: "Postman", level: 5, expertise: "Expert" },
      { name: "Vite", level: 4, expertise: "Expert" },
    ],
  },
];


export default skillCategories;
