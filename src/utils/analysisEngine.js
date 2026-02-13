import { extractSkills } from './skillExtraction'
import { generateCompanyIntel } from './companyIntel'
import { generateRoundMapping } from './roundMapping'

export function generateChecklist(extractedSkills, detectedCategories) {
  const checklist = {
    'Round 1: Aptitude / Basics': [
      'Review basic mathematics (percentages, ratios, averages)',
      'Practice logical reasoning questions',
      'Prepare for verbal ability tests',
      'Review quantitative aptitude basics',
      'Practice time management for tests',
      'Review general knowledge if required',
      'Prepare for situational judgment questions',
      'Practice mock aptitude tests'
    ],
    'Round 2: DSA + Core CS': [],
    'Round 3: Tech Interview (Projects + Stack)': [],
    'Round 4: Managerial / HR': [
      'Prepare "Tell me about yourself" answer',
      'Research company values and culture',
      'Prepare questions to ask interviewer',
      'Review your resume thoroughly',
      'Prepare STAR method examples',
      'Practice behavioral questions',
      'Prepare salary expectations',
      'Review your career goals'
    ]
  }

  // Round 2: DSA + Core CS
  const round2Items = [
    'Review core data structures (arrays, linked lists, trees, graphs)',
    'Practice algorithm problems (sorting, searching, dynamic programming)',
    'Solve coding problems on platforms (LeetCode, HackerRank)',
    'Review time and space complexity analysis',
    'Practice system design basics',
    'Review database concepts and SQL queries',
    'Prepare for coding interview rounds',
    'Practice explaining your approach clearly'
  ]

  if (extractedSkills.categories['Core CS']?.skills.includes('DSA')) {
    round2Items.unshift('Focus on advanced DSA topics (graphs, dynamic programming)')
  }
  if (extractedSkills.categories['Core CS']?.skills.includes('DBMS')) {
    round2Items.push('Deep dive into database design and normalization')
  }
  if (extractedSkills.categories['Core CS']?.skills.includes('OS')) {
    round2Items.push('Review operating system concepts (processes, threads, memory)')
  }
  if (extractedSkills.categories['Core CS']?.skills.includes('Networks')) {
    round2Items.push('Review networking fundamentals (TCP/IP, HTTP, protocols)')
  }

  checklist['Round 2: DSA + Core CS'] = round2Items.slice(0, 8)

  // Round 3: Tech Interview
  const round3Items = [
    'Prepare detailed explanation of your projects',
    'Review tech stack used in your projects',
    'Be ready to explain design decisions',
    'Prepare to discuss challenges faced and solutions',
    'Review version control (Git) basics',
    'Prepare to discuss scalability and performance',
    'Review API design principles',
    'Prepare to write code on whiteboard/editor'
  ]

  // Add tech-specific items
  if (extractedSkills.categories['Languages']?.skills.length > 0) {
    const languages = extractedSkills.categories['Languages'].skills.join(', ')
    round3Items.unshift(`Deep dive into ${languages} concepts and best practices`)
  }
  if (extractedSkills.categories['Web']?.skills.length > 0) {
    const webTech = extractedSkills.categories['Web'].skills.join(', ')
    round3Items.push(`Review ${webTech} architecture and patterns`)
  }
  if (extractedSkills.categories['Data']?.skills.length > 0) {
    const dbTech = extractedSkills.categories['Data'].skills.join(', ')
    round3Items.push(`Prepare questions on ${dbTech} optimization and queries`)
  }
  if (extractedSkills.categories['Cloud/DevOps']?.skills.length > 0) {
    const cloudTech = extractedSkills.categories['Cloud/DevOps'].skills.join(', ')
    round3Items.push(`Review ${cloudTech} deployment and best practices`)
  }

  checklist['Round 3: Tech Interview (Projects + Stack)'] = round3Items.slice(0, 8)

  return checklist
}

