/* =====================================================================
   PLAY WITH MOONIE — game.js
   All game rules, controls, animation steps and button behaviour.

   TABLE OF CONTENTS
     1. CONFIG: your Moonies, names, rarities and odds   <-- edit here
     2. CONFIG: machine and claw settings
     3. Page elements
     4. Game state
     5. Claw position and drawing
     6. Controls (mouse, touch and keyboard)
     7. The grab sequence
     8. The reveal screen (tap, tap, Moonie!)
     9. Sparkling stars
    10. Downloading the Moonie (PNG and JPEG)
    11. Collection
    12. Start the game
   ===================================================================== */
'use strict';


/* =====================================================================
   1. CONFIG — YOUR MOONIES
   Each Moonie has:
     id          a short unique number-name (used for the download name)
     name        the name shown on screen (placeholder names: change them!)
     rarity      Common / Uncommon / Rare / Super Rare / Secret
     weight      how likely it is. All eight weights add up to 100,
                 so a weight of 25 means a 25% chance.
     image       the picture file (relative path from index.html)
     description the little sentence shown under the name
     secret      true only for the special one
   ===================================================================== */
const MOONIES = [
  { id: 'moonie-01', name: 'Noodle Night Moonie', rarity: 'Common',     weight: 25,
    image: 'assets/moonie/Moonie01.png',
    description: 'Moonie with a bowl of warm soup.' },

  { id: 'moonie-02', name: 'Mailbox Moonie',      rarity: 'Common',     weight: 20,
    image: 'assets/moonie/Moonie02.png',
    description: 'Letter...received !' },

  { id: 'moonie-03', name: 'Hello Moonie',        rarity: 'Uncommon',   weight: 16,
    image: 'assets/moonie/Moonie03.png',
    description: 'Hello Hello ! ' },

  { id: 'moonie-04', name: 'Starlight Moonie',    rarity: 'Uncommon',   weight: 13,
    image: 'assets/moonie/Moonie04.png',
    description: 'Collect the stars' },

  { id: 'moonie-05', name: 'Camera Moonie',       rarity: 'Rare',       weight: 10,
    image: 'assets/moonie/Moonie05.png',
    description: 'Moonie and Mochi' },

  { id: 'moonie-06', name: 'Daydream Moonie',     rarity: 'Rare',       weight: 8,
    image: 'assets/moonie/Moonie06.png',
    description: 'Who painted the sky?' },

  { id: 'moonie-07', name: 'Moonie with Shiba',        rarity: 'Super Rare', weight: 6,
    image: 'assets/moonie/Moonie07.png',
    description: 'Best friends with a very fluffy Shiba pup.' },

  { id: 'moonie-08', name: 'Secret Wink Moonie',  rarity: 'Secret',     weight: 2,
    image: 'assets/moonie/Moonie08.png',
    description: 'Yayy! You got a secret wink for the luckiest claw master of all!',
    secret: true }
];


/* =====================================================================
   2. CONFIG — MACHINE AND CLAW SETTINGS
   (The window position and sizes live in style.css, section 1.)
   ===================================================================== */
