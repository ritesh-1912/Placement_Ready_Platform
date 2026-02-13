# Verification Guide - Placement Readiness Platform

## ✅ Implementation Confirmation

### 1. Skill Extraction ✅
- **Location:** `src/utils/skillExtraction.js`
- **Status:** Working
- **Features:**
  - Case-insensitive keyword detection
  - 6 categories: Core CS, Languages, Web, Data, Cloud/DevOps, Testing
  - Handles multi-word keywords (e.g., "data structures", "object-oriented")
  - Falls back to "General fresher stack" if no skills detected
  - Maps keywords to display names (e.g., "javascript" → "JavaScript")

### 2. Analysis Engine ✅
- **Location:** `src/utils/analysisEngine.js`
- **Status:** Working
- **Features:**
  - Generates round-wise checklist (4 rounds, 5-8 items each)
  - Generates 7-day preparation plan
  - Generates 10 likely interview questions based on detected skills
  - Calculates readiness score (0-100)

### 3. LocalStorage Persistence ✅
- **Location:** `src/utils/storage.js`
- **Status:** Working
- **Features:**
  - Saves analysis with unique ID and timestamp
  - Retrieves history
  - Gets analysis by ID
  - Deletes analysis
  - Persists across page refreshes

### 4. Pages Created ✅
- **Analyze Page:** `/dashboard/analyze` - Input form for JD analysis
- **Results Page:** `/dashboard/results` - Displays analysis results
- **History Page:** `/dashboard/history` - Lists all saved analyses

### 5. Routes Added ✅
- `/dashboard/analyze` - Analyze JD form
- `/dashboard/results` - View analysis results
- `/dashboard/history` - View analysis history

## 🧪 Steps to Verify

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Navigate to Analyze Page
1. Go to `http://localhost:5173/dashboard/analyze`
2. Or click "Analyze JD" in the sidebar

### Step 3: Test with Sample JD
Use the sample JD from `SAMPLE_JD.md`:

**Company:** TechCorp Inc.
**Role:** Frontend Developer
**JD Text:** (Copy from SAMPLE_JD.md)

Expected detected skills:
- **Languages:** JavaScript, TypeScript
- **Web:** React, Next.js, REST, GraphQL
- **Data:** SQL, PostgreSQL, MongoDB
- **Cloud/DevOps:** AWS, Docker, CI/CD, Kubernetes, Linux
- **Testing:** Jest, Cypress
- **Core CS:** DSA

### Step 4: Verify Analysis Output
After clicking "Analyze Job Description", you should see:

1. **Overall Readiness Score:** Should be calculated based on:
   - Base: 35
   - Categories detected: +5 per category (max 30)
   - Company provided: +10
   - Role provided: +10
   - JD length > 800 chars: +10
   - **Expected score:** ~85-100

2. **Key Skills Extracted:** Tags grouped by category

3. **Round-wise Checklist:** 4 rounds with 5-8 items each

4. **7-Day Plan:** Day-by-day preparation tasks

5. **10 Interview Questions:** Skill-specific questions

### Step 5: Verify History Persistence
1. After analysis, go to `/dashboard/history`
2. You should see the saved analysis with:
   - Company name
   - Role
   - Date/time
   - Readiness score
3. Click on an entry to view full results
4. **Refresh the page** - history should persist
5. **Close and reopen browser** - history should still be there

### Step 6: Test Edge Cases

#### Test 1: Empty JD
- Leave JD text empty
- Should show error/validation

#### Test 2: JD with No Skills
- Use a generic JD without technical keywords
- Should show "General fresher stack"
- Readiness score should be lower (35-45)

#### Test 3: Minimal JD
- Company: "Google"
- Role: "Engineer"
- JD: "Looking for a software engineer"
- Should detect minimal skills
- Score should be ~55 (35 base + 10 company + 10 role)

#### Test 4: Full JD
- Use the sample JD from SAMPLE_JD.md
- Should detect multiple categories
- Score should be ~85-100

### Step 7: Verify Skill-Specific Questions
Check that questions match detected skills:
- If React detected → Should see React-related questions
- If SQL detected → Should see database indexing questions
- If DSA detected → Should see algorithm optimization questions

## 📋 Sample Test JD

Copy this into the Analyze form:

```
Software Engineer Position

We are looking for a skilled developer with experience in:
- JavaScript and TypeScript
- React and Next.js framework
- SQL databases (PostgreSQL)
- MongoDB for NoSQL solutions
- AWS cloud services
- Docker containers
- CI/CD pipelines
- Strong DSA knowledge
- Testing with Jest and Cypress
- RESTful APIs and GraphQL

Requirements:
- 2+ years experience
- Strong problem-solving skills
- Good communication skills
```