export function generate7DayPlan(extractedSkills, detectedCategories) {
  const plan = {
    'Day 1-2: Basics + Core CS': [],
    'Day 3-4: DSA + Coding Practice': [],
    'Day 5: Project + Resume Alignment': [],
    'Day 6: Mock Interview Questions': [],
    'Day 7: Revision + Weak Areas': []
  }

  // Day 1-2
  const day12Items = [
    'Review fundamental CS concepts',
    'Brush up on OOP principles',
    'Review database basics',
    'Go through operating system fundamentals'
  ]

  if (extractedSkills.categories['Core CS']?.skills.includes('DSA')) {
    day12Items.push('Start with basic DSA concepts (arrays, strings)')
  }
  if (extractedSkills.categories['Core CS']?.skills.includes('DBMS')) {
    day12Items.push('Review SQL basics and normalization')
  }

  plan['Day 1-2: Basics + Core CS'] = day12Items

  // Day 3-4
  const day34Items = [
    'Solve 5-10 LeetCode easy problems',
    'Practice array and string manipulation',
    'Review sorting and searching algorithms',
    'Practice problem-solving approach'
  ]

  if (extractedSkills.categories['Core CS']?.skills.includes('DSA')) {
    day34Items.push('Focus on trees and graphs problems')
    day34Items.push('Practice dynamic programming patterns')
  }

  plan['Day 3-4: DSA + Coding Practice'] = day34Items

  // Day 5
  const day5Items = [
    'Review all projects in your resume',
    'Prepare 2-minute project explanations',
    'Align project descriptions with JD requirements',
    'Update resume with relevant keywords',
    'Prepare STAR format examples from projects'
  ]

  if (extractedSkills.categories['Web']?.skills.length > 0) {
    const webTech = extractedSkills.categories['Web'].skills.join(', ')
    day5Items.push(`Highlight ${webTech} experience in projects`)
  }

  plan['Day 5: Project + Resume Alignment'] = day5Items

  // Day 6
  const day6Items = [
    'Practice common behavioral questions',
    'Prepare technical question answers',
    'Mock interview with friend or mentor',
    'Record yourself answering questions',
    'Review common interview mistakes'
  ]

  plan['Day 6: Mock Interview Questions'] = day6Items

  // Day 7
  plan['Day 7: Revision + Weak Areas'] = [
    'Revise all core concepts',
    'Review your weak areas',
    'Practice time-bound coding problems',
    'Review company-specific questions',
    'Prepare final questions for interviewer',
    'Get good sleep and stay confident'
  ]

  return plan
}

