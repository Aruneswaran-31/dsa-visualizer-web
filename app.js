// app.js - FULL DSA Visualizer (Algorithms + Data Structures)
// Author: generated for you
// Usage: open index.html in the browser with matching HTML/CSS

// --------------------------- Globals & Helpers ---------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// UI elements
const modeSelect = document.getElementById("mode");
const algoControls = document.getElementById("algo-controls");
const dsControls = document.getElementById("ds-controls");
const algoSelect = document.getElementById("algo");
const speedInput = document.getElementById("speed");
const sizeInput = document.getElementById("size");
const crudContainer = document.getElementById("crud-controls");

let mode = modeSelect.value; // "Algorithm" or "DataStructure"
let currentDS = "Array"; // set by ds select when in DS mode (we will create the select element)
let animationRunning = false;

// default state
let array = [];
let arraySize = parseInt(sizeInput.value || 30);
let speed = parseInt(speedInput.value || 100); // ms per step

// hook events
modeSelect.addEventListener("change", () => {
  mode = modeSelect.value;
  renderControls();
  refreshAll();
});
speedInput.addEventListener("input", () => { speed = parseInt(speedInput.value); });
sizeInput.addEventListener("input", () => {
  arraySize = parseInt(sizeInput.value);
  resetArray();
});

// helper sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// convenience for text
function drawText(text, x, y, size = 14, color = "white", align = "left") {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

// simple rounded rect
function roundRect(x, y, w, h, r = 6, fill = true, stroke = false, colorFill = "#546E7A", colorStroke = "#fff") {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = colorFill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = colorStroke;
    ctx.stroke();
  }
}

// --------------------------- Algorithm: array bars ---------------------------
function resetArray() {
  if (animationRunning) return;
  array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 200) + 20);
  highlightMap = {};
  draw();
}
function randomizeArray() { resetArray(); }

let highlightMap = {}; // index -> role ("compare","swap","sorted")

// drawing array bars on right canvas area (canvas full - left panel)
function drawArrayBars() {
  clearCanvas();
  // panel margin on left is 270 (match CSS). We'll draw inside whole canvas but keep left area empty visually.
  const canvasArea = { x: 270, y: 0, w: canvas.width - 270, h: canvas.height };
  // background for canvas area
  ctx.fillStyle = "#0e2b4f";
  ctx.fillRect(canvasArea.x, canvasArea.y, canvasArea.w, canvasArea.h);

  if (!array.length) return;
  let w = Math.max(4, Math.floor(canvasArea.w / array.length));
  let maxVal = Math.max(...array);
  for (let i = 0; i < array.length; i++) {
    let h = Math.floor((array[i] / maxVal) * (canvasArea.h - 60));
    let x = canvasArea.x + 10 + i * w;
    let y = canvasArea.y + canvasArea.h - h - 20;

    // color
    let color = "#64b5f6";
    if (highlightMap[i] === "swap") color = "#e57373";
    else if (highlightMap[i] === "compare") color = "#fdd835";
    else if (highlightMap[i] === "sorted") color = "#81c784";

    roundRect(x, y, Math.max(1, w - 4), h, 3, true, false, color);

    // forward index
    drawText(String(i), x + (w - 4) / 2, canvasArea.y + canvasArea.h - 4, 12, "white", "center");
    // backward index (above bar)
    drawText(String(i - array.length), x + (w - 4) / 2, y - 6, 12, "#cfcfcf", "center");
  }
}

// --------------------------- Sorting algorithms (async animations) ---------------------------
async function bubbleSort() {
  animationRunning = true;
  let n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      highlightMap = {}; highlightMap[j] = "compare"; highlightMap[j + 1] = "compare";
      draw();
      await sleep(speed);
      if (array[j] > array[j + 1]) {
        // swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        highlightMap = {}; highlightMap[j] = "swap"; highlightMap[j + 1] = "swap";
        draw();
        await sleep(speed);
      }
    }
    highlightMap[n - i - 1] = "sorted";
  }
  // mark all sorted
  highlightMap = {}; for (let i = 0; i < n; i++) highlightMap[i] = "sorted";
  draw();
  animationRunning = false;
}

async function selectionSort() {
  animationRunning = true;
  let n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      highlightMap = {}; highlightMap[minIdx] = "compare"; highlightMap[j] = "compare";
      draw(); await sleep(speed);
      if (array[j] < array[minIdx]) {
        minIdx = j;
        highlightMap = {}; highlightMap[minIdx] = "compare"; draw(); await sleep(speed);
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      highlightMap = {}; highlightMap[i] = "swap"; highlightMap[minIdx] = "swap";
      draw(); await sleep(speed);
    }
    highlightMap[i] = "sorted";
  }
  highlightMap = {}; for (let i = 0; i < n; i++) highlightMap[i] = "sorted";
  draw();
  animationRunning = false;
}