**Expected Results:**
- **Categories Detected:** Languages, Web, Data, Cloud/DevOps, Testing, Core CS
- **Readiness Score:** ~85-95 (depending on company/role fields)
- **Questions:** Should include React, SQL, DSA, AWS questions

## 🔍 Troubleshooting

### History Not Persisting?
- Check browser console for errors
- Verify localStorage is enabled
- Check `localStorage.getItem('placement_analysis_history')` in console

### Skills Not Detected?
- Check keyword spelling in JD text
- Verify keywords are in the skill extraction list
- Check browser console for errors

### Score Calculation Wrong?
- Verify formula in `analysisEngine.js`
- Check that company/role fields are filled
- Verify JD length > 800 chars

## ✅ Success Criteria

- [x] Skill extraction works for all categories
- [x] Analysis generates checklist, plan, and questions
- [x] Readiness score calculates correctly
- [x] History saves to localStorage
- [x] History persists after refresh
- [x] Results page displays saved analysis
- [x] History page lists all entries
- [x] Clicking history entry opens results

---

## Interactive Results & Export (Verification)

### Live readiness score
- Open any analysis on `/dashboard/results`.
- In "Key skills extracted", each skill has **Know** / **Practice** (default: Practice).
- Toggle some skills to "Know": the **Overall Readiness** circle updates immediately.
- Formula: base score + 2 per "Know" − 2 per "Practice", clamped 0–100.

### Toggles persist after refresh
- On Results, set a few skills to "Know" and a few to "Practice".
- Refresh the page (or go to History and open the same entry again).
- Skill toggles and the readiness score should match what you set.

### Export tools
- **Copy 7-day plan** – copies the 7-day plan as plain text.
- **Copy round checklist** – copies the round-wise checklist.
- **Copy 10 questions** – copies the 10 interview questions.
- **Download as TXT** – downloads one file with all sections (skills, checklist, plan, questions).
- After copy, "Copied to clipboard" appears briefly.

### History consistent with edits
- On Results, change some skill toggles (and see the score change).
- Go to **History**. The same entry should show the **updated score**.
- Open that entry again: toggles and score should be unchanged.

### Action Next box
- At the bottom of Results, **Action Next** shows:
  - Up to 3 weak skills (those marked "Need practice").
  - Suggestion: "Start Day 1 plan now."
- If all skills are "Know", it shows a short message instead.

---

## Company Intel & Round Mapping (Verification)

### Company Intel Block
- **Location:** `/dashboard/results` (only shows if company name is provided)
- **Components:**
  - Company name
  - Industry (inferred from keywords or defaults to "Technology Services")
  - Size category (Startup/Mid-size/Enterprise) with employee range
  - "Typical Hiring Focus" section with 5 bullet points
  - Demo mode note at bottom

### Round Mapping Timeline
- **Location:** `/dashboard/results` (only shows if company name is provided)
- **Features:**
  - Vertical timeline with numbered rounds
  - Each round shows: Round name, description, "Why this round matters" explanation
  - Rounds adapt based on company size and detected skills

### Test Scenarios

#### Scenario 1: Enterprise Company (Amazon)
1. Go to `/dashboard/analyze`
2. Company: **Amazon**
3. Role: **Software Engineer**
4. JD Text: Include keywords like "DSA", "React", "AWS"
5. Click Analyze

**Expected Results:**
- Company Intel shows:
  - Company: Amazon
  - Industry: E-commerce (or Technology Services)
  - Size: Enterprise (2000+)
  - Hiring Focus: Structured DSA, system design, code quality
- Round Mapping shows:
  - Round 1: Online Test (DSA + Aptitude)
  - Round 2: Technical Interview (DSA + Core CS)
  - Round 3: Technical + Projects
  - Round 4: Managerial / HR
- Each round has "Why this round matters" explanation

#### Scenario 2: Startup Company (Unknown)
1. Go to `/dashboard/analyze`
2. Company: **TechStartup Inc**
3. Role: **Frontend Developer**
4. JD Text: Include keywords like "React", "Node.js", "JavaScript"
5. Click Analyze

**Expected Results:**
- Company Intel shows:
  - Company: TechStartup Inc
  - Industry: Technology Services (default)
  - Size: Startup (<200)
  - Hiring Focus: Practical problem solving, stack depth, fast iteration
- Round Mapping shows:
  - Round 1: Practical Coding (Live Coding + Stack Implementation)
  - Round 2: System Discussion (Architecture + Real-world Scenarios)
  - Round 3: Culture Fit (Founder/Team Chat)
- Rounds focus on practical skills over theory

#### Scenario 3: Mid-size Company (Inferred)
1. Go to `/dashboard/analyze`
2. Company: **MidTech Solutions**
3. Role: **Full Stack Developer**
4. JD Text: Include keywords like "Python", "SQL", "Docker"
5. Click Analyze