export function generateQuestions(extractedSkills, detectedCategories) {
  const questions = []

  // DSA questions
  if (extractedSkills.categories['Core CS']?.skills.includes('DSA')) {
    questions.push({
      question: 'How would you optimize search in sorted data?',
      category: 'DSA'
    })
    questions.push({
      question: 'Explain time complexity of different sorting algorithms. When would you use each?',
      category: 'DSA'
    })
  }

  // Database questions
  if (extractedSkills.categories['Data']?.skills.length > 0) {
    const dbSkills = extractedSkills.categories['Data'].skills
    if (dbSkills.some(s => s.includes('SQL') || s.includes('PostgreSQL') || s.includes('MySQL'))) {
      questions.push({
        question: 'Explain database indexing and when it helps. What are the trade-offs?',
        category: 'Database'
      })
      questions.push({
        question: 'What is normalization? Explain 1NF, 2NF, and 3NF with examples.',
        category: 'Database'
      })
    }
    if (dbSkills.some(s => s.includes('MongoDB'))) {
      questions.push({
        question: 'When would you choose MongoDB over SQL databases? Explain use cases.',
        category: 'Database'
      })
    }
  }

  // Web framework questions
  if (extractedSkills.categories['Web']?.skills.some(s => s.includes('React'))) {
    questions.push({
      question: 'Explain React state management options (useState, Context, Redux). When to use each?',
      category: 'Web'
    })
    questions.push({
      question: 'What is the virtual DOM? How does React optimize re-renders?',
      category: 'Web'
    })
    questions.push({
      question: 'Explain React hooks. What are the rules of hooks?',
      category: 'Web'
    })
  }

  if (extractedSkills.categories['Web']?.skills.some(s => s.includes('Node'))) {
    questions.push({
      question: 'Explain Node.js event loop. How does it handle asynchronous operations?',
      category: 'Web'
    })
  }

  // Language-specific questions
  if (extractedSkills.categories['Languages']?.skills.some(s => s.includes('Java'))) {
    questions.push({
      question: 'Explain Java memory management. What is garbage collection?',
      category: 'Languages'
    })
  }

  if (extractedSkills.categories['Languages']?.skills.some(s => s.includes('Python'))) {
    questions.push({
      question: 'Explain Python GIL (Global Interpreter Lock). How does it affect multithreading?',
      category: 'Languages'
    })
  }

  if (extractedSkills.categories['Languages']?.skills.some(s => s.includes('JavaScript'))) {
    questions.push({
      question: 'Explain JavaScript closures and scope. Provide examples.',
      category: 'Languages'
    })
    questions.push({
      question: 'What is the difference between var, let, and const? Explain hoisting.',
      category: 'Languages'
    })
  }

  // Cloud/DevOps questions
  if (extractedSkills.categories['Cloud/DevOps']?.skills.some(s => s.includes('AWS'))) {
    questions.push({
      question: 'Explain AWS services you have used. When would you use EC2 vs Lambda?',
      category: 'Cloud/DevOps'
    })
  }

  if (extractedSkills.categories['Cloud/DevOps']?.skills.some(s => s.includes('Docker'))) {
    questions.push({
      question: 'What is Docker? Explain containers vs virtual machines.',
      category: 'Cloud/DevOps'
    })
  }

  // System Design
  if (extractedSkills.categories['Core CS']?.skills.includes('Networks')) {
    questions.push({
      question: 'Explain HTTP vs HTTPS. How does SSL/TLS work?',
      category: 'System Design'
    })
  }

  // Fill remaining slots with general questions
  const generalQuestions = [
    'Tell me about yourself. Walk me through your resume.',
    'Why do you want to work at this company?',
    'What are your strengths and weaknesses?',
    'Where do you see yourself in 5 years?',
    'Describe a challenging project you worked on.',
    'How do you handle tight deadlines and pressure?',
    'Explain a technical concept to a non-technical person.',
    'What is your approach to debugging a complex issue?',
    'How do you stay updated with technology trends?',
    'Describe a time you worked in a team. What was your role?'
  ]

  while (questions.length < 10) {
    const generalQ = generalQuestions[questions.length % generalQuestions.length]
    if (!questions.some(q => q.question === generalQ)) {
      questions.push({
        question: generalQ,
        category: 'General'
      })
    } else {
      break
    }
  }

  return questions.slice(0, 10)
}

export function calculateReadinessScore(company, role, jdText, detectedCategories) {
  let score = 35 // Base score

  // +5 per detected category (max 30)
  const categoryBonus = Math.min(detectedCategories.length * 5, 30)
  score += categoryBonus

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10
  }

  // Cap at 100
  return Math.min(score, 100)
}

export function analyzeJD(company, role, jdText) {
  const { categories, detectedCategories } = extractSkills(jdText)
  const checklist = generateChecklist({ categories }, detectedCategories)
  const plan = generate7DayPlan({ categories }, detectedCategories)
  const questions = generateQuestions({ categories }, detectedCategories)
  const readinessScore = calculateReadinessScore(company, role, jdText, detectedCategories)
  
  // Generate company intel and round mapping
  const companyIntel = generateCompanyIntel(company, role, jdText)
  const roundMapping = companyIntel
    ? generateRoundMapping(companyIntel.sizeCategory, detectedCategories, { categories })
    : null

  return {
    extractedSkills: categories,
    detectedCategories,
    checklist,
    plan,
    questions,
    readinessScore,
    companyIntel,
    roundMapping
  }
}
