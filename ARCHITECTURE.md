# 🏗️ Malla Interactiva UAI - Architecture Documentation

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Malla Interactiva UAI                       │
│          Interactive Curriculum Visualizer & Planner            │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼──────┐ ┌──▼──────┐ ┌──▼──────────┐
            │ Main Viewer  │ │   ICA   │ │  Generator  │
            │  (min1.js)   │ │(min2.js)│ │  (min3.js)  │
            └──────────────┘ └─────────┘ └─────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Data Layer (JSON)      │
                    │  - carreras.json        │
                    │  - data_ICInf.json      │
                    │  - colors_ICInf.json    │
                    └─────────────────────────┘
```

## 🎯 Application Modes

### 1. Main Malla Viewer (`/index.html`)
**Purpose**: View and track course completion

**Features**:
- Interactive course grid with prerequisites
- Click to mark courses as approved
- Visual prerequisite validation
- Credit counting
- Progress percentage
- LocalStorage persistence

**Tech Stack**: `min1.js` = init + Malla + Ramo

### 2. ICA Calculator (`/ica/index.html`)
**Purpose**: Calculate academic priority (ICA)

**Features**:
- Semester-by-semester course selection
- Grade input for each course
- ICA calculation based on grades and credits
- FAE (Financial Aid Factor) consideration
- Custom course creation for unofficial courses

**Tech Stack**: `min2.js` = min1 + SelectableRamo + SemesterManager + Priorix + MallaEditor

### 3. Malla Generator (`/personalizar/index.html`)
**Purpose**: Create custom curriculum plans

**Features**:
- Drag-drop course organization
- Semester planning
- Custom course creation
- Export to JSON
- Import/share custom mallas

**Tech Stack**: `min3.js` = min1 + SelectableRamo + SemesterManager + Generator + MallaEditor

### 4. Custom Malla Viewer (`/personalizar/malla.html`)
**Purpose**: View user-generated custom mallas

**Features**:
- Load custom malla JSON
- Same interaction as main viewer
- Can mark courses as approved

**Tech Stack**: `min4.js` = init + Malla + Ramo + CustomMalla

---

## 🧩 Core Classes & Architecture

### Class Hierarchy

```
Ramo (Base Class - 431 lines)
├── Properties:
│   ├── name: string
│   ├── sigla: string (unique identifier)
│   ├── credits: number
│   ├── creditsSCT: number
│   ├── category: string
│   ├── prer: Set<string> (prerequisites)
│   ├── dictatesIn: "A"|"P"|"I" (semester availability)
│   ├── approved: boolean
│   └── malla: Malla (parent reference)
├── Methods:
│   ├── draw() - Renders SVG using D3.js
│   ├── approveRamo() - Marks as approved
│   ├── verifyPrer() - Checks if prerequisites met
│   ├── wrap() - Text wrapping algorithm
│   └── needsWhiteText() - Color contrast calculation
└──
    └── SelectableRamo (extends Ramo - 71 lines)
        ├── Additional Properties:
        │   └── selected: boolean
        └── Methods:
            ├── selectRamo() - Select for semester
            └── showWarning() - Visual feedback

Malla (Main Controller - 675 lines)
├── Properties:
│   ├── rawMalla: Object - Raw JSON data
│   ├── malla: Object - Processed course data by semester
│   ├── categories: Object - Course category colors
│   ├── ALLSUBJECTS: Object - All courses by sigla
│   ├── APPROVED: Array - Approved courses
│   ├── sct: boolean - Credit system flag
│   ├── totalCredits: number
│   ├── totalSubjects: number
│   └── semesterManager: SemesterManager
├── Core Methods:
│   ├── setCareer() - Load curriculum data
│   ├── setMallaAndCategories() - Process JSON
│   ├── drawMalla() - Render entire grid
│   ├── approveSubject() - Add to approved list
│   ├── verifyPrer() - Check all prerequisites
│   ├── updateStats() - Update credit counters
│   ├── saveApproved() - LocalStorage persistence
│   └── loadApproved() - Restore from LocalStorage
└── Utility Methods:
    ├── romanize() - Number to Roman numerals
    ├── deRomanize() - Roman to numbers
    └── generateCode() - Export to JSON

    └── CustomMalla (extends Malla - 121 lines)
        └── Loads user-generated mallas from localStorage