const SETTINGS = {

  // How fast the claw slides left and right (1 = the whole window width per second)
  moveSpeed: 0.55,

  // Where the claw hangs when it is waiting (0.5 = middle of the window)
  startX: 0.5,

  // Where the claw drops the box (the prize hole), as a fraction of the window width
  chuteX: 0.8,

  // Claw picture details. These come from claw-open.png / claw-closed-box.png,
  // which are both 260 x 293 pixels. Only change them if you redraw the claws.
  claw: {
    leftReach:      0.40,        // how far the claw's drawing reaches LEFT of its hook (fraction of picture width)
    rightReach:     0.33,        // how far it reaches RIGHT of its hook
                                 // (these two stop the claw touching the sides of the window)
    boxBottom:      282 / 293,   // where the bottom of the box is in claw-closed-box.png (top = 0, bottom = 1)
    boxCenterShift: 10 / 260     // the drawn box sits this far left of the claw's hook
  },

  // Animation lengths in milliseconds
  timing: {
    snap:    450,   // claw lines up over the box
    descend: 1100,  // going down
    pause:   200,   // little wait before closing
    close:   350,   // wait after the claw closes
    lift:    1100,  // coming back up
    travel:  900,   // sliding to the prize hole
    ret:     700    // sliding back to the middle after the reveal
  },

  // The pile of blind boxes inside the window.
  //   x   = box centre as a fraction of the window width
  //   row = 'front' (the claw can grab these) or 'back' (decoration)
  //   rot = tiny tilt in degrees, just to look cute
  boxSlots: [
    { x: 0.170, row: 'front', rot: -2 },
    { x: 0.335, row: 'front', rot:  1.5 },
    { x: 0.500, row: 'front', rot: -1 },
    { x: 0.665, row: 'front', rot:  2 },
    { x: 0.830, row: 'front', rot: -1.5 },
    { x: 0.255, row: 'back',  rot:  2 },
    { x: 0.420, row: 'back',  rot: -2 },
    { x: 0.580, row: 'back',  rot:  1.5 },
    { x: 0.745, row: 'back',  rot: -1 }
  ],

  // Pictures used on the reveal screen
  images: {
    boxClosed: 'assets/boxes/blind-box-closeup.png',
    boxOpen:   'assets/boxes/blind-box-open.png'
  },

  // Saved-collection name inside the browser
  storageKey: 'moonie-claw-club-collection-v1',

  // Your signature, stamped onto every PNG and JPEG download
  watermark: {
    text: 'Moonie Brownie',
    signature: true,        // the main signature near the bottom
    tiled: true,            // faint repeated marks across the doll (hard to crop out)
    tiledOpacity: 0.16      // 0 = invisible, 1 = solid
  },

  // Background colours of the JPEG download (JPEG cannot be see-through)
  jpegBackground: ['#ffe9f3', '#e6f2ff']
};

const TEXT = {
  hintIdle:      'Move the claw, then press GRAB!',
  hintGrabbing:  'Grabbing…',
  hintLifting:   'Got one! Carrying it to the prize hole…',
  hintReturning: 'Ready for another go!',
  promptClosed:  'Tap your box to open it!',
  promptOpen:    'Tap again to meet your Moonie!'
};


/* =====================================================================
   3. PAGE ELEMENTS
   ===================================================================== */
const $ = (id) => document.getElementById(id);

const el = {
  window:  $('window'),
  claw:    $('claw'),
  hint:    $('hint'),
  btnLeft: $('btnLeft'),
  btnRight:$('btnRight'),
  btnGrab: $('btnGrab'),

  reveal:      $('reveal'),
  sparkles:    $('sparkles'),
  secretBanner:$('secretBanner'),
  boxTap:      $('boxTap'),
  boxImg:      $('boxImg'),
  prompt:      $('prompt'),
  moonieCard:  $('moonieCard'),
  moonieImg:   $('moonieImg'),
  moonieName:  $('moonieName'),
  moonieRarity:$('moonieRarity'),
  moonieDesc:  $('moonieDesc'),
  btnPng:      $('btnPng'),
  btnJpg:      $('btnJpg'),
  btnAdd:      $('btnAdd'),
  btnBack:     $('btnBack'),
  message:     $('message'),

  collectionGrid:  $('collectionGrid'),
  collectionCount: $('collectionCount'),
  btnClear:        $('btnClearCollection')
};


/* =====================================================================
   4. GAME STATE
   ===================================================================== */
const state = {
  x: SETTINGS.startX,   // claw hook position, fraction of window width
  depth: 0,             // 0 = top, 1 = all the way down
  dir: 0,               // -1 moving left, 0 still, +1 moving right
  busy: false,          // true during the grab sequence (controls are off)
  stage: null,          // null | 'closeup' | 'open' | 'revealed'
  tapLocked: false,     // stops accidental double taps
  moonie: null,         // the Moonie chosen for this opening
  pickedSlot: null,     // the box the claw is taking
  sparkleTimer: null
};

const boxElements = [];       // { el, slot } for every blind box in the pile
let measure = { winW: 1, winH: 1, clawW: 1, clawH: 1, yDown: 1 };


/* =====================================================================
   5. CLAW POSITION AND DRAWING
   ===================================================================== */

// Measure the window and claw in real pixels (so it works at any screen size)
function updateMeasure() {
  const winW  = el.window.clientWidth;
  const winH  = el.window.clientHeight;
  const clawW = el.claw.offsetWidth;
  const clawH = el.claw.offsetHeight;
  measure = {
    winW, winH, clawW, clawH,
    // How far down the claw goes so the box sits on the floor of the window
    yDown: Math.max(1, winH - SETTINGS.claw.boxBottom * clawH)
  };
}

