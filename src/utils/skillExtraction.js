// Skill extraction from JD text (case-insensitive)

const skillCategories = {
  'Core CS': {
    keywords: ['dsa', 'data structures', 'algorithms', 'oop', 'object-oriented', 'dbms', 'database', 'os', 'operating system', 'networks', 'computer networks', 'cn'],
    skills: []
  },
  'Languages': {
    keywords: ['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'cpp', 'c ', 'go ', 'golang', 'rust', 'kotlin', 'swift'],
    skills: []
  },
  'Web': {
    keywords: ['react', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'rest', 'restful', 'graphql', 'vue', 'angular', 'html', 'css'],
    skills: []
  },
  'Data': {
    keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'oracle', 'dynamodb', 'cassandra'],
    skills: []
  },
  'Cloud/DevOps': {
    keywords: ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'terraform', 'linux', 'unix'],
    skills: []
  },
  'Testing': {
    keywords: ['selenium', 'cypress', 'playwright', 'junit', 'pytest', 'jest', 'mocha', 'testing', 'test automation'],
    skills: []
  }
}

// Map keywords to display names
const keywordToSkill = {
  'dsa': 'DSA',
  'data structures': 'DSA',
  'algorithms': 'DSA',
  'oop': 'OOP',
  'object-oriented': 'OOP',
  'dbms': 'DBMS',
  'database': 'DBMS',
  'os': 'OS',
  'operating system': 'OS',
  'networks': 'Networks',
  'computer networks': 'Networks',
  'cn': 'Networks',
  'java': 'Java',
  'python': 'Python',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'c ': 'C',
  'go ': 'Go',
  'golang': 'Go',
  'react': 'React',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express',
  'rest': 'REST',
  'restful': 'REST',
  'graphql': 'GraphQL',
  'vue': 'Vue',
  'angular': 'Angular',
  'sql': 'SQL',
  'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'redis': 'Redis',
  'aws': 'AWS',
  'azure': 'Azure',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'ci/cd': 'CI/CD',
  'selenium': 'Selenium',
  'cypress': 'Cypress',
  'playwright': 'Playwright',
  'junit': 'JUnit',
  'pytest': 'PyTest',
}

export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { categories: {}, detectedCategories: [] }
  }

  const lowerText = jdText.toLowerCase()
  const result = JSON.parse(JSON.stringify(skillCategories)) // Deep copy
  const detectedCategories = []

  // Extract skills from each category
  // Sort keywords by length (longest first) to match multi-word keywords before single words
  Object.keys(result).forEach(category => {
    const categoryData = result[category]
    const foundSkills = new Set()
    const sortedKeywords = [...categoryData.keywords].sort((a, b) => b.length - a.length)

    sortedKeywords.forEach(keyword => {
      // Skip if skill already found (avoid duplicates)
      const skillName = keywordToSkill[keyword] || keyword.charAt(0).toUpperCase() + keyword.slice(1)
      if (foundSkills.has(skillName)) return

      // Handle special cases for keywords with spaces or special chars
      let regex
      if (keyword.endsWith(' ')) {
        // For "c " or "go ", match word boundary before and space after
        const trimmed = keyword.trim()
        regex = new RegExp(`\\b${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, 'i')
      } else if (keyword.includes(' ')) {
        // Multi-word keywords like "data structures"
        regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      } else {
        // Single word keywords with word boundaries
        regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      }

      if (regex.test(lowerText)) {
        foundSkills.add(skillName)
      }
    })

    if (foundSkills.size > 0) {
      result[category].skills = Array.from(foundSkills)
      detectedCategories.push(category)
    } else {
      result[category].skills = []
    }
  })

  // If no skills detected, still show "General fresher stack" (per spec)
  if (detectedCategories.length === 0) {
    result['General'] = {
      keywords: [],
      skills: ['General fresher stack']
    }
    detectedCategories.push('General')
  }

  return {
    categories: result,
    detectedCategories
  }
}