SemesterManager (Base - 194 lines)
├── Properties:
│   ├── selectedPerSemester: Object - Courses per semester
│   ├── semester: number - Current semester
│   └── displayedSubjects: Object - UI references
├── Methods:
│   ├── addSubject() - Add to current semester
│   ├── removeSubject() - Remove from current
│   ├── nextSemester() - Advance semester
│   ├── prevSemester() - Go back
│   ├── cleanSemester() - Clear current
│   └── saveSemesters() - Persist to localStorage
└──
    ├── Priorix (extends SemesterManager - 428 lines)
    │   ├── Properties:
    │   │   ├── subjectGrades: Object - Grades by semester
    │   │   ├── totalApprovedCredits: Object
    │   │   └── currentSemesterSum: Object
    │   └── Methods:
    │       ├── calculate() - ICA calculation
    │       ├── displaySubject() - Show with grade input
    │       └── updateFae() - FAE factor handling
    │
    └── Generator (extends SemesterManager - 180 lines)
        ├── Methods:
        │   ├── displaySubject() - Show with edit button
        │   ├── updateDisplayedSubject() - Refresh UI
        │   └── saveSemesters() - Export custom malla
        └── Uses:
            └── MallaEditor

MallaEditor (898 lines - Complex UI Manager)
├── Purpose: Create/Edit courses and categories
├── Properties:
│   ├── customManager: DOM element
│   ├── categoryManager: DOM element
│   ├── subjectList: Array
│   └── categoryList: Object
├── Modal Management:
│   ├── createSubjectModal
│   ├── createAdvancedSubjectModal
│   └── categoryModal
└── Methods:
    ├── createSubject() - Add new course
    ├── createAdvancedSubject() - Add with prerequisites
    ├── createCategory() - Add new category
    ├── editSubject() - Modify existing
    ├── deleteSubject() - Remove course
    ├── setUpModal() - Prepare modal state
    └── loadSubjects() - Populate from data
```

---

## 📦 Data Flow

### 1. Initialization Flow

```
┌─────────────┐
│  Browser    │
│  Loads HTML │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  init.js runs   │
│  - Setup paths  │
│  - Get params   │
│  - Load views   │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Fetch Resources   │
│  - carreras.json   │
│  - header.html     │
│  - footer.html     │
│  - welcomeTexts    │
└─────────┬──────────┘
          │
          ▼
┌─────────────────────┐
│  Create Malla()     │
│  - Set career       │
│  - Load JSON data   │
│  - Process courses  │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  Draw Visualization  │
│  - D3.js SVG render  │
│  - Create courses    │
│  - Add interactions  │
└───────────┬──────────┘
            │
            ▼
┌───────────────────────┐
│  Load User Progress   │
│  - From localStorage  │
│  - Approve courses    │
│  - Verify prereqs     │
└───────────────────────┘
```

### 2. User Interaction Flow

```
┌─────────────────┐
│  User clicks    │
│  on course      │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Ramo.isBeingClicked() │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Ramo.approveRamo()│
│  - Toggle state    │
│  - Update UI       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Malla.verifyPrer()│
│  - Check all courses│
│  - Show/hide overlay│
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Malla.updateStats()│
│  - Count credits   │
│  - Update %        │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Malla.saveApproved()│
│  - localStorage    │
└────────────────────┘
```

### 3. Data Structure

#### carreras.json
```json
[
  {
    "Nombre": "Ingeniería Civil en Informática",
    "Link": "ICInf"
  }
]
```

#### data_ICInf.json
```json
{
  "s1": [
    [
      "Course Name",        // [0] Full name
      "COURSE101",          // [1] Unique code (sigla)
      4,                    // [2] Credits USM
      6,                    // [3] Credits SCT
      "CATEGORY",           // [4] Category code
      ["PREREQ1"],          // [5] Array of prerequisite siglas
      "A"                   // [6] When offered: A=both, P=even, I=odd
    ]
  ],
  "s2": [ /* ... */ ]
}
```

#### colors_ICInf.json
```json
{
  "CATEGORY": [
    "#HEX_COLOR",          // [0] Color code
    "Category Name"        // [1] Display name
  ]
}
```

---

## 🎨 UI Components

### Main Grid (D3.js SVG)

```
┌───────────────────────────────────────────────────┐
│  Year 1                                           │
├───────────────────────────────────────────────────┤
│  Semester I    │  Semester II                     │
├────────────────┼──────────────────────────────────┤
│ ┌────────────┐ │ ┌────────────┐                  │
│ │ COURSE101  │ │ │ COURSE201  │                  │
│ │ Course Name│ │ │ Next Course│                  │
│ │    Credits │ │ │    Credits │                  │
│ └────────────┘ │ └────────────┘                  │
│                │                                   │
│ ┌────────────┐ │ ┌────────────┐                  │
│ │ COURSE102  │ │ │ COURSE202  │                  │
│ └────────────┘ │ └────────────┘                  │
└────────────────┴──────────────────────────────────┘