// The left and right limits for the claw hook (fractions of the window width)
function limits() {
  const left  = (SETTINGS.claw.leftReach  * measure.clawW) / measure.winW;
  const right = (SETTINGS.claw.rightReach * measure.clawW) / measure.winW;
  return { min: left, max: 1 - right };
}

function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

// Put the claw picture where the state says it should be
function render() {
  const lim = limits();
  state.x = clamp(state.x, lim.min, lim.max);

  const y  = state.depth * measure.yDown;
  const tx = state.x * measure.winW - measure.clawW / 2;

  el.claw.style.transform = `translate3d(${tx}px, ${y}px, 0)`;
  // The cable reaches from the top of the window down to the claw's hook
  el.claw.style.setProperty('--cable-h', `${y + measure.clawH * 0.04 + 2}px`);
}

// Build the pile of blind boxes inside the window
function buildBoxes() {
  SETTINGS.boxSlots.forEach((slot) => {
    const img = document.createElement('img');
    img.src = 'assets/boxes/blind-box.png';
    img.alt = '';
    img.draggable = false;
    img.className = 'prize-box ' + slot.row;
    img.style.setProperty('--x', (slot.x * 100) + '%');
    img.style.setProperty('--rot', slot.rot + 'deg');
    el.window.appendChild(img);
    if (slot.row === 'front') boxElements.push({ el: img, slot });
  });
}

// Smooth easing so movements start and stop gently
function easeInOut(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
function lerp(a, b, p) { return a + (b - a) * p; }
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

// Run an animation for `ms` milliseconds. update(p) receives 0 → 1.
function tween(ms, update) {
  return new Promise((resolve) => {
    const start = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - start) / ms);
      update(easeInOut(p));
      render();
      if (p < 1) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
}

// The always-running loop that moves the claw while a direction is held
let lastTime = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  if (!state.busy && state.dir !== 0) {
    state.x += state.dir * SETTINGS.moveSpeed * dt;
    render();
  }
  requestAnimationFrame(loop);
}


/* =====================================================================
   6. CONTROLS (mouse, touch and keyboard)
   ===================================================================== */
function setHint(text) { el.hint.textContent = text; }

function setControlsDisabled(disabled) {
  el.btnLeft.disabled  = disabled;
  el.btnRight.disabled = disabled;
  el.btnGrab.disabled  = disabled;
}

function startMoving(direction) {
  if (state.busy) return;
  state.dir = direction;
  el.btnLeft.classList.toggle('is-pressed',  direction < 0);
  el.btnRight.classList.toggle('is-pressed', direction > 0);
}

function stopMoving() {
  state.dir = 0;
  el.btnLeft.classList.remove('is-pressed');
  el.btnRight.classList.remove('is-pressed');
}

// A "hold-to-move" button works with mouse, finger and pen
function wireHoldButton(button, direction) {
  button.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button > 0) return;   // ignore right-click
    e.preventDefault();
    startMoving(direction);
  });
  button.addEventListener('pointerup',     stopMoving);
  button.addEventListener('pointercancel', stopMoving);
  button.addEventListener('pointerleave',  stopMoving);
  button.addEventListener('lostpointercapture', stopMoving);

  // On touch screens the finger stays "attached" to the button, so also
  // check whether the finger has slid off it.
  button.addEventListener('pointermove', (e) => {
    if (state.dir !== direction) return;
    const r = button.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right ||
                    e.clientY < r.top  || e.clientY > r.bottom;
    if (outside) stopMoving();
  });

  // No long-press menu and no text selection
  button.addEventListener('contextmenu', (e) => e.preventDefault());
  button.addEventListener('selectstart', (e) => e.preventDefault());
  button.addEventListener('dragstart',   (e) => e.preventDefault());
}

