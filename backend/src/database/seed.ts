import { connectDatabase, getSession, closeDatabase } from './connection';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate IDs
const generateId = (): string => uuidv4();

// Seed data
const developers = [
  { id: generateId(), name: 'Sarah Chen', email: 'sarah.chen@example.com', bio: 'Full-stack developer passionate about React and Node.js', yearsExperience: 5, location: 'San Francisco' },
  { id: generateId(), name: 'Marcus Johnson', email: 'marcus.j@example.com', bio: 'Backend engineer specializing in distributed systems', yearsExperience: 8, location: 'New York' },
  { id: generateId(), name: 'Elena Rodriguez', email: 'elena.r@example.com', bio: 'DevOps engineer with cloud infrastructure expertise', yearsExperience: 6, location: 'Austin' },
  { id: generateId(), name: 'James Wilson', email: 'james.w@example.com', bio: 'Frontend specialist focused on user experience', yearsExperience: 4, location: 'Seattle' },
  { id: generateId(), name: 'Priya Patel', email: 'priya.p@example.com', bio: 'Data engineer working with big data pipelines', yearsExperience: 7, location: 'Chicago' },
  { id: generateId(), name: 'David Kim', email: 'david.k@example.com', bio: 'Mobile developer for iOS and Android', yearsExperience: 5, location: 'Los Angeles' },
  { id: generateId(), name: 'Lisa Thompson', email: 'lisa.t@example.com', bio: 'Security engineer focused on application security', yearsExperience: 9, location: 'Boston' },
  { id: generateId(), name: 'Ahmed Hassan', email: 'ahmed.h@example.com', bio: 'Cloud architect with AWS and Azure experience', yearsExperience: 10, location: 'Denver' },
  { id: generateId(), name: 'Maria Garcia', email: 'maria.g@example.com', bio: 'Machine learning engineer building AI solutions', yearsExperience: 6, location: 'San Jose' },
  { id: generateId(), name: 'Robert Brown', email: 'robert.b@example.com', bio: 'Technical lead with system design expertise', yearsExperience: 12, location: 'Portland' },
  { id: generateId(), name: 'Jennifer Lee', email: 'jen.lee@example.com', bio: 'QA engineer automating test pipelines', yearsExperience: 4, location: 'Miami' },
  { id: generateId(), name: 'Michael Davis', email: 'michael.d@example.com', bio: 'Backend developer working with microservices', yearsExperience: 6, location: 'Dallas' },
  { id: generateId(), name: 'Emma White', email: 'emma.w@example.com', bio: 'UI/UX developer bridging design and code', yearsExperience: 3, location: 'Atlanta' },
  { id: generateId(), name: 'Chris Anderson', email: 'chris.a@example.com', bio: 'Site reliability engineer ensuring uptime', yearsExperience: 7, location: 'Phoenix' },
  { id: generateId(), name: 'Sophia Martinez', email: 'sophia.m@example.com', bio: 'Full-stack developer with startup experience', yearsExperience: 5, location: 'San Diego' },
  { id: generateId(), name: 'Daniel Taylor', email: 'daniel.t@example.com', bio: 'Blockchain developer exploring Web3', yearsExperience: 3, location: 'Miami' },
  { id: generateId(), name: 'Rachel Kim', email: 'rachel.k@example.com', bio: 'Product engineer with business acumen', yearsExperience: 8, location: 'Seattle' },
  { id: generateId(), name: 'Kevin Nguyen', email: 'kevin.n@example.com', bio: 'Infrastructure engineer automating deployments', yearsExperience: 5, location: 'Austin' },
];