Course Box Anatomy:
┌──────────────────────────────┐
│ SIGLA        [Number]        │ ← Top bar (gray)
├──────────────────────────────┤
│                              │
│     Course Name              │ ← Main area (category color)
│   (wrapped text)             │
│                              │
├──────────────────────────────┤
│ ⚫⚫  Prerequisites    [Cred] │ ← Bottom bar (gray)
└──────────────────────────────┘

Interactions:
- Click → Mark as approved (adds X overlay)
- Prerequisites shown as colored circles
- Grays out if prerequisites not met
- Number indicates course order
```

### Side Panel (ICA/Generator)

```
┌─────────────────────────────┐
│  Semester: [1] [←] [→]      │
├─────────────────────────────┤
│  Selected Courses:          │
│                             │
│  ┌────────────────────────┐ │
│  │ Course 1     Grade: __ │ │
│  └────────────────────────┘ │
│                             │
│  ┌────────────────────────┐ │
│  │ Course 2     Grade: __ │ │
│  └────────────────────────┘ │
│                             │
│  [Add Custom Course]        │
├─────────────────────────────┤
│  Total Credits: 24          │
│  Current ICA: 6.5           │
│  [Reset] [Clear All]        │
└─────────────────────────────┘
```

---

## 🔧 Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
  - Custom properties for theming
  - Media queries for responsiveness
  - Dark mode via `prefers-color-scheme`
- **JavaScript (ES6+)** - Logic
  - Classes and modules
  - Arrow functions
  - Destructuring
  - Template literals

### Libraries
- **D3.js v5** - SVG visualization
  - Selections and data binding
  - Transitions and animations
  - Event handling
- **jQuery 3.4** - DOM manipulation (legacy)
  - Should be migrated to vanilla JS
- **Bootstrap 4.4** - UI components
  - Grid system
  - Modals
  - Forms
  - Should be updated to v5

### Build Tools
- **Terser** - JavaScript minification
- **CSSO** - CSS minification
- **Browser-sync** - Development server
- **Node.js** - Build scripts

### Storage
- **LocalStorage** - Persistence
  - Approved courses
  - Custom mallas
  - User preferences

### Deployment
- **GitHub Pages** - Hosting
- **Service Worker** - Offline support
- **Gzip** - Compression

---

## 🗂️ File Organization

### Current Structure (Problems Highlighted)

```
.
├── index.html                    ✅ Entry point
├── ica/
│   └── index.html                ✅ ICA calculator page
├── personalizar/
│   ├── index.html                ✅ Generator page
│   └── malla.html                ✅ Custom malla viewer
│
├── js/
│   ├── malla.js                  ✅ SOURCE (hand-written)
│   ├── ramo.js                   ✅ SOURCE
│   ├── selectableRamo.js         ✅ SOURCE
│   ├── customMalla.js            ✅ SOURCE
│   ├── semesterManager.js        ✅ SOURCE
│   ├── priorix.js                ✅ SOURCE
│   ├── generator.js              ✅ SOURCE
│   ├── mallaEditor.js            ✅ SOURCE
│   │
│   ├── init.js                   ❌ GENERATED (should be in .gitignore)
│   ├── min1.js                   ❌ GENERATED
│   ├── min2.js                   ❌ GENERATED
│   ├── min3.js                   ❌ GENERATED
│   ├── min4.js                   ❌ GENERATED
│   ├── init.js.gz                ❌ GENERATED
│   ├── min1.js.gz                ❌ GENERATED
│   ├── min3.js.gz                ❌ GENERATED
│   └── min4.js.gz                ❌ GENERATED
│
├── css/
│   ├── styles.css                ✅ Main styles
│   └── darkMode.css              ✅ Dark theme
│
├── data/
│   ├── carreras.json             ✅ Career list
│   ├── data_ICInf.json           ✅ Curriculum data
│   ├── colors_ICInf.json         ✅ Category colors
│   └── welcomeTexts.json         ✅ UI text
│
├── views/
│   ├── header.html               ✅ Reusable header
│   └── footer.html               ✅ Reusable footer
│
├── scripts/
│   ├── minify_code.sh            ⚠️ Bash (not cross-platform)
│   ├── minify_dev.sh             ⚠️ Bash
│   ├── minify_GBPages.sh         ⚠️ Bash
│   ├── decompress.js             ✅ Node.js (good!)
│   └── clean.sh                  ⚠️ Bash
│
├── package.json                  ✅ Dependencies
├── bs-config.js                  ✅ Browser-sync config
├── serviceWorker.js              ✅ PWA support
├── Dockerfile                    ✅ Container deployment
└── README.md                     ✅ Documentation
```

### Proposed Structure (After Refactoring)

```
.
├── src/                          🆕 All source code
│   ├── js/
│   │   ├── core/
│   │   │   ├── Malla.js
│   │   │   ├── Ramo.js
│   │   │   └── SelectableRamo.js
│   │   ├── managers/
│   │   │   ├── SemesterManager.js
│   │   │   ├── Priorix.js
│   │   │   └── Generator.js
│   │   ├── editors/
│   │   │   ├── MallaEditor.js
│   │   │   └── CustomMalla.js
│   │   └── init/
│   │       ├── main.js           🆕 No domain check
│   │       └── config.js         🆕 Configuration
│   ├── css/
│   │   ├── styles.css
│   │   └── darkMode.css
│   └── views/
│       ├── header.html
│       └── footer.html
│
├── public/                       🆕 Static assets
│   ├── index.html
│   ├── ica/
│   ├── personalizar/
│   └── data/
│
├── dist/                         🆕 Build output (gitignored)
│   ├── js/
│   │   ├── main.bundle.js
│   │   ├── ica.bundle.js
│   │   ├── generator.bundle.js
│   │   └── custom.bundle.js
│   ├── css/
│   │   ├── styles.min.css
│   │   └── darkMode.min.css
│   └── *.html
│
└── scripts/
    ├── build.js                  🆕 Node.js (cross-platform)
    └── dev-server.js             🆕 Development mode
