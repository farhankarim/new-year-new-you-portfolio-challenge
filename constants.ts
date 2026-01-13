
import { Project, Skill } from './types.ts';

// Icons for skills as SVG strings
const ReactIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-cyan-400"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.828-12.828a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zm5.656 0a1 1 0 0 1 1.414 1.414L14.828 12l1.414 1.414a1 1 0 0 1-1.414 1.414L12 12.828l-2.828 2.828a1 1 0 0 1-1.414-1.414L10.586 12 9.172 10.586a1 1 0 0 1 1.414-1.414L12 10.586l2.828-2.828zM12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>`;
const PHPIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-indigo-400"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1 5v10h2V7h-2zm-4 2v2h2v6H7v-2H5v2H3V9h2v2h2V9h2zm8 0v8h-2v-2h-2v2h-2V9h6zm-2 2h-2v2h2v-2z" /></svg>`;
const LaravelIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-red-500"><path d="M21.92,5.54L13,10.23V2.85L17.46,0L21.92,5.54M12.05,2.85V10.23L3.12,5.54L7.59,0L12.05,2.85M11.12,11.07L2,6.38V12.1L6.46,15L11.12,11.07M12.95,11.07L17.6,15L22.07,12.1V6.38L12.95,11.07M12.05,20.59L7.59,24L3.12,18.46L7.78,15.11L12.05,20.59M12.95,20.59L17.22,15.11L21.92,18.46L17.46,24L12.95,20.59Z" /></svg>`;
const JavaScriptIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-yellow-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2.5-5.5H7v-2h10v2z" /></svg>`;
const PythonIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-500"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-3 7v2h2v2H9v2h4v-2h-2v-2h2V9H9zm6 0v6h2V9h-2z" /></svg>`;
const TailwindIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-teal-400"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm-4.5-8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5S9.828 13 9 13s-1.5-.672-1.5-1.5zm6 0c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5S15.828 13 15 13s-1.5-.672-1.5-1.5z"/></svg>`;
const MySQLIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-600"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 7c-3.866 0-7 2.239-7 5v1c0 .552.448 1 1 1h12c.552 0 1-.448 1-1v-1c0-2.761-3.134-5-7-5z" /></svg>`;
const DockerIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-cyan-500"><path d="M21.99,9.5C21.94,9.22 21.73,9 21.46,9H17.5V5.5C17.5,5.22 17.28,5 17,5H7.5V2.5C7.5,2.22 7.28,2 7,2H2.5C2.22,2 2,2.22 2,2.5V14.5C2,14.78 2.22,15 2.5,15H7V18.5C7,18.78 7.22,19 7.5,19H21.5C21.78,19 22,18.78 22,18.5V10C22,9.82 21.99,9.65 21.99,9.5M6.5,13.5H3.5V10.5H6.5V13.5M6.5,9.5H3.5V6.5H6.5V9.5M6.5,5.5H3.5V3H6.5V5.5M10.5,17.5H8V14.5H10.5V17.5M10.5,13.5H8V10.5H10.5V13.5M10.5,9.5H8V6.5H10.5V9.5M14.5,17.5H11.5V14.5H14.5V17.5M14.5,13.5H11.5V10.5H14.5V13.5M14.5,9.5H11.5V6.5H14.5V9.5M16.5,8.5V6H15.5V8.5H16.5M20.5,17.5H15.5V14.5H20.5V17.5M20.5,13.5H15.5V10.5H20.5V13.5Z" /></svg>`;


export const SKILLS: Skill[] = [
  { name: 'PHP', icon: PHPIcon },
  { name: 'Laravel', icon: LaravelIcon },
  { name: 'React.js', icon: ReactIcon },
  { name: 'JavaScript', icon: JavaScriptIcon },
  { name: 'Python', icon: PythonIcon },
  { name: 'Tailwind CSS', icon: TailwindIcon },
  { name: 'MySQL', icon: MySQLIcon },
  { name: 'Docker', icon: DockerIcon },
];

export const PROJECTS: Project[] = [
  {
    title: 'CRM/CMS for Premier Banks',
    description: 'Engineered and customized complex CRM and CMS modules serving premier banks in Pakistan. Collaborated with cross-functional teams to gather requirements and ensure smooth system integration.',
    tags: ['PHP', 'Laravel', 'JavaScript', 'CRM', 'CMS'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    liveUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    sourceUrl: 'https://github.com/your-username/crm-project',
  },
  {
    title: 'In-House ERP System',
    description: 'Developed and maintained a large-scale ERP system supporting over 200+ users across 6 different companies. Implemented 50+ new modules and reports to improve user experience and productivity.',
    tags: ['PHP', 'Laravel', 'ERP', 'MySQL', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    liveUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    sourceUrl: 'https://github.com/your-username/erp-project',
  },
  {
    title: 'E-Health Application',
    description: 'Developed an e-health application for a controlled trial, serving over 300 participants. Designed REST APIs for a hybrid mobile application and implemented logic for analyzing user data.',
    tags: ['Laravel', 'PHP', 'REST API', 'MySQL', 'Solo Developer'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    liveUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    sourceUrl: 'https://github.com/your-username/ehealth-project',
  },
];
