// Proof and Submission Management
import { getAllTestsPassed } from './testChecklist'

const PROOF_STORAGE_KEY = 'prp_final_submission'
const STEPS_STORAGE_KEY = 'prp_steps_completion'

const DEFAULT_STEPS = [
  { id: 'step-1', label: 'Design System Created', completed: false },
  { id: 'step-2', label: 'Landing Page Built', completed: false },
  { id: 'step-3', label: 'Dashboard Components Implemented', completed: false },
  { id: 'step-4', label: 'JD Analysis Engine Working', completed: false },
  { id: 'step-5', label: 'Interactive Results with Skill Toggles', completed: false },
  { id: 'step-6', label: 'Company Intel & Round Mapping', completed: false },
  { id: 'step-7', label: 'Data Model Hardened', completed: false },
  { id: 'step-8', label: 'Test Checklist & Ship Lock', completed: false }
]

export function getStepsCompletion() {
  try {
    const stored = localStorage.getItem(STEPS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure all default steps are present
      const stepMap = new Map(parsed.map(s => [s.id, s]))
      return DEFAULT_STEPS.map(step => ({
        ...step,
        completed: stepMap.get(step.id)?.completed || false
      }))
    }
    return DEFAULT_STEPS
  } catch (error) {
    console.error('Error reading steps completion:', error)
    return DEFAULT_STEPS
  }
}

export function updateStepCompletion(stepId, completed) {
  const steps = getStepsCompletion()
  const updated = steps.map(step =>
    step.id === stepId ? { ...step, completed } : step
  )
  localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getAllStepsCompleted() {
  const steps = getStepsCompletion()
  return steps.every(step => step.completed)
}

export function getProofSubmission() {
  try {
    const stored = localStorage.getItem(PROOF_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
      lovableProjectLink: '',
      githubRepoLink: '',
      deployedUrl: ''
    }
  } catch (error) {
    console.error('Error reading proof submission:', error)
    return {
      lovableProjectLink: '',
      githubRepoLink: '',
      deployedUrl: ''
    }
  }
}

export function saveProofSubmission(submission) {
  localStorage.setItem(PROOF_STORAGE_KEY, JSON.stringify(submission))
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export function getAllProofLinksProvided() {
  const submission = getProofSubmission()
  return (
    validateUrl(submission.lovableProjectLink) &&
    validateUrl(submission.githubRepoLink) &&
    validateUrl(submission.deployedUrl)
  )
}

export function getShippedStatus() {
  const allTestsPassed = getAllTestsPassed()
  const allStepsCompleted = getAllStepsCompleted()
  const allLinksProvided = getAllProofLinksProvided()
  
  return allTestsPassed && allStepsCompleted && allLinksProvided
}

export function formatFinalSubmission() {
  const submission = getProofSubmission()
  
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${submission.lovableProjectLink || 'Not provided'}
GitHub Repository: ${submission.githubRepoLink || 'Not provided'}
Live Deployment: ${submission.deployedUrl || 'Not provided'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`
}