const skills = [
  { id: generateId(), name: 'JavaScript', category: 'Programming Language', description: 'Dynamic scripting language for web development', difficulty: 'intermediate' },
  { id: generateId(), name: 'TypeScript', category: 'Programming Language', description: 'Typed superset of JavaScript', difficulty: 'intermediate' },
  { id: generateId(), name: 'Python', category: 'Programming Language', description: 'Versatile language for data science and backend', difficulty: 'intermediate' },
  { id: generateId(), name: 'React', category: 'Frontend Framework', description: 'Component-based UI library', difficulty: 'intermediate' },
  { id: generateId(), name: 'Node.js', category: 'Backend Runtime', description: 'JavaScript runtime for server-side code', difficulty: 'intermediate' },
  { id: generateId(), name: 'Express.js', category: 'Backend Framework', description: 'Minimal Node.js web framework', difficulty: 'beginner' },
  { id: generateId(), name: 'PostgreSQL', category: 'Database', description: 'Advanced relational database', difficulty: 'intermediate' },
  { id: generateId(), name: 'MongoDB', category: 'Database', description: 'NoSQL document database', difficulty: 'beginner' },
  { id: generateId(), name: 'AWS', category: 'Cloud Platform', description: 'Amazon Web Services cloud platform', difficulty: 'advanced' },
  { id: generateId(), name: 'Docker', category: 'DevOps Tool', description: 'Containerization platform', difficulty: 'intermediate' },
  { id: generateId(), name: 'Kubernetes', category: 'DevOps Tool', description: 'Container orchestration system', difficulty: 'advanced' },
  { id: generateId(), name: 'Git', category: 'Version Control', description: 'Distributed version control system', difficulty: 'beginner' },
  { id: generateId(), name: 'GraphQL', category: 'API Technology', description: 'Query language for APIs', difficulty: 'intermediate' },
  { id: generateId(), name: 'REST APIs', category: 'API Technology', description: 'Architectural style for web services', difficulty: 'beginner' },
  { id: generateId(), name: 'Machine Learning', category: 'AI/ML', description: 'Algorithms that learn from data', difficulty: 'advanced' },
  { id: generateId(), name: 'CI/CD', category: 'DevOps Practice', description: 'Continuous integration and deployment', difficulty: 'intermediate' },
  { id: generateId(), name: 'Agile', category: 'Methodology', description: 'Iterative project management approach', difficulty: 'beginner' },
  { id: generateId(), name: 'System Design', category: 'Architecture', description: 'Designing scalable systems', difficulty: 'advanced' },
];

