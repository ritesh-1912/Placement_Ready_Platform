// Round Mapping Engine - Generate rounds based on company size and detected skills

export function generateRoundMapping(companySize, detectedCategories, extractedSkills) {
  const hasDSA = extractedSkills?.categories?.['Core CS']?.skills?.some(s => 
    s.includes('DSA') || s.includes('Data Structures') || s.includes('Algorithms')
  )
  const hasWeb = extractedSkills?.categories?.['Web']?.skills?.length > 0
  const hasLanguages = extractedSkills?.categories?.['Languages']?.skills?.length > 0
  const hasCloud = extractedSkills?.categories?.['Cloud/DevOps']?.skills?.length > 0

  if (companySize === 'Enterprise') {
    return generateEnterpriseRounds(hasDSA, hasWeb, hasLanguages, hasCloud)
  } else if (companySize === 'Mid-size') {
    return generateMidSizeRounds(hasDSA, hasWeb, hasLanguages, hasCloud)
  } else {
    return generateStartupRounds(hasDSA, hasWeb, hasLanguages, hasCloud)
  }
}

function generateEnterpriseRounds(hasDSA, hasWeb, hasLanguages, hasCloud) {
  const rounds = []

  // Round 1
  if (hasDSA) {
    rounds.push({
      round: 'Round 1: Online Test',
      description: 'DSA + Aptitude',
      why: 'Enterprise companies use structured assessments to evaluate fundamental problem-solving skills and logical reasoning at scale.'
    })
  } else {
    rounds.push({
      round: 'Round 1: Online Assessment',
      description: 'Aptitude + Technical Basics',
      why: 'Initial screening to assess basic technical knowledge and problem-solving approach.'
    })
  }

  // Round 2
  if (hasDSA) {
    rounds.push({
      round: 'Round 2: Technical Interview',
      description: 'DSA + Core CS Fundamentals',
      why: 'Deep dive into data structures, algorithms, and computer science fundamentals to evaluate problem-solving methodology.'
    })
  } else {
    rounds.push({
      round: 'Round 2: Technical Deep Dive',
      description: 'Core CS + System Design',
      why: 'Comprehensive technical evaluation focusing on fundamentals and system design principles.'
    })
  }

  // Round 3
  rounds.push({
    round: 'Round 3: Technical + Projects',
    description: 'Tech Stack + Project Discussion',
    why: 'Evaluate hands-on experience, project complexity, and ability to apply technical knowledge in real-world scenarios.'
  })

  // Round 4
  rounds.push({
    round: 'Round 4: Managerial / HR',
    description: 'Behavioral + Cultural Fit',
    why: 'Assess cultural alignment, communication skills, and long-term fit within the organization.'
  })

  return rounds
}

function generateMidSizeRounds(hasDSA, hasWeb, hasLanguages, hasCloud) {
  const rounds = []

  // Round 1
  if (hasWeb || hasLanguages) {
    rounds.push({
      round: 'Round 1: Practical Coding',
      description: 'Live Coding + Problem Solving',
      why: 'Mid-size companies focus on practical coding skills and real-world problem-solving abilities.'
    })
  } else {
    rounds.push({
      round: 'Round 1: Technical Screening',
      description: 'Coding + Technical Basics',
      why: 'Initial assessment of coding skills and technical fundamentals.'
    })
  }

  // Round 2
  if (hasWeb) {
    rounds.push({
      round: 'Round 2: System Discussion',
      description: 'Architecture + Stack Deep Dive',
      why: 'Evaluate understanding of system architecture and depth of knowledge in the tech stack.'
    })
  } else {
    rounds.push({
      round: 'Round 2: Technical Interview',
      description: 'Core Concepts + Problem Solving',
      why: 'Assess technical depth and ability to solve complex problems.'
    })
  }

  // Round 3
  rounds.push({
    round: 'Round 3: Culture Fit',
    description: 'Team Collaboration + Values',
    why: 'Evaluate alignment with company culture and ability to work effectively in a team environment.'
  })

  return rounds
}

function generateStartupRounds(hasDSA, hasWeb, hasLanguages, hasCloud) {
  const rounds = []

  // Round 1
  if (hasWeb || hasLanguages) {
    rounds.push({
      round: 'Round 1: Practical Coding',
      description: 'Live Coding + Stack Implementation',
      why: 'Startups prioritize hands-on coding ability and practical implementation skills over theoretical knowledge.'
    })
  } else {
    rounds.push({
      round: 'Round 1: Technical Screening',
      description: 'Problem Solving + Coding',
      why: 'Quick assessment of coding skills and problem-solving approach.'
    })
  }

  // Round 2
  if (hasWeb) {
    rounds.push({
      round: 'Round 2: System Discussion',
      description: 'Architecture + Real-world Scenarios',
      why: 'Evaluate ability to design and discuss systems that scale, focusing on practical solutions.'
    })
  } else {
    rounds.push({
      round: 'Round 2: Technical Deep Dive',
      description: 'Core Concepts + Projects',
      why: 'Assess technical depth and ability to work independently on projects.'
    })
  }

  // Round 3
  rounds.push({
    round: 'Round 3: Culture Fit',
    description: 'Founder/Team Chat',
    why: 'Startups value cultural fit, ownership mindset, and ability to thrive in a fast-paced environment.'
  })

  return rounds
}