function wireControls() {
  wireHoldButton(el.btnLeft,  -1);
  wireHoldButton(el.btnRight, +1);
  el.btnGrab.addEventListener('click', grab);
  el.btnGrab.addEventListener('contextmenu', (e) => e.preventDefault());

  // Stop moving when the page loses focus or is hidden
  window.addEventListener('blur', stopMoving);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMoving(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    // On the reveal screen, Escape goes back (only after the Moonie is shown)
    if (!el.reveal.hidden) {
      if (e.key === 'Escape' && state.stage === 'revealed') closeReveal();
      return;
    }
    if (e.repeat && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); return; }

    if (e.key === 'ArrowLeft')  { e.preventDefault(); startMoving(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); startMoving(+1); }
    else if (e.key === ' ' || e.key === 'Spacebar') {
      const active = document.activeElement;
      if (active === el.btnLeft)  { e.preventDefault(); startMoving(-1); }
      else if (active === el.btnRight) { e.preventDefault(); startMoving(+1); }
      else if (active !== el.btnGrab) { e.preventDefault(); grab(); }   // the GRAB button handles its own Space key
    } else if (e.key === 'ArrowDown') { e.preventDefault(); grab(); }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Spacebar') {
      if (e.key === ' ' || e.key === 'Spacebar') {
        const active = document.activeElement;
        if (active !== el.btnLeft && active !== el.btnRight) return;
      }
      stopMoving();
    }
  });
}


/* =====================================================================
   7. THE GRAB SEQUENCE
   1 Aim  →  2 Descend  →  3 Close  →  4 Lift  →  5 Travel  →  6 Close-up
   ===================================================================== */

// Pick one Moonie using the weights (bigger weight = more likely)
function pickMoonie() {
  const total = MOONIES.reduce((sum, m) => sum + m.weight, 0);
  let roll = Math.random() * total;
  for (const m of MOONIES) {
    roll -= m.weight;
    if (roll < 0) return m;
  }
  return MOONIES[MOONIES.length - 1];
}

// Handy test: type  testOdds(10000)  in the browser console to see the odds
window.testOdds = function (times = 10000) {
  const counts = {};
  MOONIES.forEach((m) => (counts[m.name] = 0));
  for (let i = 0; i < times; i++) counts[pickMoonie().name]++;
  const table = {};
  Object.keys(counts).forEach((k) => (table[k] = (counts[k] / times * 100).toFixed(1) + '%'));
  console.table(table);
};

// Which front box is closest to the claw right now?
function nearestFrontBox() {
  let best = boxElements[0];
  boxElements.forEach((b) => {
    if (Math.abs(b.slot.x - state.x) < Math.abs(best.slot.x - state.x)) best = b;
  });
  return best;
}

async function grab() {
  if (state.busy || !el.reveal.hidden) return;   // no repeated grabs

  state.busy = true;
  stopMoving();
  setControlsDisabled(true);
  setHint(TEXT.hintGrabbing);

  // The prize is decided ONCE here and stays the same for this whole opening
  state.moonie = pickMoonie();

  const target = nearestFrontBox();
  state.pickedSlot = target;
  const lim = limits();
  const hookX = clamp(
    target.slot.x + (SETTINGS.claw.boxCenterShift * measure.clawW) / measure.winW,
    lim.min, lim.max
  );
  const startX = state.x;
  const T = SETTINGS.timing;

  // Step 2 — descend (the open claw slides behind the boxes), lining up as it goes
  await Promise.all([
    tween(T.descend, (p) => { state.depth = p; }),
    tween(T.snap,    (p) => { state.x = lerp(startX, hookX, p); })
  ]);
  await wait(T.pause);

  // Step 3 — close: swap to the closed claw (which already includes its box)
  el.claw.classList.add('in-front', 'is-closed');
  target.el.classList.add('is-taken');          // hide the pile box so there is no duplicate
  await wait(T.close);

  // Step 4 — lift the claw and box together
  setHint(TEXT.hintLifting);
  await tween(T.lift, (p) => { state.depth = 1 - p; });

  // Step 5 — travel toward the prize hole
  const fromX = state.x;
  const toX = clamp(SETTINGS.chuteX, lim.min, lim.max);
  await tween(T.travel, (p) => { state.x = lerp(fromX, toX, p); });
  await wait(150);

  // Step 6 — show the close-up box
  el.claw.classList.add('fade-out');
  openReveal();
}