**Expected Results:**
- Company Intel shows:
  - Size: Startup (<200) - defaults to Startup if not in enterprise list
  - Hiring Focus: Practical problem-solving, stack depth
- Round Mapping adapts to detected skills (Python, SQL, Docker)

#### Scenario 4: No Company Name
1. Go to `/dashboard/analyze`
2. Company: **(leave empty)**
3. Role: **Software Engineer**
4. JD Text: Include technical keywords
5. Click Analyze

**Expected Results:**
- Company Intel block: **NOT shown**
- Round Mapping: **NOT shown**
- Other sections (skills, checklist, plan, questions) still work

### Verification Checklist

- [ ] Company Intel renders when company name is provided
- [ ] Company Intel shows correct industry (inferred or default)
- [ ] Company Intel shows correct size category (Enterprise for known companies, Startup for unknown)
- [ ] Hiring Focus adapts to company size (Enterprise vs Startup)
- [ ] Round Mapping shows vertical timeline
- [ ] Round Mapping adapts to company size (Enterprise = 4 rounds, Startup = 3 rounds)
- [ ] Round Mapping adapts to detected skills (DSA → different rounds than Web)
- [ ] Each round has "Why this round matters" explanation
- [ ] Demo mode note appears at bottom of Company Intel
- [ ] Company Intel and Round Mapping persist in history entry
- [ ] Reopening from History shows same Company Intel and Round Mapping

---

## Data Model Hardening & Validation (Verification)

### Input Validation
- **Location:** `/dashboard/analyze`
- **JD Textarea:** Required field (cannot submit empty)
- **Min Length Warning:** If JD < 200 characters, shows amber warning:
  - "This JD is too short to analyze deeply. Paste full JD for better output."
  - Still allows analysis but warns user
- **Company & Role:** Remain optional

### Standardized Schema
All analysis entries follow consistent schema:
- `id`, `createdAt`, `updatedAt` (timestamps)
- `company`, `role`, `jdText` (strings, empty strings allowed)
- `extractedSkills`: Object with `coreCS`, `languages`, `web`, `data`, `cloud`, `testing`, `other` arrays
- `roundMapping`: Array of `{roundTitle, focusAreas[], whyItMatters}`
- `checklist`: Array of `{roundTitle, items[]}`
- `plan7Days`: Array of `{day, focus, tasks[]}`
- `questions`: Array of strings
- `baseScore`: Number (never changes after initial analysis)
- `finalScore`: Number (updates based on skillConfidenceMap)
- `skillConfidenceMap`: Object mapping skills to "know" | "practice"

### Default Skills When None Detected
- If skill extraction returns empty:
  - Populates `extractedSkills.other` with: ["Communication", "Problem solving", "Basic coding", "Projects"]
  - Plan, checklist, and questions adjust accordingly

### Score Stability Rules
- **baseScore:** Computed only during initial analysis, never changes
- **finalScore:** Starts equal to baseScore, updates only when user toggles skills
- **When user toggles skills:**
  - Updates `finalScore` and `updatedAt`
  - Persists to history entry
  - baseScore remains unchanged

### History Robustness
- **Corrupted Entry Handling:**
  - If localStorage has corrupted entry, it's skipped during load
  - Shows warning: "One saved entry couldn't be loaded. Create a new analysis."
  - Valid entries still load correctly
  - History page continues to function

### Edge Case Tests

#### Test 1: Empty JD Validation
1. Go to `/dashboard/analyze`
2. Leave JD textarea empty
3. Click "Analyze Job Description"
4. **Expected:** Button disabled, cannot submit

#### Test 2: Short JD Warning
1. Go to `/dashboard/analyze`
2. Enter JD text < 200 characters (e.g., "Looking for a developer")
3. **Expected:** Amber warning appears: "This JD is too short to analyze deeply..."
4. Can still analyze, but warning shown

#### Test 3: No Skills Detected
1. Go to `/dashboard/analyze`
2. Enter JD with no technical keywords (e.g., "Looking for a team player")
3. Click Analyze
4. **Expected:**
   - `extractedSkills.other` contains: ["Communication", "Problem solving", "Basic coding", "Projects"]
   - Plan, checklist, questions still generated

#### Test 4: Score Stability
1. Analyze a JD (note the initial score)
2. On Results page, toggle some skills to "Know"
3. Note the updated score
4. Refresh page
5. **Expected:**
   - Score matches the updated score (not initial)
   - baseScore unchanged (check localStorage)
   - finalScore updated