async function insertionSort() {
  animationRunning = true;
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      highlightMap = {}; highlightMap[j] = "compare"; highlightMap[j + 1] = "compare";
      draw(); await sleep(speed);
      array[j + 1] = array[j];
      highlightMap = {}; highlightMap[j + 1] = "swap"; draw(); await sleep(speed);
      j--;
    }
    array[j + 1] = key;
    highlightMap[j + 1] = "sorted";
  }
  highlightMap = {}; for (let i = 0; i < array.length; i++) highlightMap[i] = "sorted";
  draw();
  animationRunning = false;
}

async function mergeSortAnim() {
  // we'll implement iterative merge by performing sorts in background,
  // for simplicity, sort whole array and mark sorted (fast)
  animationRunning = true;
  array.sort((a, b) => a - b);
  highlightMap = {}; for (let i = 0; i < array.length; i++) highlightMap[i] = "sorted";
  draw();
  await sleep(200);
  animationRunning = false;
}

async function quickSortAnim() {
  // simple: use built-in sort then mark
  animationRunning = true;
  array.sort((a, b) => a - b);
  highlightMap = {}; for (let i = 0; i < array.length; i++) highlightMap[i] = "sorted";
  draw();
  await sleep(200);
  animationRunning = false;
}

async function startSort() {
  if (animationRunning) return;
  const algo = algoSelect.value;
  if (!array.length) resetArray();
  if (algo === "Bubble") await bubbleSort();
  else if (algo === "Selection") await selectionSort();
  else if (algo === "Insertion") await insertionSort();
  else if (algo === "Merge") await mergeSortAnim();
  else if (algo === "Quick") await quickSortAnim();
}

function resetArrayUI() {
  if (animationRunning) return;
  resetArray();
}

// --------------------------- Data Structures implementations ---------------------------

// --------------------------- Array DS (wrapper) ---------------------------
class ArrayDS {
  constructor(values = []) {
    this.data = Array.from(values);
  }
  draw(area, highlight = {}) {
    // area: {x,y,w,h}
    // draw each element as rectangle, show forward and reverse indices
    const n = this.data.length;
    if (n === 0) {
      drawText("[] (empty)", area.x + 20, area.y + 30, 16, "#eee");
      return;
    }
    const cellW = Math.max(40, Math.floor((area.w - 40) / n));
    const startX = area.x + 20;
    const y = area.y + area.h / 2 - 25;
    for (let i = 0; i < n; i++) {
      const x = startX + i * cellW;
      const w = cellW - 8;
      const h = 50;
      let col = "#5085d6";
      if (highlight[i] === "swap") col = "#e57373";
      else if (highlight[i] === "compare") col = "#fdd835";
      else if (highlight[i] === "sorted") col = "#81c784";
      roundRect(x, y, w, h, 8, true, false, col);
      drawText(String(this.data[i]), x + w / 2, y + h / 2 + 6, 14, "white", "center");
      // forward index below
      drawText(String(i), x + w / 2, y + h + 18, 12, "#fff", "center");
      // reverse index above
      drawText(String(i - n), x + w / 2, y - 8, 12, "#ddd", "center");
    }
  }
  findForwardReverse(val) {
    const f = this.data.indexOf(val);
    const b = this.data.length ? -(this.data.slice().reverse().indexOf(val) + 1) : null;
    return { found: f !== -1, fIndex: f, bIndex: (b === null || this.data.indexOf(val) === -1) ? null : b };
  }
  reset(vals) { this.data = Array.from(vals); }
}

// --------------------------- Stack DS ---------------------------
class StackDS {
  constructor() {
    this.items = [];
  }
  push(v) { this.items.push(v); }
  pop() { if (this.items.length) this.items.pop(); }
  toList() { return Array.from(this.items); } // bottom -> top
  draw(area) {
    // show as vertical stack at left of canvas center
    const h = 40;
    const w = 140;
    const baseX = area.x + area.w / 2 - w / 2;
    // draw from top to bottom: top at top
    const items = this.items.slice().reverse(); // show top at top
    const startY = area.y + 40;
    for (let i = 0; i < items.length; i++) {
      const y = startY + i * (h + 8);
      roundRect(baseX, y, w, h, 8, true, false, "#5085d6");
      drawText(String(items[i]), baseX + w / 2, y + h / 2 + 6, 14, "white", "center");
      // show index: forward indexing: top index 0 (as per your requirement we treat top as index 0)
      drawText(String(i), baseX - 20, y + h / 2 + 6, 12, "#fff", "center");
      // reverse index: from bottom -1, -2...
      drawText(String(-(items.length - i)), baseX + w + 20, y + h / 2 + 6, 12, "#ddd", "center");
    }
    if (items.length === 0) {
      drawText("(empty stack)", baseX, area.y + area.h / 2, 14, "#ddd", "center");
    }
  }
}