// Put the claw back to its starting position after the reveal
async function resetMachine() {
  const T = SETTINGS.timing;
  const picked = state.pickedSlot;

  el.claw.classList.remove('is-closed', 'in-front');
  el.claw.classList.remove('fade-out');
  state.depth = 0;
  render();

  // Put the taken box back on the pile
  if (picked) {
    picked.el.classList.remove('is-taken');
    picked.el.classList.add('restock');
    setTimeout(() => picked.el.classList.remove('restock'), 600);
  }

  // Claw reappears (open) and slides to the middle
  const fromX = state.x;
  await tween(T.ret, (p) => { state.x = lerp(fromX, SETTINGS.startX, p); });

  state.pickedSlot = null;
  state.busy = false;
  setControlsDisabled(false);
  setHint(TEXT.hintReturning);
  setTimeout(() => { if (!state.busy) setHint(TEXT.hintIdle); }, 1800);
}


/* =====================================================================
   8. THE REVEAL SCREEN
   Stage 1: close-up box (tap)  →  Stage 2: open box (tap)  →  Stage 3: Moonie
   ===================================================================== */
function openReveal() {
  state.stage = 'closeup';
  state.tapLocked = false;

  el.reveal.classList.remove('secret');
  el.secretBanner.hidden = true;
  el.moonieCard.hidden = true;
  el.boxTap.hidden = false;
  el.boxTap.classList.remove('shake');
  el.boxImg.src = SETTINGS.images.boxClosed;
  el.boxImg.alt = 'Your blind box. Tap to open.';
  el.prompt.hidden = false;
  el.prompt.textContent = TEXT.promptClosed;
  el.message.textContent = '';
  el.sparkles.innerHTML = '';

  el.reveal.hidden = false;
  el.boxTap.focus({ preventScroll: true });

  startAmbientSparkles(el.boxTap);
  setTimeout(() => burstSparkles(el.boxTap, 16), 350);
}

function lockTaps(ms) {
  state.tapLocked = true;
  setTimeout(() => { state.tapLocked = false; }, ms);
}

function onBoxTap() {
  if (state.tapLocked) return;

  if (state.stage === 'closeup') {
    // First tap → show the OPEN box. The Moonie is NOT shown yet.
    state.stage = 'open';
    lockTaps(650);
    el.boxTap.classList.remove('shake');
    void el.boxTap.offsetWidth;                 // restarts the shake animation
    el.boxTap.classList.add('shake');
    burstSparkles(el.boxTap, 22);
    setTimeout(() => {
      el.boxImg.src = SETTINGS.images.boxOpen;
      el.boxImg.alt = 'Your opened blind box. Tap again to see your Moonie.';
      burstSparkles(el.boxTap, 14);
    }, 260);
    el.prompt.textContent = TEXT.promptOpen;

  } else if (state.stage === 'open') {
    // Second tap → reveal the Moonie that was chosen at the start
    state.stage = 'revealed';
    lockTaps(500);
    showMoonie();
  }
}

function showMoonie() {
  const m = state.moonie;

  burstSparkles(el.boxTap, 26);
  el.boxTap.hidden = true;
  el.prompt.hidden = true;

  el.moonieImg.src = m.image;
  el.moonieImg.alt = m.name;
  el.moonieName.textContent = m.name;
  el.moonieRarity.textContent = m.rarity;
  el.moonieRarity.dataset.rarity = m.rarity;
  el.moonieDesc.textContent = m.description;
  el.message.textContent = '';

  // Restart the pop-in animation each time
  el.moonieImg.style.animation = 'none';
  void el.moonieImg.offsetWidth;
  el.moonieImg.style.animation = '';

  el.reveal.classList.toggle('secret', !!m.secret);
  el.secretBanner.hidden = !m.secret;
  el.moonieCard.hidden = false;

  updateAddButton();

  // Sparkles around the Moonie (extra for the secret one)
  startAmbientSparkles(el.moonieImg, m.secret ? 90 : 220);
  setTimeout(() => burstSparkles(el.moonieImg, m.secret ? 60 : 26), 250);
  if (m.secret) {
    setTimeout(() => burstSparkles(el.moonieImg, 40), 900);
    setTimeout(() => burstSparkles(el.moonieImg, 40), 1700);
  }
  // Scroll to the top so the Moonie is visible on small screens
  el.reveal.scrollTop = 0;
}

function closeReveal() {
  if (el.reveal.hidden) return;
  stopSparkles();
  el.sparkles.innerHTML = '';
  el.reveal.hidden = true;
  state.stage = null;
  resetMachine();
}


