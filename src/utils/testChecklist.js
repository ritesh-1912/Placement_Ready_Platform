// Test Checklist Storage and Management

const TEST_CHECKLIST_KEY = 'prp_test_checklist'

const DEFAULT_TESTS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Try submitting Analyze form with empty JD textarea. Button should be disabled.',
    checked: false
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Enter JD text < 200 characters. Amber warning should appear.',
    checked: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with React, Python, SQL. Skills should group by category.',
    checked: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Test with Enterprise (Amazon) vs Startup. Round structure should differ.',
    checked: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Same JD + company + role should produce same baseScore every time.',
    checked: false
  },
  {
    id: 'skill-toggles-score',
    label: 'Skill toggles update score live',
    hint: 'On Results page, toggle skills. Readiness score should update immediately.',
    checked: false
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page. Toggles and score should remain.',
    checked: false
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, go to History. Entry should appear. Click to view.',
    checked: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click "Copy 7-day plan", "Copy checklist", "Copy questions". Verify clipboard.',
    checked: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open browser console. Navigate through Dashboard, Analyze, Results, History. Check for errors.',
    checked: false
  }
]

export function getTestChecklist() {
  try {
    const stored = localStorage.getItem(TEST_CHECKLIST_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure all default tests are present
      const testMap = new Map(parsed.map(t => [t.id, t]))
      return DEFAULT_TESTS.map(test => ({
        ...test,
        checked: testMap.get(test.id)?.checked || false
      }))
    }
    return DEFAULT_TESTS
  } catch (error) {
    console.error('Error reading test checklist:', error)
    return DEFAULT_TESTS
  }
}

export function updateTestChecklist(testId, checked) {
  const checklist = getTestChecklist()
  const updated = checklist.map(test =>
    test.id === testId ? { ...test, checked } : test
  )
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(updated))
  return updated
}

export function resetTestChecklist() {
  localStorage.setItem(TEST_CHECKLIST_KEY, JSON.stringify(DEFAULT_TESTS))
  return DEFAULT_TESTS
}

export function getAllTestsPassed() {
  const checklist = getTestChecklist()
  return checklist.every(test => test.checked)
}

export function getTestsPassedCount() {
  const checklist = getTestChecklist()
  return checklist.filter(test => test.checked).length
}