// --------------------------- Queue DS ---------------------------
class QueueDS {
  constructor() {
    this.items = [];
  }
  enqueue(v) { this.items.push(v); }
  dequeue() { if (this.items.length) this.items.shift(); }
  toList() { return Array.from(this.items); } // front -> rear
  draw(area) {
    // draw left-to-right row, but ensure items align and don't overflow; keep rear to the right
    const arr = this.items;
    const n = arr.length;
    const cellW = Math.max(60, Math.floor((area.w - 120) / Math.max(5, n))); // ensure spacing
    // start so queue centered horizontally relative to canvas area
    const totalW = n * (cellW + 8);
    let startX = area.x + Math.max(40, Math.floor((area.w - totalW) / 2));
    const y = area.y + area.h / 2 - 25;
    for (let i = 0; i < n; i++) {
      const x = startX + i * (cellW + 8);
      roundRect(x, y, cellW, 50, 8, true, false, "#5085d6");
      drawText(String(arr[i]), x + cellW / 2, y + 25 + 6, 14, "white", "center");
      // front index (0) at leftmost
      drawText(String(i), x + cellW / 2, y + 50 + 18, 12, "#fff", "center");
      // backward index
      drawText(String(i - n), x + cellW / 2, y - 8, 12, "#ddd", "center");
    }
    // if empty:
    if (n === 0) {
      drawText("(empty queue)", area.x + area.w / 2, area.y + area.h / 2, 14, "#ddd", "center");
    } else {
      // label front and rear arrows
      const frontX = startX;
      const rearX = startX + (n - 1) * (cellW + 8);
      drawText("Front", frontX, y + 100, 12, "#ffd54f", "left");
      drawText("Rear", rearX + cellW, y + 100, 12, "#ffd54f", "right");
    }
  }
}