/* =====================================================================
   9. SPARKLING STARS
   Little CSS stars appear around an element, twinkle, and are removed.
   ===================================================================== */
const SPARK_COLOURS = ['#ffe27a', '#ffb3d9', '#b8f0ff', '#d9c2ff', '#fff6b0', '#ffffff', '#ffc9a8'];
const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawnSpark(target) {
  if (el.sparkles.childElementCount > 70) return;

  const area = el.sparkles.getBoundingClientRect();
  const box  = target.getBoundingClientRect();
  if (box.width === 0) return;

  const cx = box.left - area.left + box.width  / 2;
  const cy = box.top  - area.top  + box.height / 2;

  // A random spot in a ring around the target
  const angle  = Math.random() * Math.PI * 2;
  const ring   = 0.45 + Math.random() * 0.45;
  const x = cx + Math.cos(angle) * box.width  * ring;
  const y = cy + Math.sin(angle) * box.height * ring;

  const star = document.createElement('span');
  star.className = 'spark';
  star.style.left = x + 'px';
  star.style.top  = y + 'px';
  star.style.setProperty('--s', (10 + Math.random() * 20).toFixed(0) + 'px');
  star.style.setProperty('--d', (1.1 + Math.random() * 1.1).toFixed(2) + 's');
  star.style.setProperty('--c', SPARK_COLOURS[Math.floor(Math.random() * SPARK_COLOURS.length)]);
  star.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's';
  star.addEventListener('animationend', () => star.remove());
  el.sparkles.appendChild(star);
}

function burstSparkles(target, count) {
  const n = reducedMotion ? Math.ceil(count / 3) : count;
  for (let i = 0; i < n; i++) spawnSpark(target);
}

function startAmbientSparkles(target, every = 220) {
  stopSparkles();
  state.sparkleTimer = setInterval(() => spawnSpark(target), every);
}

function stopSparkles() {
  if (state.sparkleTimer) clearInterval(state.sparkleTimer);
  state.sparkleTimer = null;
}


/* =====================================================================
   10. DOWNLOADING THE MOONIE
   We draw ONLY the doll picture onto an invisible canvas, then save it.
   (Never a screenshot of the page.)
   ===================================================================== */
function showMessage(text) { el.message.textContent = text; }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load ' + src));
    img.src = src;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Export returned nothing'))), type, quality);
    } catch (err) {
      reject(err);   // happens when the browser blocks exporting from local files
    }
  });
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Stamp the "Moonie Brownie" signature onto the canvas
function stampWatermark(ctx, w, h) {
  const wm = SETTINGS.watermark;
  if (!wm || !wm.text) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';

  // Faint repeated marks, tilted, across the whole picture
  if (wm.tiled) {
    const size = Math.round(w * 0.06);
    ctx.font = '900 ' + size + 'px ui-rounded, "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.globalAlpha = wm.tiledOpacity;
    ctx.fillStyle = '#303231';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.12;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 7);
    const stepX = size * 8.5, stepY = size * 4.2;
    for (let y = -h; y <= h; y += stepY) {
      for (let x = -w; x <= w; x += stepX) {
        const ox = (Math.round(y / stepY) % 2) * (stepX / 2);
        ctx.strokeText(wm.text, x + ox, y);
        ctx.fillText(wm.text, x + ox, y);
      }
    }
  }
  ctx.restore();

  // The main signature, bottom centre
  if (wm.signature) {
    ctx.save();
    const size = Math.round(w * 0.075);
    ctx.font = '900 ' + size + 'px ui-rounded, "Trebuchet MS", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.22;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#303231';
    ctx.globalAlpha = 0.92;
    const x = w / 2, y = h - size * 0.9;
    ctx.strokeText(wm.text, x, y);
    ctx.fillText(wm.text, x, y);
    ctx.restore();
  }
}

