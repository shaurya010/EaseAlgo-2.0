# EaseAlgo — File Structure

```
easealgo/
├── index.html          ← Main HTML: all page layouts + nav + footer
├── css/
│   └── styles.css      ← ALL visual styles (colors, layout, cards, quiz UI)
└── js/
    ├── data.js         ← Question data: PYQ bank + practice QB
    ├── state.js        ← Global state vars + SPA router (goto function)
    ├── gate.js         ← GATE page logic (year/subject/topic tabs)
    ├── pyq.js          ← Standalone PYQ sidebar + filter logic
    └── quiz.js         ← Quiz engine (MCQ, scoring, result overlay)
```

## What to edit for common tasks

| Task | File |
|------|------|
| Change colors / theme | `css/styles.css` → `:root` variables |
| Add/edit nav links | `index.html` → `<nav>` section |
| Edit home page text/cards | `index.html` → `page-home` section |
| Add GATE PYQ questions | `js/data.js` → `PYQ` array |
| Add practice questions | `js/data.js` → `QB` object |
| Edit PSU org cards | `index.html` → `page-psu` section |
| Edit DSA roadmap phases | `index.html` → `page-dsa` section |
| Change quiz scoring | `js/quiz.js` → `submitQ()` function |
| Change GATE subjects list | `js/gate.js` → `GATE_SUBJS` array |

## Adding a new PYQ question

Open `js/data.js` and add to the `PYQ` array:

```js
{
  q:   "Your question text here",
  opts:["Option A", "Option B", "Option C", "Option D"],
  ans: 1,           // index of correct option (0-3)
  d:   'medium',    // 'easy' | 'medium' | 'hard'
  m:   2,           // marks: 1 or 2
  e:   "Explanation text shown after answering",
  y:   2024,        // GATE year
  sub: 'Algorithms',      // subject name
  top: 'Dynamic Programming', // topic name
  st:  'cs'         // stream: 'cs'|'ece'|'me'|'ce'|'ga'
},
```

## Adding a new practice subject

Open `js/data.js` and add to the `QB` object:

```js
newsubject: [
  {q:"Question text", opts:["A","B","C","D"], ans:0, d:'easy', m:1, e:"Explanation"},
  // ... more questions
],
```

Then add it to `GATE_SUBJS` in `js/gate.js`:
```js
{id:'newsubject', name:'My New Subject', emoji:'📖', color:'#6366f1', stream:'CS/IT', cnt:10},
```

## Running locally

Open `index.html` directly in a browser — no server needed.
Note: JS modules require a local server. Run with:
```
python -m http.server 8080
```
Then open http://localhost:8080
