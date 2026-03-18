// =============================================
// EaseAlgo — js/dsa.js
// =============================================
// DSA Problem List — 150+ real LeetCode problems
// with company tags, difficulty, topic, and links.
//
// initDSAPage() — called by goto('dsa')
// filterDSA(company, el) — filter by company pill
// renderDSAProblems(problems) — render problem table
// =============================================

const DSA_PROBLEMS = [
  // ── ARRAYS & STRINGS ──
  { id:1,   title:"Two Sum",                             diff:"Easy",   topic:"Arrays",          companies:["Google","Amazon","Microsoft","Meta","Adobe","Flipkart"], lc:"https://leetcode.com/problems/two-sum/" },
  { id:121, title:"Best Time to Buy and Sell Stock",     diff:"Easy",   topic:"Arrays",          companies:["Amazon","Google","Microsoft","Meta","Flipkart"],         lc:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id:53,  title:"Maximum Subarray (Kadane's)",         diff:"Medium", topic:"Arrays",          companies:["Amazon","Microsoft","Google","Adobe","Atlassian"],        lc:"https://leetcode.com/problems/maximum-subarray/" },
  { id:238, title:"Product of Array Except Self",        diff:"Medium", topic:"Arrays",          companies:["Amazon","Microsoft","Google","Meta","Atlassian"],         lc:"https://leetcode.com/problems/product-of-array-except-self/" },
  { id:11,  title:"Container With Most Water",           diff:"Medium", topic:"Two Pointers",    companies:["Google","Amazon","Microsoft","Adobe"],                    lc:"https://leetcode.com/problems/container-with-most-water/" },
  { id:15,  title:"3Sum",                                diff:"Medium", topic:"Two Pointers",    companies:["Google","Amazon","Microsoft","Meta","Adobe","Flipkart"],  lc:"https://leetcode.com/problems/3sum/" },
  { id:42,  title:"Trapping Rain Water",                 diff:"Hard",   topic:"Two Pointers",    companies:["Google","Amazon","Microsoft","Meta","Atlassian"],         lc:"https://leetcode.com/problems/trapping-rain-water/" },
  { id:56,  title:"Merge Intervals",                     diff:"Medium", topic:"Arrays",          companies:["Google","Amazon","Microsoft","Meta","LinkedIn","Oracle"], lc:"https://leetcode.com/problems/merge-intervals/" },
  { id:48,  title:"Rotate Image",                        diff:"Medium", topic:"Arrays",          companies:["Amazon","Microsoft","Google","Adobe"],                    lc:"https://leetcode.com/problems/rotate-image/" },
  { id:73,  title:"Set Matrix Zeroes",                   diff:"Medium", topic:"Arrays",          companies:["Amazon","Microsoft","Google","Flipkart"],                 lc:"https://leetcode.com/problems/set-matrix-zeroes/" },
  { id:54,  title:"Spiral Matrix",                       diff:"Medium", topic:"Arrays",          companies:["Amazon","Microsoft","Google","Adobe","Oracle"],           lc:"https://leetcode.com/problems/spiral-matrix/" },
  { id:128, title:"Longest Consecutive Sequence",        diff:"Medium", topic:"Hashing",         companies:["Amazon","Google","Microsoft","Meta","Atlassian"],         lc:"https://leetcode.com/problems/longest-consecutive-sequence/" },
  { id:3,   title:"Longest Substring Without Repeating",diff:"Medium", topic:"Sliding Window",  companies:["Google","Amazon","Microsoft","Meta","Adobe","Atlassian"],  lc:"https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id:76,  title:"Minimum Window Substring",            diff:"Hard",   topic:"Sliding Window",  companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/minimum-window-substring/" },
  { id:567, title:"Permutation in String",               diff:"Medium", topic:"Sliding Window",  companies:["Amazon","Microsoft","Google","Oracle"],                   lc:"https://leetcode.com/problems/permutation-in-string/" },
  { id:217, title:"Contains Duplicate",                  diff:"Easy",   topic:"Hashing",         companies:["Google","Amazon","Flipkart","Adobe"],                     lc:"https://leetcode.com/problems/contains-duplicate/" },
  { id:242, title:"Valid Anagram",                       diff:"Easy",   topic:"Hashing",         companies:["Amazon","Google","Microsoft","Adobe","Flipkart"],         lc:"https://leetcode.com/problems/valid-anagram/" },
  { id:49,  title:"Group Anagrams",                      diff:"Medium", topic:"Hashing",         companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/group-anagrams/" },
  { id:271, title:"Encode and Decode Strings",           diff:"Medium", topic:"Strings",         companies:["Google","Amazon","Microsoft"],                            lc:"https://leetcode.com/problems/encode-and-decode-strings/" },
  { id:125, title:"Valid Palindrome",                    diff:"Easy",   topic:"Strings",         companies:["Amazon","Microsoft","Google","Meta","Adobe","Flipkart"],  lc:"https://leetcode.com/problems/valid-palindrome/" },

  // ── BINARY SEARCH ──
  { id:704, title:"Binary Search",                       diff:"Easy",   topic:"Binary Search",   companies:["Google","Amazon","Microsoft","Adobe","Flipkart"],         lc:"https://leetcode.com/problems/binary-search/" },
  { id:33,  title:"Search in Rotated Sorted Array",      diff:"Medium", topic:"Binary Search",   companies:["Google","Amazon","Microsoft","Meta","Adobe","Oracle"],    lc:"https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id:153, title:"Find Minimum in Rotated Sorted Array",diff:"Medium", topic:"Binary Search",   companies:["Amazon","Microsoft","Google","Flipkart"],                 lc:"https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id:74,  title:"Search a 2D Matrix",                  diff:"Medium", topic:"Binary Search",   companies:["Amazon","Microsoft","Google","Adobe"],                    lc:"https://leetcode.com/problems/search-a-2d-matrix/" },
  { id:4,   title:"Median of Two Sorted Arrays",         diff:"Hard",   topic:"Binary Search",   companies:["Google","Amazon","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { id:875, title:"Koko Eating Bananas",                 diff:"Medium", topic:"Binary Search",   companies:["Google","Amazon"],                                        lc:"https://leetcode.com/problems/koko-eating-bananas/" },
  { id:981, title:"Time Based Key-Value Store",          diff:"Medium", topic:"Binary Search",   companies:["Google","Amazon","Oracle"],                               lc:"https://leetcode.com/problems/time-based-key-value-store/" },

  // ── STACK & QUEUE ──
  { id:20,  title:"Valid Parentheses",                   diff:"Easy",   topic:"Stack",           companies:["Google","Amazon","Microsoft","Meta","Adobe","Atlassian","Flipkart"], lc:"https://leetcode.com/problems/valid-parentheses/" },
  { id:155, title:"Min Stack",                           diff:"Medium", topic:"Stack",           companies:["Amazon","Google","Microsoft","Flipkart","Oracle"],        lc:"https://leetcode.com/problems/min-stack/" },
  { id:739, title:"Daily Temperatures",                  diff:"Medium", topic:"Stack",           companies:["Amazon","Google","Microsoft","Flipkart"],                 lc:"https://leetcode.com/problems/daily-temperatures/" },
  { id:853, title:"Car Fleet",                           diff:"Medium", topic:"Stack",           companies:["Google","Amazon"],                                        lc:"https://leetcode.com/problems/car-fleet/" },
  { id:84,  title:"Largest Rectangle in Histogram",     diff:"Hard",   topic:"Stack",           companies:["Amazon","Google","Microsoft","Atlassian"],                lc:"https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id:150, title:"Evaluate Reverse Polish Notation",   diff:"Medium", topic:"Stack",           companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id:146, title:"LRU Cache",                           diff:"Medium", topic:"Queue",           companies:["Amazon","Google","Microsoft","Meta","Flipkart","Oracle"], lc:"https://leetcode.com/problems/lru-cache/" },

  // ── LINKED LIST ──
  { id:206, title:"Reverse Linked List",                 diff:"Easy",   topic:"Linked List",     companies:["Amazon","Google","Microsoft","Meta","Adobe","Flipkart"],  lc:"https://leetcode.com/problems/reverse-linked-list/" },
  { id:21,  title:"Merge Two Sorted Lists",              diff:"Easy",   topic:"Linked List",     companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id:141, title:"Linked List Cycle",                   diff:"Easy",   topic:"Linked List",     companies:["Amazon","Google","Microsoft","Meta","Flipkart"],           lc:"https://leetcode.com/problems/linked-list-cycle/" },
  { id:143, title:"Reorder List",                        diff:"Medium", topic:"Linked List",     companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/reorder-list/" },
  { id:19,  title:"Remove Nth Node From End of List",   diff:"Medium", topic:"Linked List",     companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id:23,  title:"Merge K Sorted Lists",                diff:"Hard",   topic:"Linked List",     companies:["Amazon","Google","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id:25,  title:"Reverse Nodes in K-Group",            diff:"Hard",   topic:"Linked List",     companies:["Amazon","Google","Microsoft","Flipkart"],                 lc:"https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { id:287, title:"Find the Duplicate Number",           diff:"Medium", topic:"Linked List",     companies:["Amazon","Google","Oracle","Atlassian"],                   lc:"https://leetcode.com/problems/find-the-duplicate-number/" },

  // ── TREES ──
  { id:104, title:"Maximum Depth of Binary Tree",        diff:"Easy",   topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta","Adobe","Flipkart"],  lc:"https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id:226, title:"Invert Binary Tree",                  diff:"Easy",   topic:"Trees",           companies:["Google","Amazon","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/invert-binary-tree/" },
  { id:543, title:"Diameter of Binary Tree",             diff:"Easy",   topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/diameter-of-binary-tree/" },
  { id:110, title:"Balanced Binary Tree",                diff:"Easy",   topic:"Trees",           companies:["Google","Amazon","Microsoft","Adobe","Flipkart"],         lc:"https://leetcode.com/problems/balanced-binary-tree/" },
  { id:100, title:"Same Tree",                           diff:"Easy",   topic:"Trees",           companies:["Amazon","Google","Microsoft","Oracle"],                   lc:"https://leetcode.com/problems/same-tree/" },
  { id:572, title:"Subtree of Another Tree",             diff:"Easy",   topic:"Trees",           companies:["Amazon","Microsoft","Google","Adobe"],                    lc:"https://leetcode.com/problems/subtree-of-another-tree/" },
  { id:102, title:"Binary Tree Level Order Traversal",   diff:"Medium", topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta","Adobe","Oracle"],    lc:"https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id:199, title:"Binary Tree Right Side View",         diff:"Medium", topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta","Flipkart"],           lc:"https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id:1448,title:"Count Good Nodes in Binary Tree",     diff:"Medium", topic:"Trees",           companies:["Google","Amazon"],                                        lc:"https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
  { id:98,  title:"Validate Binary Search Tree",         diff:"Medium", topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/validate-binary-search-tree/" },
  { id:230, title:"Kth Smallest Element in BST",         diff:"Medium", topic:"Trees",           companies:["Amazon","Google","Microsoft","Oracle"],                   lc:"https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id:105, title:"Construct BT from Preorder+Inorder",  diff:"Medium", topic:"Trees",           companies:["Amazon","Microsoft","Google"],                            lc:"https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id:124, title:"Binary Tree Maximum Path Sum",        diff:"Hard",   topic:"Trees",           companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id:297, title:"Serialize and Deserialize Binary Tree",diff:"Hard",  topic:"Trees",           companies:["Google","Amazon","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // ── HEAP / PRIORITY QUEUE ──
  { id:703, title:"Kth Largest Element in a Stream",    diff:"Easy",   topic:"Heap",            companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id:1046,title:"Last Stone Weight",                   diff:"Easy",   topic:"Heap",            companies:["Amazon","Google","Oracle"],                               lc:"https://leetcode.com/problems/last-stone-weight/" },
  { id:973, title:"K Closest Points to Origin",          diff:"Medium", topic:"Heap",            companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id:215, title:"Kth Largest Element in an Array",     diff:"Medium", topic:"Heap",            companies:["Amazon","Google","Microsoft","Meta","Flipkart","Oracle"], lc:"https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id:621, title:"Task Scheduler",                      diff:"Medium", topic:"Heap",            companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/task-scheduler/" },
  { id:355, title:"Design Twitter",                      diff:"Medium", topic:"Heap",            companies:["Amazon","Google","Oracle"],                               lc:"https://leetcode.com/problems/design-twitter/" },
  { id:295, title:"Find Median from Data Stream",        diff:"Hard",   topic:"Heap",            companies:["Amazon","Google","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/find-median-from-data-stream/" },

  // ── GRAPHS ──
  { id:200, title:"Number of Islands",                   diff:"Medium", topic:"Graphs",          companies:["Amazon","Google","Microsoft","Meta","Atlassian","Oracle"], lc:"https://leetcode.com/problems/number-of-islands/" },
  { id:133, title:"Clone Graph",                         diff:"Medium", topic:"Graphs",          companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/clone-graph/" },
  { id:695, title:"Max Area of Island",                  diff:"Medium", topic:"Graphs",          companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/max-area-of-island/" },
  { id:417, title:"Pacific Atlantic Water Flow",         diff:"Medium", topic:"Graphs",          companies:["Google","Amazon","Oracle"],                               lc:"https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id:130, title:"Surrounded Regions",                  diff:"Medium", topic:"Graphs",          companies:["Google","Amazon","Microsoft"],                            lc:"https://leetcode.com/problems/surrounded-regions/" },
  { id:207, title:"Course Schedule",                     diff:"Medium", topic:"Graphs",          companies:["Amazon","Google","Microsoft","Meta","Atlassian"],         lc:"https://leetcode.com/problems/course-schedule/" },
  { id:210, title:"Course Schedule II",                  diff:"Medium", topic:"Graphs",          companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/course-schedule-ii/" },
  { id:261, title:"Graph Valid Tree",                    diff:"Medium", topic:"Graphs",          companies:["Google","Amazon","Microsoft"],                            lc:"https://leetcode.com/problems/graph-valid-tree/" },
  { id:323, title:"Number of Connected Components",      diff:"Medium", topic:"Graphs",          companies:["Google","Amazon","Microsoft","Oracle"],                   lc:"https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { id:684, title:"Redundant Connection",                diff:"Medium", topic:"Graphs",          companies:["Google","Amazon","Microsoft"],                            lc:"https://leetcode.com/problems/redundant-connection/" },
  { id:127, title:"Word Ladder",                         diff:"Hard",   topic:"Graphs",          companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/word-ladder/" },

  // ── DYNAMIC PROGRAMMING ──
  { id:70,  title:"Climbing Stairs",                     diff:"Easy",   topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Adobe","Flipkart"],  lc:"https://leetcode.com/problems/climbing-stairs/" },
  { id:746, title:"Min Cost Climbing Stairs",            diff:"Easy",   topic:"Dynamic Programming", companies:["Amazon","Google","Adobe"],                         lc:"https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id:198, title:"House Robber",                        diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Flipkart","Adobe"],  lc:"https://leetcode.com/problems/house-robber/" },
  { id:213, title:"House Robber II",                     diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft"],                     lc:"https://leetcode.com/problems/house-robber-ii/" },
  { id:5,   title:"Longest Palindromic Substring",       diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta","Adobe"],       lc:"https://leetcode.com/problems/longest-palindromic-substring/" },
  { id:647, title:"Palindromic Substrings",              diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft"],                     lc:"https://leetcode.com/problems/palindromic-substrings/" },
  { id:91,  title:"Decode Ways",                         diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Flipkart"],           lc:"https://leetcode.com/problems/decode-ways/" },
  { id:322, title:"Coin Change",                         diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta","Flipkart"],   lc:"https://leetcode.com/problems/coin-change/" },
  { id:152, title:"Maximum Product Subarray",            diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Adobe"],              lc:"https://leetcode.com/problems/maximum-product-subarray/" },
  { id:139, title:"Word Break",                          diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta","Oracle"],      lc:"https://leetcode.com/problems/word-break/" },
  { id:300, title:"Longest Increasing Subsequence",      diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta"],               lc:"https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id:416, title:"Partition Equal Subset Sum",          diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Oracle"],             lc:"https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id:62,  title:"Unique Paths",                        diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta","Oracle"],      lc:"https://leetcode.com/problems/unique-paths/" },
  { id:1143,title:"Longest Common Subsequence",          diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta"],               lc:"https://leetcode.com/problems/longest-common-subsequence/" },
  { id:72,  title:"Edit Distance",                       diff:"Medium", topic:"Dynamic Programming", companies:["Amazon","Google","Microsoft","Meta"],               lc:"https://leetcode.com/problems/edit-distance/" },
  { id:312, title:"Burst Balloons",                      diff:"Hard",   topic:"Dynamic Programming", companies:["Google","Amazon","Microsoft"],                      lc:"https://leetcode.com/problems/burst-balloons/" },

  // ── RECURSION & BACKTRACKING ──
  { id:39,  title:"Combination Sum",                     diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/combination-sum/" },
  { id:40,  title:"Combination Sum II",                  diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/combination-sum-ii/" },
  { id:46,  title:"Permutations",                        diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft","Meta","Flipkart"],           lc:"https://leetcode.com/problems/permutations/" },
  { id:78,  title:"Subsets",                             diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/subsets/" },
  { id:79,  title:"Word Search",                         diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft","Meta","Adobe"],              lc:"https://leetcode.com/problems/word-search/" },
  { id:131, title:"Palindrome Partitioning",             diff:"Medium", topic:"Backtracking",    companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/palindrome-partitioning/" },
  { id:51,  title:"N-Queens",                            diff:"Hard",   topic:"Backtracking",    companies:["Amazon","Google","Microsoft","Atlassian"],                lc:"https://leetcode.com/problems/n-queens/" },

  // ── TRIE ──
  { id:208, title:"Implement Trie (Prefix Tree)",        diff:"Medium", topic:"Trie",            companies:["Amazon","Google","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id:211, title:"Design Add and Search Words",         diff:"Medium", topic:"Trie",            companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id:212, title:"Word Search II",                      diff:"Hard",   topic:"Trie",            companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/word-search-ii/" },

  // ── GREEDY ──
  { id:55,  title:"Jump Game",                           diff:"Medium", topic:"Greedy",          companies:["Amazon","Google","Microsoft","Meta","Flipkart"],           lc:"https://leetcode.com/problems/jump-game/" },
  { id:45,  title:"Jump Game II",                        diff:"Medium", topic:"Greedy",          companies:["Amazon","Google","Microsoft","Meta"],                     lc:"https://leetcode.com/problems/jump-game-ii/" },
  { id:134, title:"Gas Station",                         diff:"Medium", topic:"Greedy",          companies:["Amazon","Google","Oracle"],                               lc:"https://leetcode.com/problems/gas-station/" },
  { id:763, title:"Partition Labels",                    diff:"Medium", topic:"Greedy",          companies:["Google","Amazon","Atlassian"],                            lc:"https://leetcode.com/problems/partition-labels/" },

  // ── INTERVALS ──
  { id:57,  title:"Insert Interval",                     diff:"Medium", topic:"Intervals",       companies:["Google","Amazon","Microsoft","Meta","Oracle"],            lc:"https://leetcode.com/problems/insert-interval/" },
  { id:435, title:"Non-overlapping Intervals",           diff:"Medium", topic:"Intervals",       companies:["Google","Amazon","Microsoft"],                            lc:"https://leetcode.com/problems/non-overlapping-intervals/" },
  { id:252, title:"Meeting Rooms",                       diff:"Easy",   topic:"Intervals",       companies:["Google","Amazon","Microsoft","Meta","Oracle","Flipkart"], lc:"https://leetcode.com/problems/meeting-rooms/" },
  { id:253, title:"Meeting Rooms II",                    diff:"Medium", topic:"Intervals",       companies:["Google","Amazon","Microsoft","Oracle","Flipkart"],        lc:"https://leetcode.com/problems/meeting-rooms-ii/" },

  // ── MATH & BIT MANIPULATION ──
  { id:268, title:"Missing Number",                      diff:"Easy",   topic:"Bit Manipulation",companies:["Amazon","Google","Microsoft","Adobe"],                    lc:"https://leetcode.com/problems/missing-number/" },
  { id:191, title:"Number of 1 Bits",                    diff:"Easy",   topic:"Bit Manipulation",companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/number-of-1-bits/" },
  { id:190, title:"Reverse Bits",                        diff:"Easy",   topic:"Bit Manipulation",companies:["Amazon","Google","Oracle"],                               lc:"https://leetcode.com/problems/reverse-bits/" },
  { id:338, title:"Counting Bits",                       diff:"Easy",   topic:"Bit Manipulation",companies:["Amazon","Google","Microsoft","Oracle"],                   lc:"https://leetcode.com/problems/counting-bits/" },
  { id:371, title:"Sum of Two Integers",                 diff:"Medium", topic:"Bit Manipulation",companies:["Amazon","Google","Microsoft"],                            lc:"https://leetcode.com/problems/sum-of-two-integers/" },
];

// ── Topic grouping for display ──
const TOPIC_ORDER = [
  "Arrays","Strings","Two Pointers","Sliding Window","Hashing",
  "Binary Search","Stack","Queue","Linked List","Trees",
  "Heap","Graphs","Dynamic Programming","Backtracking","Greedy",
  "Intervals","Trie","Bit Manipulation"
];

let activeDSACompany = 'all';

function initDSAPage() {
  activeDSACompany = 'all';
  document.querySelectorAll('[id^="dco-"]').forEach(b => b.classList.remove('on'));
  const allBtn = document.getElementById('dco-all');
  if (allBtn) allBtn.classList.add('on');
  renderDSAProblems(DSA_PROBLEMS);
}

function filterDSA(company, el) {
  activeDSACompany = company;
  document.querySelectorAll('[id^="dco-"]').forEach(b => b.classList.remove('on'));
  if (el) el.classList.add('on');
  const filtered = company === 'all'
    ? DSA_PROBLEMS
    : DSA_PROBLEMS.filter(p => p.companies.includes(company));
  renderDSAProblems(filtered);

  // Update breadcrumb
  const bc = document.getElementById('dsa-breadcrumb');
  if (bc) bc.textContent = company === 'all' ? 'DSA' : `DSA / ${company}`;
}

function renderDSAProblems(problems) {
  const el = document.getElementById('dsa-problem-list');
  const countEl = document.getElementById('dsa-count');
  if (!el) return;
  if (countEl) countEl.textContent = problems.length + ' problem' + (problems.length !== 1 ? 's' : '');

  if (problems.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text3);font-size:0.96rem;">No problems found for this company.</div>`;
    return;
  }

  // Group by topic
  const grouped = {};
  TOPIC_ORDER.forEach(t => grouped[t] = []);
  problems.forEach(p => {
    if (!grouped[p.topic]) grouped[p.topic] = [];
    grouped[p.topic].push(p);
  });

  const diffColor = { Easy:'#10b981', Medium:'#f59e0b', Hard:'#ef4444' };
  const diffBg    = { Easy:'rgba(16,185,129,0.1)', Medium:'rgba(245,158,11,0.1)', Hard:'rgba(239,68,68,0.1)' };

  el.innerHTML = TOPIC_ORDER
    .filter(t => grouped[t] && grouped[t].length > 0)
    .map(topic => {
      const probs = grouped[topic];
      return `
      <div style="margin-bottom:1.75rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
          <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:1rem;letter-spacing:-0.2px;">${topic}</div>
          <span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);color:var(--green);padding:2px 9px;border-radius:5px;">${probs.length} problems</span>
        </div>
        <div style="background:var(--card);border:1.5px solid var(--border);border-radius:13px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:40px 1fr auto auto;align-items:center;
            padding:0.5rem 1.1rem;background:var(--bg2);border-bottom:1px solid var(--border);
            font-family:'JetBrains Mono',monospace;font-size:0.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:1px;gap:1rem;">
            <span>#</span><span>Problem</span><span style="text-align:center;">Difficulty</span><span>Companies</span>
          </div>
          ${probs.map((p, i) => `
          <div onclick="window.open('${p.lc}','_blank')"
            style="display:grid;grid-template-columns:40px 1fr auto auto;align-items:center;gap:1rem;
            padding:0.75rem 1.1rem;cursor:pointer;transition:background 0.15s;
            ${i < probs.length-1 ? 'border-bottom:1px solid var(--border);' : ''}"
            onmouseover="this.style.background='var(--card2)'"
            onmouseout="this.style.background='transparent'">
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--text3);">${p.id}</span>
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span style="font-family:'Inter',sans-serif;font-size:0.92rem;font-weight:500;color:var(--text);">${p.title}</span>
              <span style="font-size:0.65rem;color:var(--cyan);opacity:0.7;">↗</span>
            </div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;padding:3px 10px;border-radius:6px;
              background:${diffBg[p.diff]};color:${diffColor[p.diff]};white-space:nowrap;text-align:center;">
              ${p.diff}
            </span>
            <div style="display:flex;gap:3px;flex-wrap:wrap;justify-content:flex-end;max-width:180px;">
              ${p.companies.slice(0,4).map(c => `
                <span style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;padding:1px 6px;
                  border-radius:4px;background:var(--bg3);border:1px solid var(--border);color:var(--text3);white-space:nowrap;">
                  ${c}
                </span>`).join('')}
              ${p.companies.length > 4 ? `<span style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:var(--text3);">+${p.companies.length-4}</span>` : ''}
            </div>
          </div>`).join('')}
        </div>
      </div>`;
    }).join('');
}