async function downloadMoonie(format) {
  const m = state.moonie;
  if (!m) return;
  const isJpeg = format === 'jpeg';
  const filename = m.id + (isJpeg ? '.jpg' : '.png');

  try {
    const img = await loadImage(m.image);
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (isJpeg) {
      // JPEG has no transparency, so paint a pastel background first
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, SETTINGS.jpegBackground[0]);
      grad.addColorStop(1, SETTINGS.jpegBackground[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const s = 0.92;   // draw the doll a little smaller so it has breathing room
      ctx.drawImage(img, (w - w * s) / 2, (h - h * s) / 2, w * s, h * s);
    } else {
      ctx.drawImage(img, 0, 0, w, h);   // PNG keeps the see-through background
    }
    stampWatermark(ctx, w, h);          // add the Moonie Brownie signature

    const blob = await canvasToBlob(canvas, isJpeg ? 'image/jpeg' : 'image/png', 0.92);
    saveBlob(blob, filename);
    showMessage('Saved ' + filename + ' ✓');

  } catch (err) {
    console.error('Download problem:', err);
    // We never hand out the original file as a fallback (it has no signature).
    showMessage('Saving is blocked when index.html is opened by double-click. ' +
                'Open the game with VS Code "Live Server" or on GitHub Pages and it will work.');
  }
}


/* =====================================================================
   11. COLLECTION  (saved in the player's own browser)
   ===================================================================== */
let memoryCollection = [];   // used if the browser will not allow saving

function loadCollection() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS.storageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (err) {
    return memoryCollection;
  }
}

function saveCollection(list) {
  memoryCollection = list;
  try { localStorage.setItem(SETTINGS.storageKey, JSON.stringify(list)); } catch (err) { /* ignore */ }
}

function renderCollection() {
  const owned = loadCollection();
  el.collectionGrid.innerHTML = '';
  MOONIES.forEach((m) => {
    const has = owned.includes(m.id);
    const li = document.createElement('li');
    li.className = 'slot' + (has ? '' : ' locked') + (has && m.secret ? ' secret-found' : '');
    li.title = has ? m.name : 'Not found yet';
    const img = document.createElement('img');
    img.src = m.image;
    img.alt = has ? m.name : 'Locked Moonie';
    img.draggable = false;
    li.appendChild(img);
    el.collectionGrid.appendChild(li);
  });
  el.collectionCount.textContent = owned.filter((id) => MOONIES.some((m) => m.id === id)).length + '/' + MOONIES.length;
}

function updateAddButton() {
  const has = state.moonie && loadCollection().includes(state.moonie.id);
  el.btnAdd.disabled = !!has;
  el.btnAdd.textContent = has ? 'In your collection ✓' : 'Add to collection';
}

function addToCollection() {
  if (!state.moonie) return;
  const list = loadCollection();
  if (!list.includes(state.moonie.id)) {
    list.push(state.moonie.id);
    saveCollection(list);
  }
  renderCollection();
  updateAddButton();
  showMessage(state.moonie.name + ' was added to your collection!');
  burstSparkles(el.moonieImg, 18);
}

function clearCollection() {
  if (window.confirm('Remove all Moonies from your collection?')) {
    saveCollection([]);
    renderCollection();
  }
}


/* =====================================================================
   12. START THE GAME
   ===================================================================== */
function preloadImages() {
  const files = [
    'assets/machine/machine.png', 'assets/claw/claw-open.png', 'assets/claw/claw-closed-box.png',
    'assets/boxes/blind-box.png', SETTINGS.images.boxClosed, SETTINGS.images.boxOpen
  ].concat(MOONIES.map((m) => m.image));
  files.forEach((src) => { const i = new Image(); i.src = src; });
}

// A small speed bump: no right-click menu or dragging on pictures
function protectImages() {
  document.addEventListener('contextmenu', (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); });
  document.addEventListener('dragstart',   (e) => { if (e.target.tagName === 'IMG') e.preventDefault(); });
}

function init() {
  protectImages();
  buildBoxes();
  wireControls();
  preloadImages();

  el.boxTap.addEventListener('click', onBoxTap);
  el.btnPng.addEventListener('click', () => downloadMoonie('png'));
  el.btnJpg.addEventListener('click', () => downloadMoonie('jpeg'));
  el.btnAdd.addEventListener('click', addToCollection);
  el.btnBack.addEventListener('click', closeReveal);
  el.btnClear.addEventListener('click', clearCollection);

  // Keep the claw lined up whenever the machine changes size
  updateMeasure();
  render();
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { updateMeasure(); render(); }).observe(el.window);
  } else {
    window.addEventListener('resize', () => { updateMeasure(); render(); });
  }

  renderCollection();
  setHint(TEXT.hintIdle);
  requestAnimationFrame(loop);
}

init();