const technologies = [
  { id: generateId(), name: 'React', category: 'Frontend', description: 'A JavaScript library for building user interfaces', website: 'https://reactjs.org' },
  { id: generateId(), name: 'Next.js', category: 'Frontend', description: 'React framework for production', website: 'https://nextjs.org' },
  { id: generateId(), name: 'Node.js', category: 'Backend', description: 'JavaScript runtime built on Chrome V8', website: 'https://nodejs.org' },
  { id: generateId(), name: 'Express', category: 'Backend', description: 'Fast, unopinionated web framework for Node.js', website: 'https://expressjs.com' },
  { id: generateId(), name: 'PostgreSQL', category: 'Database', description: 'The world\'s most advanced open source database', website: 'https://postgresql.org' },
  { id: generateId(), name: 'Redis', category: 'Database', description: 'In-memory data structure store', website: 'https://redis.io' },
  { id: generateId(), name: 'AWS Lambda', category: 'Cloud', description: 'Serverless compute service', website: 'https://aws.amazon.com/lambda' },
  { id: generateId(), name: 'Docker', category: 'DevOps', description: 'Platform for developing, shipping, and running applications', website: 'https://docker.com' },
  { id: generateId(), name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration platform', website: 'https://kubernetes.io' },
  { id: generateId(), name: 'Terraform', category: 'DevOps', description: 'Infrastructure as Code tool', website: 'https://terraform.io' },
  { id: generateId(), name: 'GraphQL', category: 'API', description: 'A query language for your API', website: 'https://graphql.org' },
  { id: generateId(), name: 'TensorFlow', category: 'AI/ML', description: 'End-to-end open source machine learning platform', website: 'https://tensorflow.org' },
  { id: generateId(), name: 'Neo4j', category: 'Database', description: 'Graph database platform', website: 'https://neo4j.com' },
];

const projects = [
  { id: generateId(), name: 'E-commerce Platform', description: 'Full-stack e-commerce solution with payment integration', startDate: '2024-01-15', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/ecommerce' },
  { id: generateId(), name: 'Real-time Chat Application', description: 'WebSocket-based chat with rooms and direct messages', startDate: '2024-03-01', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/chat-app' },
  { id: generateId(), name: 'Analytics Dashboard', description: 'Data visualization dashboard with real-time updates', startDate: '2023-11-10', endDate: '2024-02-28', status: 'completed', repositoryUrl: 'https://github.com/example/analytics' },
  { id: generateId(), name: 'Mobile Banking App', description: 'Secure mobile banking application with biometric auth', startDate: '2024-02-20', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/banking' },
  { id: generateId(), name: 'Content Management System', description: 'Headless CMS with GraphQL API', startDate: '2023-09-05', endDate: '2024-01-15', status: 'completed', repositoryUrl: 'https://github.com/example/cms' },
  { id: generateId(), name: 'DevOps Pipeline Tool', description: 'CI/CD pipeline management platform', startDate: '2024-01-30', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/devops-tool' },
  { id: generateId(), name: 'AI Recommendation Engine', description: 'Machine learning-based product recommendation system', startDate: '2023-12-01', endDate: '2024-03-15', status: 'completed', repositoryUrl: 'https://github.com/example/ai-recommender' },
  { id: generateId(), name: 'Social Media Analytics', description: 'Social media sentiment analysis and reporting', startDate: '2024-02-10', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/social-analytics' },
  { id: generateId(), name: 'Healthcare Portal', description: 'Patient management system with telehealth features', startDate: '2023-10-15', endDate: '2024-02-01', status: 'completed', repositoryUrl: 'https://github.com/example/healthcare' },
  { id: generateId(), name: 'Supply Chain Tracker', description: 'Real-time supply chain visibility platform', startDate: '2024-03-05', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/supply-chain' },
  { id: generateId(), name: 'Education Platform', description: 'Online learning management system', startDate: '2023-08-20', endDate: '2023-12-15', status: 'completed', repositoryUrl: 'https://github.com/example/education' },
  { id: generateId(), name: 'IoT Dashboard', description: 'Internet of Things device monitoring dashboard', startDate: '2024-01-10', endDate: null, status: 'active', repositoryUrl: 'https://github.com/example/iot-dashboard' },
];

const jobRoles = [
  { id: generateId(), title: 'Senior Frontend Developer', description: 'Lead frontend development with React and modern web technologies', level: 'senior', averageSalary: 140000 },
  { id: generateId(), title: 'Backend Engineer', description: 'Build and maintain server-side applications and APIs', level: 'mid', averageSalary: 120000 },
  { id: generateId(), title: 'DevOps Engineer', description: 'Manage CI/CD pipelines and cloud infrastructure', level: 'senior', averageSalary: 145000 },
  { id: generateId(), title: 'Full Stack Developer', description: 'Work across the entire technology stack', level: 'mid', averageSalary: 125000 },
  { id: generateId(), title: 'Tech Lead', description: 'Technical leadership and system architecture', level: 'lead', averageSalary: 160000 },
  { id: generateId(), title: 'Junior Developer', description: 'Entry-level software development position', level: 'junior', averageSalary: 80000 },
];

const companies = [
  { id: generateId(), name: 'TechCorp', industry: 'Technology', size: 'large', location: 'San Francisco', website: 'https://techcorp.com' },
  { id: generateId(), name: 'InnovateLab', industry: 'Software', size: 'medium', location: 'New York', website: 'https://innovatelab.com' },
  { id: generateId(), name: 'CloudBase', industry: 'Cloud Services', size: 'enterprise', location: 'Seattle', website: 'https://cloudbase.com' },
  { id: generateId(), name: 'StartupXYZ', industry: 'Fintech', size: 'startup', location: 'Austin', website: 'https://startupxyz.com' },
  { id: generateId(), name: 'DataFlow Inc', industry: 'Data Analytics', size: 'small', location: 'Chicago', website: 'https://dataflow.com' },
];

// Relationship mappings
const developerSkills = [
  // Sarah Chen
  { developerId: developers[0].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[0].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[0].id, skillId: skills[3].id }, // React
  { developerId: developers[0].id, skillId: skills[4].id }, // Node.js
  { developerId: developers[0].id, skillId: skills[5].id }, // Express.js
  // Marcus Johnson
  { developerId: developers[1].id, skillId: skills[2].id }, // Python
  { developerId: developers[1].id, skillId: skills[4].id }, // Node.js
  { developerId: developers[1].id, skillId: skills[6].id }, // PostgreSQL
  { developerId: developers[1].id, skillId: skills[13].id }, // REST APIs
  { developerId: developers[1].id, skillId: skills[17].id }, // System Design
  // Elena Rodriguez
  { developerId: developers[2].id, skillId: skills[8].id }, // AWS
  { developerId: developers[2].id, skillId: skills[9].id }, // Docker
  { developerId: developers[2].id, skillId: skills[10].id }, // Kubernetes
  { developerId: developers[2].id, skillId: skills[15].id }, // CI/CD
  // James Wilson
  { developerId: developers[3].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[3].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[3].id, skillId: skills[3].id }, // React
  // Priya Patel
  { developerId: developers[4].id, skillId: skills[2].id }, // Python
  { developerId: developers[4].id, skillId: skills[6].id }, // PostgreSQL
  { developerId: developers[4].id, skillId: skills[14].id }, // Machine Learning
  // David Kim
  { developerId: developers[5].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[5].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[5].id, skillId: skills[3].id }, // React
  // Lisa Thompson
  { developerId: developers[6].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[6].id, skillId: skills[8].id }, // AWS
  { developerId: developers[6].id, skillId: skills[10].id }, // Kubernetes
  // Ahmed Hassan
  { developerId: developers[7].id, skillId: skills[8].id }, // AWS
  { developerId: developers[7].id, skillId: skills[9].id }, // Docker
  { developerId: developers[7].id, skillId: skills[10].id }, // Kubernetes
  { developerId: developers[7].id, skillId: skills[17].id }, // System Design
  // Maria Garcia
  { developerId: developers[8].id, skillId: skills[2].id }, // Python
  { developerId: developers[8].id, skillId: skills[14].id }, // Machine Learning
  // Robert Brown
  { developerId: developers[9].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[9].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[9].id, skillId: skills[17].id }, // System Design
  { developerId: developers[9].id, skillId: skills[16].id }, // Agile
  // Jennifer Lee
  { developerId: developers[10].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[10].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[10].id, skillId: skills[15].id }, // CI/CD
  // Michael Davis
  { developerId: developers[11].id, skillId: skills[4].id }, // Node.js
  { developerId: developers[11].id, skillId: skills[5].id }, // Express.js
  { developerId: developers[11].id, skillId: skills[13].id }, // REST APIs
  // Emma White
  { developerId: developers[12].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[12].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[12].id, skillId: skills[3].id }, // React
  // Chris Anderson
  { developerId: developers[13].id, skillId: skills[8].id }, // AWS
  { developerId: developers[13].id, skillId: skills[9].id }, // Docker
  { developerId: developers[13].id, skillId: skills[10].id }, // Kubernetes
  { developerId: developers[13].id, skillId: skills[15].id }, // CI/CD
  // Sophia Martinez
  { developerId: developers[14].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[14].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[14].id, skillId: skills[4].id }, // Node.js
  { developerId: developers[14].id, skillId: skills[5].id }, // Express.js
  // Daniel Taylor
  { developerId: developers[15].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[15].id, skillId: skills[1].id }, // TypeScript
  // Rachel Kim
  { developerId: developers[16].id, skillId: skills[0].id }, // JavaScript
  { developerId: developers[16].id, skillId: skills[1].id }, // TypeScript
  { developerId: developers[16].id, skillId: skills[3].id }, // React
  { developerId: developers[16].id, skillId: skills[16].id }, // Agile
  // Kevin Nguyen
  { developerId: developers[17].id, skillId: skills[8].id }, // AWS
  { developerId: developers[17].id, skillId: skills[9].id }, // Docker
  { developerId: developers[17].id, skillId: skills[10].id }, // Kubernetes
];

const developerProjects = [
  // Sarah Chen
  { developerId: developers[0].id, projectId: projects[0].id }, // E-commerce Platform
  { developerId: developers[0].id, projectId: projects[1].id }, // Real-time Chat
  // Marcus Johnson
  { developerId: developers[1].id, projectId: projects[2].id }, // Analytics Dashboard
  { developerId: developers[1].id, projectId: projects[6].id }, // AI Recommendation Engine
  // Elena Rodriguez
  { developerId: developers[2].id, projectId: projects[5].id }, // DevOps Pipeline Tool
  { developerId: developers[2].id, projectId: projects[11].id }, // IoT Dashboard
  // James Wilson
  { developerId: developers[3].id, projectId: projects[0].id }, // E-commerce Platform
  { developerId: developers[3].id, projectId: projects[4].id }, // CMS
  // Priya Patel
  { developerId: developers[4].id, projectId: projects[2].id }, // Analytics Dashboard
  { developerId: developers[4].id, projectId: projects[7].id }, // Social Media Analytics
  // David Kim
  { developerId: developers[5].id, projectId: projects[3].id }, // Mobile Banking
  // Lisa Thompson
  { developerId: developers[6].id, projectId: projects[3].id }, // Mobile Banking
  { developerId: developers[6].id, projectId: projects[8].id }, // Healthcare Portal
  // Ahmed Hassan
  { developerId: developers[7].id, projectId: projects[5].id }, // DevOps Pipeline
  { developerId: developers[7].id, projectId: projects[11].id }, // IoT Dashboard
  // Maria Garcia
  { developerId: developers[8].id, projectId: projects[6].id }, // AI Recommendation Engine
  // Robert Brown
  { developerId: developers[9].id, projectId: projects[0].id }, // E-commerce Platform
  { developerId: developers[9].id, projectId: projects[5].id }, // DevOps Pipeline
  // Jennifer Lee
  { developerId: developers[10].id, projectId: projects[1].id }, // Real-time Chat
  // Michael Davis
  { developerId: developers[11].id, projectId: projects[1].id }, // Real-time Chat
  { developerId: developers[11].id, projectId: projects[4].id }, // CMS
  // Emma White
  { developerId: developers[12].id, projectId: projects[0].id }, // E-commerce Platform
  // Chris Anderson
  { developerId: developers[13].id, projectId: projects[5].id }, // DevOps Pipeline
  // Sophia Martinez
  { developerId: developers[14].id, projectId: projects[1].id }, // Real-time Chat
  { developerId: developers[14].id, projectId: projects[10].id }, // Education Platform
  // Daniel Taylor
  { developerId: developers[15].id, projectId: projects[9].id }, // Supply Chain Tracker
  // Rachel Kim
  { developerId: developers[16].id, projectId: projects[0].id }, // E-commerce Platform
  // Kevin Nguyen
  { developerId: developers[17].id, projectId: projects[5].id }, // DevOps Pipeline
];

const projectTechnologies = [
  // E-commerce Platform
  { projectId: projects[0].id, technologyId: technologies[0].id }, // React
  { projectId: projects[0].id, technologyId: technologies[1].id }, // Next.js
  { projectId: projects[0].id, technologyId: technologies[2].id }, // Node.js
  { projectId: projects[0].id, technologyId: technologies[4].id }, // PostgreSQL
  // Real-time Chat
  { projectId: projects[1].id, technologyId: technologies[0].id }, // React
  { projectId: projects[1].id, technologyId: technologies[2].id }, // Node.js
  { projectId: projects[1].id, technologyId: technologies[5].id }, // Redis
  // Analytics Dashboard
  { projectId: projects[2].id, technologyId: technologies[0].id }, // React
  { projectId: projects[2].id, technologyId: technologies[4].id }, // PostgreSQL
  { projectId: projects[2].id, technologyId: technologies[6].id }, // AWS Lambda
  // Mobile Banking
  { projectId: projects[3].id, technologyId: technologies[0].id }, // React
  { projectId: projects[3].id, technologyId: technologies[1].id }, // Next.js
  { projectId: projects[3].id, technologyId: technologies[4].id }, // PostgreSQL
  // CMS
  { projectId: projects[4].id, technologyId: technologies[2].id }, // Node.js
  { projectId: projects[4].id, technologyId: technologies[10].id }, // GraphQL
  // DevOps Pipeline Tool
  { projectId: projects[5].id, technologyId: technologies[7].id }, // Docker
  { projectId: projects[5].id, technologyId: technologies[8].id }, // Kubernetes
  { projectId: projects[5].id, technologyId: technologies[9].id }, // Terraform
  // AI Recommendation Engine
  { projectId: projects[6].id, technologyId: technologies[11].id }, // TensorFlow
  { projectId: projects[6].id, technologyId: technologies[4].id }, // PostgreSQL
  // Social Media Analytics
  { projectId: projects[7].id, technologyId: technologies[0].id }, // React
  { projectId: projects[7].id, technologyId: technologies[2].id }, // Node.js
  // Healthcare Portal
  { projectId: projects[8].id, technologyId: technologies[0].id }, // React
  { projectId: projects[8].id, technologyId: technologies[2].id }, // Node.js
  // Supply Chain Tracker
  { projectId: projects[9].id, technologyId: technologies[0].id }, // React
  { projectId: projects[9].id, technologyId: technologies[12].id }, // Neo4j
  // Education Platform
  { projectId: projects[10].id, technologyId: technologies[1].id }, // Next.js
  { projectId: projects[10].id, technologyId: technologies[4].id }, // PostgreSQL
  // IoT Dashboard
  { projectId: projects[11].id, technologyId: technologies[0].id }, // React
  { projectId: projects[11].id, technologyId: technologies[5].id }, // Redis
];

const projectSkills = [
  // E-commerce Platform
  { projectId: projects[0].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[0].id, skillId: skills[1].id }, // TypeScript
  { projectId: projects[0].id, skillId: skills[3].id }, // React
  { projectId: projects[0].id, skillId: skills[4].id }, // Node.js
  // Real-time Chat
  { projectId: projects[1].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[1].id, skillId: skills[4].id }, // Node.js
  // Analytics Dashboard
  { projectId: projects[2].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[2].id, skillId: skills[3].id }, // React
  // Mobile Banking
  { projectId: projects[3].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[3].id, skillId: skills[1].id }, // TypeScript
  // CMS
  { projectId: projects[4].id, skillId: skills[4].id }, // Node.js
  { projectId: projects[4].id, skillId: skills[12].id }, // GraphQL
  // DevOps Pipeline Tool
  { projectId: projects[5].id, skillId: skills[8].id }, // AWS
  { projectId: projects[5].id, skillId: skills[9].id }, // Docker
  { projectId: projects[5].id, skillId: skills[10].id }, // Kubernetes
  // AI Recommendation Engine
  { projectId: projects[6].id, skillId: skills[2].id }, // Python
  { projectId: projects[6].id, skillId: skills[14].id }, // Machine Learning
  // Social Media Analytics
  { projectId: projects[7].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[7].id, skillId: skills[2].id }, // Python
  // Healthcare Portal
  { projectId: projects[8].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[8].id, skillId: skills[1].id }, // TypeScript
  // Supply Chain Tracker
  { projectId: projects[9].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[9].id, skillId: skills[1].id }, // TypeScript
  // Education Platform
  { projectId: projects[10].id, skillId: skills[1].id }, // TypeScript
  { projectId: projects[10].id, skillId: skills[3].id }, // React
  // IoT Dashboard
  { projectId: projects[11].id, skillId: skills[0].id }, // JavaScript
  { projectId: projects[11].id, skillId: skills[3].id }, // React
];

const developerJobTargets = [
  { developerId: developers[0].id, jobRoleId: jobRoles[0].id }, // Senior Frontend
  { developerId: developers[1].id, jobRoleId: jobRoles[4].id }, // Tech Lead
  { developerId: developers[2].id, jobRoleId: jobRoles[2].id }, // DevOps Engineer
  { developerId: developers[3].id, jobRoleId: jobRoles[0].id }, // Senior Frontend
  { developerId: developers[4].id, jobRoleId: jobRoles[1].id }, // Backend Engineer
  { developerId: developers[5].id, jobRoleId: jobRoles[3].id }, // Full Stack
  { developerId: developers[6].id, jobRoleId: jobRoles[2].id }, // DevOps Engineer
  { developerId: developers[7].id, jobRoleId: jobRoles[4].id }, // Tech Lead
  { developerId: developers[8].id, jobRoleId: jobRoles[1].id }, // Backend Engineer
  { developerId: developers[9].id, jobRoleId: jobRoles[4].id }, // Tech Lead
  { developerId: developers[10].id, jobRoleId: jobRoles[5].id }, // Junior Developer
  { developerId: developers[11].id, jobRoleId: jobRoles[1].id }, // Backend Engineer
  { developerId: developers[12].id, jobRoleId: jobRoles[0].id }, // Senior Frontend
  { developerId: developers[13].id, jobRoleId: jobRoles[2].id }, // DevOps Engineer
  { developerId: developers[14].id, jobRoleId: jobRoles[3].id }, // Full Stack
  { developerId: developers[15].id, jobRoleId: jobRoles[3].id }, // Full Stack
  { developerId: developers[16].id, jobRoleId: jobRoles[3].id }, // Full Stack
  { developerId: developers[17].id, jobRoleId: jobRoles[2].id }, // DevOps Engineer
];

const jobRoleSkills = [
  // Senior Frontend Developer
  { jobRoleId: jobRoles[0].id, skillId: skills[0].id }, // JavaScript
  { jobRoleId: jobRoles[0].id, skillId: skills[1].id }, // TypeScript
  { jobRoleId: jobRoles[0].id, skillId: skills[3].id }, // React
  { jobRoleId: jobRoles[0].id, skillId: skills[12].id }, // GraphQL
  // Backend Engineer
  { jobRoleId: jobRoles[1].id, skillId: skills[2].id }, // Python
  { jobRoleId: jobRoles[1].id, skillId: skills[4].id }, // Node.js
  { jobRoleId: jobRoles[1].id, skillId: skills[6].id }, // PostgreSQL
  { jobRoleId: jobRoles[1].id, skillId: skills[13].id }, // REST APIs
  // DevOps Engineer
  { jobRoleId: jobRoles[2].id, skillId: skills[8].id }, // AWS
  { jobRoleId: jobRoles[2].id, skillId: skills[9].id }, // Docker
  { jobRoleId: jobRoles[2].id, skillId: skills[10].id }, // Kubernetes
  { jobRoleId: jobRoles[2].id, skillId: skills[15].id }, // CI/CD
  // Full Stack Developer
  { jobRoleId: jobRoles[3].id, skillId: skills[0].id }, // JavaScript
  { jobRoleId: jobRoles[3].id, skillId: skills[1].id }, // TypeScript
  { jobRoleId: jobRoles[3].id, skillId: skills[3].id }, // React
  { jobRoleId: jobRoles[3].id, skillId: skills[4].id }, // Node.js
  { jobRoleId: jobRoles[3].id, skillId: skills[5].id }, // Express.js
  // Tech Lead
  { jobRoleId: jobRoles[4].id, skillId: skills[0].id }, // JavaScript
  { jobRoleId: jobRoles[4].id, skillId: skills[1].id }, // TypeScript
  { jobRoleId: jobRoles[4].id, skillId: skills[17].id }, // System Design
  { jobRoleId: jobRoles[4].id, skillId: skills[16].id }, // Agile
  // Junior Developer
  { jobRoleId: jobRoles[5].id, skillId: skills[0].id }, // JavaScript
  { jobRoleId: jobRoles[5].id, skillId: skills[11].id }, // Git
  { jobRoleId: jobRoles[5].id, skillId: skills[16].id }, // Agile
];

const developerCompanies = [
  { developerId: developers[0].id, companyId: companies[0].id }, // Sarah -> TechCorp
  { developerId: developers[1].id, companyId: companies[0].id }, // Marcus -> TechCorp
  { developerId: developers[2].id, companyId: companies[2].id }, // Elena -> CloudBase
  { developerId: developers[3].id, companyId: companies[1].id }, // James -> InnovateLab
  { developerId: developers[4].id, companyId: companies[4].id }, // Priya -> DataFlow Inc
  { developerId: developers[5].id, companyId: companies[3].id }, // David -> StartupXYZ
  { developerId: developers[6].id, companyId: companies[0].id }, // Lisa -> TechCorp
  { developerId: developers[7].id, companyId: companies[2].id }, // Ahmed -> CloudBase
  { developerId: developers[8].id, companyId: companies[4].id }, // Maria -> DataFlow Inc
  { developerId: developers[9].id, companyId: companies[1].id }, // Robert -> InnovateLab
  { developerId: developers[10].id, companyId: companies[3].id }, // Jennifer -> StartupXYZ
  { developerId: developers[11].id, companyId: companies[1].id }, // Michael -> InnovateLab
  { developerId: developers[12].id, companyId: companies[0].id }, // Emma -> TechCorp
  { developerId: developers[13].id, companyId: companies[2].id }, // Chris -> CloudBase
  { developerId: developers[14].id, companyId: companies[3].id }, // Sophia -> StartupXYZ
  { developerId: developers[15].id, companyId: companies[3].id }, // Daniel -> StartupXYZ
  { developerId: developers[16].id, companyId: companies[1].id }, // Rachel -> InnovateLab
  { developerId: developers[17].id, companyId: companies[2].id }, // Kevin -> CloudBase
];

const skillRelationships = [
  // JavaScript related to TypeScript
  { skillId: skills[0].id, relatedSkillId: skills[1].id },
  // React related to JavaScript
  { skillId: skills[3].id, relatedSkillId: skills[0].id },
  // Node.js related to JavaScript
  { skillId: skills[4].id, relatedSkillId: skills[0].id },
  // Express.js related to Node.js
  { skillId: skills[5].id, relatedSkillId: skills[4].id },
  // Docker related to Kubernetes
  { skillId: skills[9].id, relatedSkillId: skills[10].id },
  // AWS related to Docker
  { skillId: skills[8].id, relatedSkillId: skills[9].id },
  // PostgreSQL related to MongoDB
  { skillId: skills[6].id, relatedSkillId: skills[7].id },
  // GraphQL related to REST APIs
  { skillId: skills[12].id, relatedSkillId: skills[13].id },
  // CI/CD related to Docker
  { skillId: skills[15].id, relatedSkillId: skills[9].id },
  // Python related to Machine Learning
  { skillId: skills[2].id, relatedSkillId: skills[14].id },
];

export const seedDatabase = async (): Promise<void> => {
  const session = getSession();

  try {
    console.log('Starting database seed...');

    // Create Developer nodes
    for (const dev of developers) {
      await session.run(
        `MERGE (d:Developer {id: $id})
         SET d.name = $name, d.email = $email, d.bio = $bio,
             d.yearsExperience = $yearsExperience, d.location = $location,
             d.createdAt = datetime(), d.updatedAt = datetime()`,
        dev
      );
    }
    console.log(`Created ${developers.length} developers`);

    // Create Skill nodes
    for (const skill of skills) {
      await session.run(
        `MERGE (s:Skill {id: $id})
         SET s.name = $name, s.category = $category, s.description = $description,
             s.difficulty = $difficulty, s.createdAt = datetime()`,
        skill
      );
    }
    console.log(`Created ${skills.length} skills`);

    // Create Technology nodes
    for (const tech of technologies) {
      await session.run(
        `MERGE (t:Technology {id: $id})
         SET t.name = $name, t.category = $category, t.description = $description,
             t.website = $website, t.createdAt = datetime()`,
        tech
      );
    }
    console.log(`Created ${technologies.length} technologies`);

    // Create Project nodes
    for (const project of projects) {
      await session.run(
        `MERGE (p:Project {id: $id})
         SET p.name = $name, p.description = $description, p.startDate = $startDate,
             p.endDate = $endDate, p.status = $status, p.repositoryUrl = $repositoryUrl,
             p.createdAt = datetime()`,
        project
      );
    }
    console.log(`Created ${projects.length} projects`);

    // Create JobRole nodes
    for (const role of jobRoles) {
      await session.run(
        `MERGE (j:JobRole {id: $id})
         SET j.title = $title, j.description = $description, j.level = $level,
             j.averageSalary = $averageSalary, j.createdAt = datetime()`,
        role
      );
    }
    console.log(`Created ${jobRoles.length} job roles`);

    // Create Company nodes
    for (const company of companies) {
      await session.run(
        `MERGE (c:Company {id: $id})
         SET c.name = $name, c.industry = $industry, c.size = $size,
             c.location = $location, c.website = $website, c.createdAt = datetime()`,
        company
      );
    }
    console.log(`Created ${companies.length} companies`);

    // Create Developer-Skill relationships
    for (const rel of developerSkills) {
      await session.run(
        `MATCH (d:Developer {id: $developerId})
         MATCH (s:Skill {id: $skillId})
         MERGE (d)-[:HAS_SKILL]->(s)`,
        rel
      );
    }
    console.log(`Created ${developerSkills.length} developer-skill relationships`);

    // Create Developer-Project relationships
    for (const rel of developerProjects) {
      await session.run(
        `MATCH (d:Developer {id: $developerId})
         MATCH (p:Project {id: $projectId})
         MERGE (d)-[:WORKED_ON]->(p)`,
        rel
      );
    }
    console.log(`Created ${developerProjects.length} developer-project relationships`);

    // Create Project-Technology relationships
    for (const rel of projectTechnologies) {
      await session.run(
        `MATCH (p:Project {id: $projectId})
         MATCH (t:Technology {id: $technologyId})
         MERGE (p)-[:USES]->(t)`,
        rel
      );
    }
    console.log(`Created ${projectTechnologies.length} project-technology relationships`);

    // Create Project-Skill relationships
    for (const rel of projectSkills) {
      await session.run(
        `MATCH (p:Project {id: $projectId})
         MATCH (s:Skill {id: $skillId})
         MERGE (p)-[:REQUIRES]->(s)`,
        rel
      );
    }
    console.log(`Created ${projectSkills.length} project-skill relationships`);

    // Create Developer-JobRole relationships
    for (const rel of developerJobTargets) {
      await session.run(
        `MATCH (d:Developer {id: $developerId})
         MATCH (j:JobRole {id: $jobRoleId})
         MERGE (d)-[:TARGETS]->(j)`,
        rel
      );
    }
    console.log(`Created ${developerJobTargets.length} developer-jobrole relationships`);

    // Create JobRole-Skill relationships
    for (const rel of jobRoleSkills) {
      await session.run(
        `MATCH (j:JobRole {id: $jobRoleId})
         MATCH (s:Skill {id: $skillId})
         MERGE (j)-[:REQUIRES]->(s)`,
        rel
      );
    }
    console.log(`Created ${jobRoleSkills.length} jobrole-skill relationships`);

    // Create Developer-Company relationships
    for (const rel of developerCompanies) {
      await session.run(
        `MATCH (d:Developer {id: $developerId})
         MATCH (c:Company {id: $companyId})
         MERGE (d)-[:WORKS_AT]->(c)`,
        rel
      );
    }
    console.log(`Created ${developerCompanies.length} developer-company relationships`);

    // Create Skill-Skill relationships
    for (const rel of skillRelationships) {
      await session.run(
        `MATCH (s1:Skill {id: $skillId})
         MATCH (s2:Skill {id: $relatedSkillId})
         MERGE (s1)-[:RELATED_TO]->(s2)`,
        rel
      );
    }
    console.log(`Created ${skillRelationships.length} skill-skill relationships`);

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await session.close();
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  connectDatabase()
    .then(() => seedDatabase())
    .then(() => closeDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