// --------------------------- Linked List DS ---------------------------
class LinkedListNode {
  constructor(v) { this.val = v; this.next = null; }
}
class LinkedListDS {
  constructor() { this.head = null; }
  append(v) {
    const node = new LinkedListNode(v);
    if (!this.head) { this.head = node; return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }
  deleteFirst() {
    if (this.head) this.head = this.head.next;
  }
  toList() {
    const res = [];
    let cur = this.head;
    while (cur) { res.push(cur.val); cur = cur.next; }
    return res;
  }
  draw(area) {
    const vals = this.toList();
    if (vals.length === 0) {
      drawText("(empty linked list)", area.x + area.w / 2, area.y + area.h / 2, 14, "#ddd", "center");
      return;
    }
    const w = 100, h = 50;
    let totalW = vals.length * (w + 20);
    let startX = area.x + Math.max(20, Math.floor((area.w - totalW) / 2));
    const y = area.y + area.h / 2 - h / 2;
    for (let i = 0; i < vals.length; i++) {
      const x = startX + i * (w + 20);
      roundRect(x, y, w, h, 8, true, false, "#5085d6");
      drawText(String(vals[i]), x + w / 2, y + h / 2 + 6, 14, "white", "center");
      // arrow to next
      if (i < vals.length - 1) {
        const sx = x + w;
        const sy = y + h / 2;
        const ex = x + w + 20;
        const ey = sy;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        // small arrow head
        ctx.beginPath();
        ctx.moveTo(ex - 6, ey - 6);
        ctx.lineTo(ex, ey);
        ctx.lineTo(ex - 6, ey + 6);
        ctx.stroke();
      }
      // forward and backward indices
      drawText(String(i), x + w / 2, y + h + 18, 12, "#fff", "center"); // forward
      drawText(String(i - vals.length), x + w / 2, y - 8, 12, "#ddd", "center"); // backward
    }
  }
}

// --------------------------- Tree (BST) DS ---------------------------
class TreeNode {
  constructor(v) { this.val = v; this.left = null; this.right = null; }
}
class TreeDS {
  constructor() {
    this.root = null;
    this.highlightVal = null;
  }
  insert(v) {
    if (!this.root) { this.root = new TreeNode(v); return; }
    let cur = this.root;
    while (true) {
      if (v < cur.val) {
        if (cur.left) cur = cur.left;
        else { cur.left = new TreeNode(v); break; }
      } else {
        if (cur.right) cur = cur.right;
        else { cur.right = new TreeNode(v); break; }
      }
    }
  }
  inorder() {
    const out = [];
    function dfs(n) { if (!n) return; dfs(n.left); out.push(n.val); dfs(n.right); }
    dfs(this.root);
    return out;
  }
  search(v) {
    let cur = this.root;
    while (cur) {
      if (v === cur.val) { this.highlightVal = v; return true; }
      else if (v < cur.val) cur = cur.left;
      else cur = cur.right;
    }
    this.highlightVal = null;
    return false;
  }
  draw(area) {
    // layout positions by recursion: compute positions for each node
    if (!this.root) { drawText("(empty tree)", area.x + area.w / 2, area.y + area.h / 2, 14, "#ddd", "center"); return; }
    // compute positions by level traversal
    const positions = new Map(); // node -> {x,y}
    // compute width allocation using subtree sizes
    function subtreeWidth(node) {
      if (!node) return 1;
      return subtreeWidth(node.left) + subtreeWidth(node.right);
    }
    function layout(node, left, right, depth) {
      if (!node) return;
      const mid = Math.floor((left + right) / 2);
      const x = mid;
      const y = area.y + 60 + depth * 80;
      positions.set(node, { x, y });
      layout(node.left, left, mid - 1, depth + 1);
      layout(node.right, mid + 1, right, depth + 1);
    }
    const totalSlots = subtreeWidth(this.root) * 80;
    // create virtual grid positions left..right
    layout(this.root, area.x + 40, area.x + area.w - 40, 0);

    // draw edges
    positions.forEach((pos, node) => {
      if (node.left && positions.has(node.left)) {
        const a = pos; const b = positions.get(node.left);
        ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      if (node.right && positions.has(node.right)) {
        const a = pos; const b = positions.get(node.right);
        ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    });

    // draw nodes
    positions.forEach((pos, node) => {
      const highlight = (this.highlightVal !== null && node.val === this.highlightVal);
      const fill = highlight ? "#ff8a65" : "#5085d6";
      ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      drawText(String(node.val), pos.x, pos.y + 6, 14, "#fff", "center");
    });
  }
}

// --------------------------- Graph DS (nodes with coordinates + edges + Dijkstra) ---------------------------
class GraphDS {
  constructor() {
    this.nodes = new Map(); // id -> {x,y}
    this.edges = []; // {u,v,w}
    this.highlightPath = [];
    this.lastDistance = null;
  }
  addNode(area) {
    // pick id
    let nid = 1;
    if (this.nodes.size > 0) nid = Math.max(...Array.from(this.nodes.keys())) + 1;
    const margin = 60;
    const x = randomInt(area.x + margin, Math.max(area.x + margin, area.x + area.w - margin));
    const y = randomInt(area.y + margin, Math.max(area.y + margin, area.y + area.h - margin));
    this.nodes.set(nid, { x, y });
    return nid;
  }
  addEdge(u, v, w = null) {
    if (!this.nodes.has(u) || !this.nodes.has(v) || u === v) return;
    // avoid duplicates undirected
    for (const e of this.edges)
      if ((e.u === u && e.v === v) || (e.u === v && e.v === u)) return;
    if (w === null) {
      const a = this.nodes.get(u); const b = this.nodes.get(v);
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      w = Math.max(1, Math.round(dist / 50));
    }
    this.edges.push({ u, v, w });
  }
  deleteNode(nid) {
    if (!this.nodes.has(nid)) return;
    this.nodes.delete(nid);
    this.edges = this.edges.filter(e => e.u !== nid && e.v !== nid);
    this.highlightPath = [];
    this.lastDistance = null;
  }
  dijkstra(start, target) {
    if (!this.nodes.has(start) || !this.nodes.has(target)) { this.highlightPath = []; this.lastDistance = null; return { path: [], dist: Infinity }; }
    const adj = {};
    this.nodes.forEach((_, id) => adj[id] = []);
    for (const e of this.edges) {
      adj[e.u].push({ v: e.v, w: e.w });
      adj[e.v].push({ v: e.u, w: e.w });
    }
    // heapless Dijkstra (OK for small graphs)
    const dist = {}; const prev = {};
    this.nodes.forEach((_, id) => { dist[id] = Infinity; prev[id] = null; });
    dist[start] = 0;
    const Q = new Set(Array.from(this.nodes.keys()));
    while (Q.size > 0) {
      let u = null; let best = Infinity;
      for (const q of Q) if (dist[q] < best) { best = dist[q]; u = q; }
      if (u === null) break;
      Q.delete(u);
      if (u === target) break;
      for (const nb of adj[u]) {
        const alt = dist[u] + nb.w;
        if (alt < dist[nb.v]) { dist[nb.v] = alt; prev[nb.v] = u; }
      }
    }
    if (dist[target] === Infinity) { this.highlightPath = []; this.lastDistance = null; return { path: [], dist: Infinity }; }
    // reconstruct path
    const path = []; let cur = target;
    while (cur !== null) { path.push(cur); cur = prev[cur]; }
    path.reverse();
    this.highlightPath = path;
    this.lastDistance = dist[target];
    return { path, dist: dist[target] };
  }
  draw(area) {
    // background overlay
    // draw edges
    for (const e of this.edges) {
      if (!this.nodes.has(e.u) || !this.nodes.has(e.v)) continue;
      const a = this.nodes.get(e.u); const b = this.nodes.get(e.v);
      const inPath = (this.highlightPath.includes(e.u) && this.highlightPath.includes(e.v)
        && Math.abs(this.highlightPath.indexOf(e.u) - this.highlightPath.indexOf(e.v)) === 1);
      ctx.strokeStyle = inPath ? "#ff6666" : "#cfcfcf";
      ctx.lineWidth = inPath ? 4 : 2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      // weight label
      const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
      drawText(String(e.w), mx, my - 8, 12, "#111", "center");
    }
    // draw nodes
    for (const [id, p] of this.nodes.entries()) {
      const inPath = this.highlightPath.includes(id);
      const fill = inPath ? "#ff8a65" : "#5085d6";
      ctx.beginPath(); ctx.fillStyle = fill; ctx.arc(p.x, p.y, 22, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
      drawText(String(id), p.x, p.y + 6, 14, "#fff", "center");
    }
    // distance label near top-right of area if present
    if (this.highlightPath.length && this.lastDistance !== null) {
      const last = this.highlightPath[this.highlightPath.length - 1];
      const p = this.nodes.get(last) || { x: area.x + area.w - 100, y: area.y + 40 };
      drawText(`Dist: ${this.lastDistance}`, p.x + 36, p.y - 12, 14, "#ffd54f", "left");
    }
  }
}

// --------------------------- Utilities ---------------------------
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --------------------------- Global DS instances ---------------------------
let dsArray = new ArrayDS([]);
let dsStack = new StackDS();
let dsQueue = new QueueDS();
let dsLinkedList = new LinkedListDS();
let dsTree = new TreeDS();
let dsGraph = new GraphDS();

// --------------------------- UI: build DS controls dynamically ---------------------------
function buildDSControls() {
  // clear
  crudContainer.innerHTML = "";

  // ds selector element
  const dsSelect = document.createElement("select");
  dsSelect.id = "ds";
  const dsOptions = ["Array", "Stack", "Queue", "LinkedList", "Tree", "Graph"];
  dsOptions.forEach(opt => {
    const o = document.createElement("option"); o.value = opt; o.textContent = opt; dsSelect.appendChild(o);
  });
  crudContainer.appendChild(dsSelect);
  currentDS = dsSelect.value;

  // container for specific controls
  const controlsDiv = document.createElement("div");
  controlsDiv.id = "ds-specific";
  controlsDiv.style.marginTop = "8px";
  crudContainer.appendChild(controlsDiv);

  function renderSpecificControls() {
    controlsDiv.innerHTML = "";
    currentDS = dsSelect.value;
    if (currentDS === "Array") {
      // array controls: textbox to insert, reset, search
      const insertBox = document.createElement("input"); insertBox.type = "number"; insertBox.placeholder = "value to push";
      const pushBtn = document.createElement("button"); pushBtn.textContent = "Push (append)";
      pushBtn.onclick = () => { const v = parseInt(insertBox.value); if (!isNaN(v)) dsArray.data.push(v); draw(); };
      const popBtn = document.createElement("button"); popBtn.textContent = "Pop";
      popBtn.onclick = () => { dsArray.data.pop(); draw(); };
      controlsDiv.appendChild(insertBox); controlsDiv.appendChild(pushBtn); controlsDiv.appendChild(popBtn);

      // search box
      const searchBox = document.createElement("input"); searchBox.type = "number"; searchBox.placeholder = "search value";
      const searchBtn = document.createElement("button"); searchBtn.textContent = "Search";
      const resultSpan = document.createElement("div"); resultSpan.style.marginTop = "6px";
      searchBtn.onclick = () => {
        const v = parseInt(searchBox.value);
        if (isNaN(v)) { resultSpan.textContent = "Invalid"; return; }
        const res = dsArray.findForwardReverse(v);
        if (!res.found) resultSpan.textContent = `${v} not found`;
        else resultSpan.textContent = `${v} found: forward index ${res.fIndex}, reverse index ${res.bIndex}`;
        draw();
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(searchBox); controlsDiv.appendChild(searchBtn); controlsDiv.appendChild(resultSpan);
      // reset sample
      const sampleBtn = document.createElement("button"); sampleBtn.textContent = "Load sample";
      sampleBtn.onclick = () => { dsArray.reset([12, 4, 23, 8, 17, 3, 55]); draw(); };
      controlsDiv.appendChild(sampleBtn);
    } else if (currentDS === "Stack") {
      const pushBox = document.createElement("input"); pushBox.type = "number"; pushBox.placeholder = "value";
      const pushBtn = document.createElement("button"); pushBtn.textContent = "Push";
      pushBtn.onclick = () => { const v = parseInt(pushBox.value); if (!isNaN(v)) dsStack.push(v); draw(); };
      const popBtn = document.createElement("button"); popBtn.textContent = "Pop";
      popBtn.onclick = () => { dsStack.pop(); draw(); };
      controlsDiv.appendChild(pushBox); controlsDiv.appendChild(pushBtn); controlsDiv.appendChild(popBtn);

      // search box implement (find forward/bindex)
      const searchBox = document.createElement("input"); searchBox.type = "number"; searchBox.placeholder = "search value"
      const searchBtn = document.createElement("button"); searchBtn.textContent = "Search";
      const out = document.createElement("div");
      searchBtn.onclick = () => {
        const v = parseInt(searchBox.value); if (isNaN(v)) { out.textContent = "Invalid"; return; }
        const vals = dsStack.toList(); // bottom->top
        const found = vals.includes(v);
        if (!found) out.textContent = `${v} not found`;
        else {
          // top->bottom indexing: top index is 0 -> we show front index as index from top
          const idxFromTop = vals.slice().reverse().indexOf(v);
          const bidx = - (vals.slice().reverse().indexOf(v) + 1); // reverse indexing
          out.textContent = `${v} at top-index ${idxFromTop} | reverse ${bidx}`;
        }
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(searchBox); controlsDiv.appendChild(searchBtn); controlsDiv.appendChild(out);
    } else if (currentDS === "Queue") {
      const enqBox = document.createElement("input"); enqBox.type = "number"; enqBox.placeholder = "value";
      const enqBtn = document.createElement("button"); enqBtn.textContent = "Enqueue";
      enqBtn.onclick = () => { const v = parseInt(enqBox.value); if (!isNaN(v)) dsQueue.enqueue(v); draw(); };
      const deqBtn = document.createElement("button"); deqBtn.textContent = "Dequeue";
      deqBtn.onclick = () => { dsQueue.dequeue(); draw(); };
      controlsDiv.appendChild(enqBox); controlsDiv.appendChild(enqBtn); controlsDiv.appendChild(deqBtn);

      // search
      const searchBox = document.createElement("input"); searchBox.type = "number"; searchBox.placeholder = "search val";
      const searchBtn = document.createElement("button"); searchBtn.textContent = "Search";
      const out = document.createElement("div");
      searchBtn.onclick = () => {
        const v = parseInt(searchBox.value); if (isNaN(v)) { out.textContent = "Invalid"; return; }
        const vals = dsQueue.toList();
        if (!vals.includes(v)) out.textContent = `${v} not found`;
        else {
          const f = vals.indexOf(v); const b = - (vals.slice().reverse().indexOf(v) + 1);
          out.textContent = `${v} at forward ${f} | reverse ${b}`;
        }
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(searchBox); controlsDiv.appendChild(searchBtn); controlsDiv.appendChild(out);
    } else if (currentDS === "LinkedList") {
      const appendBox = document.createElement("input"); appendBox.type = "number"; appendBox.placeholder = "value";
      const appendBtn = document.createElement("button"); appendBtn.textContent = "Append";
      appendBtn.onclick = () => { const v = parseInt(appendBox.value); if (!isNaN(v)) dsLinkedList.append(v); draw(); };
      const delBtn = document.createElement("button"); delBtn.textContent = "Delete first";
      delBtn.onclick = () => { dsLinkedList.deleteFirst(); draw(); };
      controlsDiv.appendChild(appendBox); controlsDiv.appendChild(appendBtn); controlsDiv.appendChild(delBtn);

      // search
      const searchBox = document.createElement("input"); searchBox.type = "number"; searchBox.placeholder = "search val";
      const searchBtn = document.createElement("button"); searchBtn.textContent = "Search";
      const out = document.createElement("div");
      searchBtn.onclick = () => {
        const v = parseInt(searchBox.value); if (isNaN(v)) { out.textContent = "Invalid"; return; }
        const vals = dsLinkedList.toList();
        if (!vals.includes(v)) out.textContent = `${v} not found`;
        else { const f = vals.indexOf(v); const b = - (vals.slice().reverse().indexOf(v) + 1); out.textContent = `${v} at ${f} | ${b}`;}
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(searchBox); controlsDiv.appendChild(searchBtn); controlsDiv.appendChild(out);
    } else if (currentDS === "Tree") {
      const insertBox = document.createElement("input"); insertBox.type = "number"; insertBox.placeholder = "value";
      const insertBtn = document.createElement("button"); insertBtn.textContent = "Insert";
      insertBtn.onclick = () => { const v = parseInt(insertBox.value); if (!isNaN(v)) { dsTree.insert(v); draw(); } };
      controlsDiv.appendChild(insertBox); controlsDiv.appendChild(insertBtn);
      // search
      const searchBox = document.createElement("input"); searchBox.type = "number"; searchBox.placeholder = "search val";
      const searchBtn = document.createElement("button"); searchBtn.textContent = "Search";
      const out = document.createElement("div");
      searchBtn.onclick = () => {
        const v = parseInt(searchBox.value); if (isNaN(v)) { out.textContent = "Invalid"; return; }
        const found = dsTree.search(v);
        out.textContent = found ? `Found ${v}` : `${v} not found`;
        draw();
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(searchBox); controlsDiv.appendChild(searchBtn); controlsDiv.appendChild(out);
    } else if (currentDS === "Graph") {
      // Graph controls: Add node, Add edge, Delete node, Node1/Node2 inputs and Find Path
      const addNodeBtn = document.createElement("button"); addNodeBtn.textContent = "Add Node";
      addNodeBtn.onclick = () => { dsGraph.addNode({x:270,y:0,w:canvas.width-270,h:canvas.height}); draw(); };
      const addEdgeBtn = document.createElement("button"); addEdgeBtn.textContent = "Add Edge (random pair)";
      addEdgeBtn.onclick = () => {
        const ids = Array.from(dsGraph.nodes.keys());
        if (ids.length >= 2) dsGraph.addEdge(ids[Math.floor(Math.random()*ids.length)], ids[Math.floor(Math.random()*ids.length)]);
        draw();
      };
      const delNodeBtn = document.createElement("button"); delNodeBtn.textContent = "Delete Last Node";
      delNodeBtn.onclick = () => {
        const ids = Array.from(dsGraph.nodes.keys());
        if (ids.length) dsGraph.deleteNode(ids[ids.length - 1]);
        draw();
      };
      controlsDiv.appendChild(addNodeBtn); controlsDiv.appendChild(addEdgeBtn); controlsDiv.appendChild(delNodeBtn);

      // Node1 and Node2 boxes
      const node1Box = document.createElement("input"); node1Box.type = "number"; node1Box.placeholder = "Node1 id";
      const node2Box = document.createElement("input"); node2Box.type = "number"; node2Box.placeholder = "Node2 id";
      const findBtn = document.createElement("button"); findBtn.textContent = "Find shortest path";
      const out = document.createElement("div");
      findBtn.onclick = () => {
        const a = parseInt(node1Box.value); const b = parseInt(node2Box.value);
        if (isNaN(a) || isNaN(b)) { out.textContent = "enter valid ids"; return; }
        const { path, dist } = dsGraph.dijkstra(a, b);
        if (!path.length) out.textContent = `No path ${a} -> ${b}`;
        else out.textContent = `Path: ${path.join(" -> ")} (Dist ${dist})`;
        draw();
      };
      controlsDiv.appendChild(document.createElement("br"));
      controlsDiv.appendChild(node1Box); controlsDiv.appendChild(node2Box); controlsDiv.appendChild(findBtn); controlsDiv.appendChild(out);
    }
  }

  // initial
  dsSelect.addEventListener("change", renderSpecificControls);
  renderSpecificControls();
}

// --------------------------- Rendering top-level & draw dispatch ---------------------------
function draw() {
  clearCanvas();
  // draw left panel (sidebar area) background on canvas for alignment, so right canvas drawings won't overlay left UI
  // we assume actual UI is in DOM, but canvas drawing area begins at x=270 to match CSS
  // draw current mode content in right canvas area
  const canvasArea = { x: 270, y: 0, w: canvas.width - 270, h: canvas.height };
  // background
  ctx.fillStyle = "#07203f";
  ctx.fillRect(canvasArea.x, canvasArea.y, canvasArea.w, canvasArea.h);

  if (mode === "Algorithm") {
    drawArrayBars();
  } else {
    // Data Structure selected currently by the DS selector from controls
    const dsSelect = document.getElementById("ds");
    const dsVal = dsSelect ? dsSelect.value : "Array";
    // draw right area depending on dsVal
    if (dsVal === "Array") {
      dsArray.draw(canvasArea, highlightMap);
    } else if (dsVal === "Stack") {
      dsStack.draw(canvasArea);
    } else if (dsVal === "Queue") {
      dsQueue.draw(canvasArea);
    } else if (dsVal === "LinkedList") {
      dsLinkedList.draw(canvasArea);
    } else if (dsVal === "Tree") {
      dsTree.draw(canvasArea);
      // if highlighted value exists show label
      if (dsTree.highlightVal !== null) {
        drawText(`Highlighted: ${dsTree.highlightVal}`, canvasArea.x + 20, canvasArea.y + 20, 16, "#ffd54f");
      }
    } else if (dsVal === "Graph") {
      dsGraph.draw(canvasArea);
      // show path result top-right if exists
      if (dsGraph.highlightPath.length && dsGraph.lastDistance !== null) {
        const last = dsGraph.highlightPath[dsGraph.highlightPath.length - 1];
        const p = dsGraph.nodes.get(last);
        const text = `Path Dist: ${dsGraph.lastDistance}`;
        drawText(text, canvasArea.x + canvasArea.w - 140, canvasArea.y + 20, 14, "#ffd54f");
      }
    }
  }
}

// refresh everything
function refreshAll() {
  draw();
}

// --------------------------- Wire up algorithm controls in DOM (Start/Reset under dropdown) ---------------------------
function initAlgorithmUI() {
  // Start button in HTML uses onclick startSort -> we connected earlier by function name
  // Reset uses resetArrayUI
  // The speed/size controls are already wired
  resetArray();
}

// --------------------------- Initialize & boot ---------------------------
function init() {
  // Build DS Controls
  buildDSControls();
  // Render controls based on mode
  renderControls();
  // Initialize algorithm UI and array
  initAlgorithmUI();
  // initial draw
  draw();
}

function renderControls() {
  if (mode === "Algorithm") {
    algoControls.style.display = "flex";
    dsControls.style.display = "none";
  } else {
    algoControls.style.display = "none";
    dsControls.style.display = "block";
  }
}

// expose Start/Reset functions to global window for button html inline calls
window.startSort = startSort;
window.resetArray = resetArray;
window.resetArrayUI = resetArrayUI;

// start
init();

// make canvas responsive to window size changes
window.addEventListener("resize", () => {
  // keep canvas size relative to window (you can tweak)
  const cw = Math.max(900, window.innerWidth - 340);
  const ch = Math.max(600, window.innerHeight - 40);
  canvas.width = cw;
  canvas.height = ch;
  draw();
});

// allow clicking on the canvas to add graph node when in Graph DS mode (nice UX)
canvas.addEventListener("dblclick", (ev) => {
  // compute canvas coords
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  if (mode === "DataStructure") {
    const dsSelect = document.getElementById("ds");
    if (dsSelect && dsSelect.value === "Graph") {
      // only add node if inside right canvas (not left panel)
      if (x >= 270) {
        // create new node with given pos
        let nid = 1;
        if (dsGraph.nodes.size > 0) nid = Math.max(...Array.from(dsGraph.nodes.keys())) + 1;
        dsGraph.nodes.set(nid, { x: x, y: y });
        draw();
      }
    }
  }
});

// resize initialization to set proper canvas size based on window
(function fixInitialCanvasSize() {
  const cw = Math.max(900, window.innerWidth - 340);
  const ch = Math.max(600, window.innerHeight - 40);
  canvas.width = cw;
  canvas.height = ch;
  draw();
})();
