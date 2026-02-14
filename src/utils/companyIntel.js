// Company Intel - Heuristic-based company analysis

const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'apple', 'meta', 'facebook',
  'infosys', 'tcs', 'wipro', 'tech mahindra', 'hcl', 'cognizant',
  'accenture', 'ibm', 'oracle', 'sap', 'salesforce', 'adobe',
  'netflix', 'uber', 'airbnb', 'linkedin', 'twitter', 'x',
  'goldman sachs', 'morgan stanley', 'jpmorgan', 'jpm',
  'cisco', 'intel', 'nvidia', 'qualcomm', 'dell', 'hp'
]

const MIDSIZE_COMPANIES = [
  'zomato', 'swiggy', 'razorpay', 'freshworks', 'chargebee',
  'postman', 'thoughtworks', 'lenskart', 'policybazaar', 'sharechat'
]

const INDUSTRY_KEYWORDS = {
  'Financial Services': ['bank', 'finance', 'financial', 'investment', 'trading', 'wealth', 'credit', 'loan'],
  'E-commerce': ['ecommerce', 'e-commerce', 'retail', 'shopping', 'marketplace', 'amazon', 'flipkart'],
  'Healthcare': ['health', 'medical', 'hospital', 'pharma', 'pharmaceutical', 'biotech'],
  'Education': ['education', 'learning', 'university', 'school', 'edtech'],
  'Gaming': ['game', 'gaming', 'entertainment', 'esports'],
  'Telecommunications': ['telecom', 'telecommunication', 'network', 'communication'],
  'Technology Services': [] // Default
}

export function getCompanySize(companyName) {
  if (!companyName || typeof companyName !== 'string') {
    return { category: 'Startup', size: '<200' }
  }

  const lowerName = companyName.toLowerCase().trim()

  // Check against known enterprise list
  for (const enterprise of ENTERPRISE_COMPANIES) {
    if (lowerName.includes(enterprise) || enterprise.includes(lowerName)) {
      return { category: 'Enterprise', size: '2000+' }
    }
  }

  // Check against known mid-size list (200–2000)
  for (const mid of MIDSIZE_COMPANIES) {
    if (lowerName.includes(mid) || mid.includes(lowerName)) {
      return { category: 'Mid-size', size: '200–2000' }
    }
  }

  // Default to Startup
  return { category: 'Startup', size: '<200' }
}

export function inferIndustry(companyName, jdText = '') {
  if (!companyName && !jdText) {
    return 'Technology Services'
  }

  const searchText = `${companyName || ''} ${jdText || ''}`.toLowerCase()

  // Check industry keywords
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (industry === 'Technology Services') continue // Skip default
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return industry
      }
    }
  }

  return 'Technology Services'
}

export function getHiringFocus(companySize) {
  if (companySize === 'Enterprise') {
    return {
      title: 'Typical Hiring Focus',
      points: [
        'Structured DSA and core fundamentals assessment',
        'Strong emphasis on problem-solving methodology',
        'System design and scalability knowledge',
        'Code quality and best practices',
        'Behavioral and cultural fit evaluation'
      ]
    }
  } else if (companySize === 'Mid-size') {
    return {
      title: 'Typical Hiring Focus',
      points: [
        'Practical problem-solving skills',
        'Stack depth and hands-on experience',
        'Ability to work independently',
        'Quick learning and adaptability',
        'Cultural alignment with team'
      ]
    }
  } else {
    // Startup
    return {
      title: 'Typical Hiring Focus',
      points: [
        'Practical problem solving and stack depth',
        'Hands-on coding and implementation',
        'Ability to wear multiple hats',
        'Startup mindset and ownership',
        'Fast iteration and learning'
      ]
    }
  }
}

export function generateCompanyIntel(companyName, role, jdText) {
  if (!companyName || !companyName.trim()) {
    return null
  }

  const sizeInfo = getCompanySize(companyName)
  const industry = inferIndustry(companyName, jdText)
  const hiringFocus = getHiringFocus(sizeInfo.category)

  return {
    companyName: companyName.trim(),
    industry,
    sizeCategory: sizeInfo.category,
    sizeRange: sizeInfo.size,
    hiringFocus
  }
}