```

---

## 🔄 Build Process

### Current Process (Problematic)

```bash
# Developer workflow:
1. Edit js/malla.js (source file)
2. Run: npm run build
3. Script minifies:
   - Creates js/min1.js (bundle)
   - Creates js/init.js (minified bundle)
   - Creates js/*.gz (compressed)
4. Git commits EVERYTHING (including generated files)
5. Deploy to GitHub Pages

Problems:
❌ Generated files in git history
❌ Can't see what changed in diffs
❌ Source and build mixed together
❌ Bash scripts don't work on Windows
```

### Proposed Process (Clean)

```bash
# Developer workflow:
1. Edit src/js/core/Malla.js (source file)
2. Run: npm run dev (auto-rebuilds on save)
3. Script builds:
   - Creates dist/js/main.bundle.js
   - All output goes to dist/
4. Git commits ONLY src/ files
5. Deploy: npm run build → deploy dist/ folder

Benefits:
✅ Clean git history
✅ Easy code reviews
✅ Clear separation
✅ Cross-platform
✅ Fast rebuilds
```

---

## 🎯 Key Algorithms

### 1. Prerequisite Checking

```javascript
// In Ramo.js - verifyPrer()
verifyPrer() {
    // Get all approved course codes
    let approvedCodes = new Set(
        this.malla.APPROVED.map(course => course.sigla)
    );
    
    // Check if ALL prerequisites are in approved set
    for (let prereq of this.prer) {
        if (!approvedCodes.has(prereq)) {
            // Not all prereqs met - gray out course
            this.ramo.select(".non-approved")
                .transition()
                .attr("opacity", "0.71");
            return;
        }
    }
    
    // All prereqs met - show course normally
    this.ramo.select(".non-approved")
        .transition()
        .attr("opacity", "0.0");
}
```

### 2. ICA Calculation

```javascript
// In Priorix.js - calculate()
calculate() {
    let totalWeightedScore = 0;
    let totalCredits = 0;
    
    // For each semester
    Object.keys(this.subjectGrades).forEach(semester => {
        Object.keys(this.subjectGrades[semester]).forEach(sigla => {
            let grade = this.subjectGrades[semester][sigla];
            let course = this.malla.getSubject(sigla);
            let credits = course.getDisplayCredits();
            
            // Weighted sum: grade × credits
            totalWeightedScore += grade * credits;
            totalCredits += credits;
        });
    });
    
    // ICA = weighted average
    let ica = totalWeightedScore / totalCredits;
    
    // Apply FAE factor
    let fae = this.faes[this.semester];
    let finalICA = ica * fae;
    
    return finalICA;
}
```

### 3. Text Wrapping in SVG

```javascript
// In Ramo.js - wrap()
wrap(sizeX, sizeY) {
    let text = this.ramo.select(".ramo-label");
    let words = text.text().split(/\s+/).reverse();
    let line = [];
    let lineHeight = 1.1;
    let tspan = text.text(null)
        .append("tspan")
        .attr("x", text.attr("x"));
    
    let word = words.pop();
    while (word) {
        line.push(word);
        tspan.text(line.join(" "));
        
        // If line too long, split it
        if (tspan.node().getComputedTextLength() > sizeX) {
            if (line.length === 1) {
                // Single word too long - reduce font size
                fontSize--;
                text.attr("font-size", fontSize);
            } else {
                // Multiple words - start new line
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", text.attr("x"))
                    .attr("dy", lineHeight + "em")
                    .text(word);
            }
        }
        word = words.pop();
    }
    
    // Center vertically
    let lineCount = text.selectAll('tspan').size();
    text.selectAll('tspan')
        .filter((d, i) => i === 0)
        .attr("dy", -(lineHeight * lineCount / 2 - lineHeight / 2) + "em");
}
```

### 4. Color Contrast Detection

```javascript
// In Ramo.js - needsWhiteText()
needsWhiteText(colorHex) {
    // Convert hex to RGB
    let r = parseInt(colorHex.substr(1, 2), 16);
    let g = parseInt(colorHex.substr(3, 2), 16);
    let b = parseInt(colorHex.substr(5, 2), 16);
    
    // Convert to linear RGB
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    for (let c of [r, g, b]) {
        if (c <= 0.03928) {
            c = c / 12.92;
        } else {
            c = Math.pow((c + 0.055) / 1.055, 2.4);
        }
    }
    
    // Calculate relative luminance
    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    // Dark colors need white text
    return luminance <= 0.6;
}
```

---

## 🔒 Security Considerations

### Current Issues

1. **No Input Validation**
   - User can create courses with any data
   - No sanitization of course names
   - Potential XSS via malicious course data

2. **LocalStorage Vulnerabilities**
   - Data not encrypted
   - Can be modified by user
   - No data integrity checks

3. **No CSRF Protection**
   - Not relevant (no backend)

### Recommendations

1. **Validate User Input**
   ```javascript
   function sanitizeCourseName(name) {
       return name
           .replace(/[<>]/g, '') // Remove HTML tags
           .trim()
           .substring(0, 100); // Max length
   }
   ```

2. **Validate JSON Structure**
   ```javascript
   function isValidCourse(course) {
       return Array.isArray(course) &&
              course.length === 7 &&
              typeof course[0] === 'string' &&
              typeof course[1] === 'string' &&
              typeof course[2] === 'number' &&
              // ... etc
   }
   ```

3. **Add Data Integrity**
   ```javascript
   function checksumMalla(malla) {
       return btoa(JSON.stringify(malla));
   }
   ```

---

## 📈 Performance Considerations

### Current Performance

**Strengths**:
- ✅ SVG renders efficiently with D3.js
- ✅ LocalStorage is fast
- ✅ Service Worker enables offline use

**Issues**:
- ❌ Loads entire malla upfront (no lazy loading)
- ❌ jQuery adds 80KB overhead
- ❌ Bootstrap adds 150KB+ overhead
- ❌ D3.js loaded from CDN (network dependency)

### Optimization Opportunities

1. **Bundle D3.js Locally**
   ```bash
   npm install d3
   # Include in bundle
   ```

2. **Remove jQuery**
   - Replace with vanilla JS
   - Save ~80KB

3. **Lazy Load Pages**
   - Split bundles by route
   - Load ICA calculator only when needed

4. **Code Splitting**
   ```javascript
   // Dynamic import
   if (isPrioridadPage) {
       import('./Priorix.js').then(module => {
           // Use Priorix
       });
   }
   ```

5. **Image Optimization**
   - Use WebP format
   - Compress PNGs
   - Lazy load images

---

## 🧪 Testing Strategy

### Current State
- ❌ No tests
- ❌ Manual testing only
- ❌ No CI/CD

### Recommended Testing

1. **Unit Tests** (Jest)
   ```javascript
   describe('Ramo', () => {
       test('calculates credits correctly', () => {
           let ramo = new Ramo('Test', 'TEST101', 4, 'CORE');
           expect(ramo.getCredits()).toBe(4);
       });
   });
   ```

2. **Integration Tests**
   ```javascript
   describe('Malla', () => {
       test('loads career data', async () => {
           let malla = new Malla();
           await malla.setCareer('ICInf');
           expect(malla.totalSubjects).toBeGreaterThan(0);
       });
   });
   ```

3. **E2E Tests** (Playwright/Cypress)
   ```javascript
   test('user can approve courses', async () => {
       await page.goto('/');
       await page.click('#MAT101');
       expect(await page.locator('.cross').count()).toBe(1);
   });
   ```

---

## 📚 Further Reading

- [D3.js Documentation](https://d3js.org/)
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [esbuild](https://esbuild.github.io/) - Fast bundler

---

**Last Updated**: December 2024  
**Maintained By**: UAI Engineering Team