#### Test 5: Corrupted Entry Handling
1. Open browser console
2. Run: `localStorage.setItem('placement_analysis_history', '[{"invalid": "data"}]')`
3. Refresh History page
4. **Expected:**
   - Warning message appears: "One saved entry couldn't be loaded..."
   - Page still loads (no crash)
   - Can create new analysis

#### Test 6: Schema Consistency
1. Create multiple analyses
2. Check localStorage: `localStorage.getItem('placement_analysis_history')`
3. **Expected:**
   - All entries have same schema structure
   - All required fields present (even if empty strings)
   - No missing fields

### Verification Checklist

- [ ] JD textarea is required (cannot submit empty)
- [ ] Warning appears for JD < 200 characters
- [ ] Company and Role remain optional
- [ ] All analysis entries follow standardized schema
- [ ] Default skills populate when none detected
- [ ] baseScore never changes after initial analysis
- [ ] finalScore updates when skills toggled
- [ ] Corrupted entries are skipped gracefully
- [ ] Warning shown when corrupted entries detected
- [ ] History page works even with corrupted entries

---

## Test Checklist & Ship Lock (Verification)

### Test Checklist Page
- **Location:** `/prp/07-test`
- **Features:**
  - 10 test items with checkboxes
  - Each item has "How to test" hint
  - Summary showing "Tests Passed: X / 10"
  - Warning if < 10: "Fix issues before shipping."
  - Success message if all passed: "All tests passed! Ready to ship."
  - Reset button to clear all checkboxes

### Ship Page Lock
- **Location:** `/prp/08-ship`
- **Lock Logic:**
  - If not all 10 tests passed: Shows locked state with message
  - Displays current test count (e.g., "Tests Passed: 5 / 10")
  - Button to navigate back to Test Checklist
  - If all tests passed: Shows "Ready to Ship!" with success message

### Test Items
1. JD required validation works
2. Short JD warning shows for <200 chars
3. Skills extraction groups correctly
4. Round mapping changes based on company + skills
5. Score calculation is deterministic
6. Skill toggles update score live
7. Changes persist after refresh
8. History saves and loads correctly
9. Export buttons copy the correct content
10. No console errors on core pages

### Verification Steps

#### Step 1: Access Test Checklist
1. Navigate to `/prp/07-test`
2. **Expected:** Test Checklist page loads with all 10 items unchecked
3. Summary shows "Tests Passed: 0 / 10"
4. Warning message: "Fix issues before shipping."

#### Step 2: Check Individual Tests
1. Click checkbox for "JD required validation works"
2. **Expected:** Checkbox checked, summary updates to "Tests Passed: 1 / 10"
3. Refresh page
4. **Expected:** Checkbox remains checked (persisted in localStorage)

#### Step 3: Complete All Tests
1. Check all 10 test items
2. **Expected:** Summary shows "Tests Passed: 10 / 10"
3. Success message: "All tests passed! Ready to ship."
4. Warning message disappears

#### Step 4: Test Ship Page Lock (Before All Passed)
1. Reset checklist (or ensure not all tests passed)
2. Navigate to `/prp/08-ship`
3. **Expected:**
   - Lock icon displayed
   - Message: "Ship Page Locked"
   - Current test count shown
   - Button to "Go to Test Checklist"

#### Step 5: Test Ship Page (After All Passed)
1. Complete all 10 tests on `/prp/07-test`
2. Navigate to `/prp/08-ship`
3. **Expected:**
   - Success icon displayed
   - Message: "Ready to Ship!"
   - Pre-ship checklist shown
   - No lock message

#### Step 6: Test Reset Functionality
1. Complete some tests (e.g., 5/10)
2. Click "Reset checklist" button
3. Confirm reset
4. **Expected:**
   - All checkboxes unchecked
   - Summary resets to "Tests Passed: 0 / 10"
   - Warning message reappears
   - Ship page becomes locked again

#### Step 7: Verify localStorage Persistence
1. Check some tests
2. Close browser tab
3. Reopen and navigate to `/prp/07-test`
4. **Expected:** Checked tests remain checked
5. Check localStorage: `localStorage.getItem('prp_test_checklist')`
6. **Expected:** JSON array with test states

### Verification Checklist

- [ ] Test Checklist page loads at `/prp/07-test`
- [ ] All 10 test items displayed with checkboxes
- [ ] Each test has "How to test" hint
- [ ] Summary shows correct count (X / 10)
- [ ] Warning appears when < 10 tests passed
- [ ] Success message appears when all 10 passed
- [ ] Ship page locked when not all tests passed
- [ ] Ship page unlocked when all tests passed
- [ ] Reset button clears all checkboxes
- [ ] Checklist persists in localStorage after refresh
- [ ] Ship page shows correct test count when locked

## 🎯 Next Steps

The system is ready for use! All features are implemented and working offline with localStorage persistence.
