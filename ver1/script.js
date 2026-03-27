/* ===== RINGTONE ZONE — script.js ===== */

// ── Song data ──────────────────────────────────────────────
const SONGS = [
  { title: 'BITU BITUIN',    artist: 'DANTE PAOLO' },
  { title: 'NENENG B',       artist: 'BEN&BEN' },
  { title: 'KUNDIMAN',       artist: 'RICO BLANCO' },
  { title: 'MUNDO',          artist: '4TH IMPACT' },
  { title: 'ERE',            artist: 'ERASERHEADS' },
  { title: 'LIGAYA',         artist: 'ERASERHEADS' },
  { title: 'ARAW-ARAW',      artist: 'UDD' },
  { title: 'SANA',           artist: 'I BELONG TO ZOO' },
];

// ── State ──────────────────────────────────────────────────
let currentSongIndex = 0;
let inputValue       = '';
let isPreviewing     = false;
let previewTimeout   = null;
let toastTimeout     = null;

// ── DOM refs ───────────────────────────────────────────────
const songTitleEl  = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');
const inputDisplay = document.getElementById('inputDisplay');
const cursorEl     = document.getElementById('cursor');
const previewBtn   = document.getElementById('previewBtn');
const setBtn       = document.getElementById('setBtn');
const backBtn      = document.getElementById('backBtn');
const clrBtn       = document.getElementById('clrBtn');
const callBtn      = document.getElementById('callBtn');
const okBtn        = document.getElementById('okBtn');
const screenEl     = document.querySelector('.screen');
const toastEl      = document.getElementById('toast');

// ── Helpers ────────────────────────────────────────────────
function renderSong() {
  const song = SONGS[currentSongIndex];
  // Slide-in effect
  songTitleEl.style.opacity  = '0';
  songArtistEl.style.opacity = '0';
  setTimeout(() => {
    songTitleEl.textContent  = song.title;
    songArtistEl.textContent = song.artist;
    songTitleEl.style.transition  = 'opacity 0.3s';
    songArtistEl.style.transition = 'opacity 0.3s';
    songTitleEl.style.opacity  = '1';
    songArtistEl.style.opacity = '1';
  }, 150);
}

function renderInput() {
  inputDisplay.textContent = inputValue;
}

function showToast(msg) {
  clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function playBeep(freq = 880, duration = 60, type = 'square') {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type      = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (_) { /* AudioContext not available */ }
}

function playMelody() {
  // Simple Nokia-ish ditty
  const notes = [
    [880, 120], [784, 120], [698, 120], [784, 120],
    [880, 120], [880, 120], [880, 240],
  ];
  let t = 0;
  notes.forEach(([freq, dur]) => {
    setTimeout(() => playBeep(freq, dur - 10, 'square'), t);
    t += dur + 20;
  });
}

function startPreview() {
  if (isPreviewing) return;
  isPreviewing = true;
  screenEl.classList.add('previewing');
  previewBtn.textContent = '⏹ STOP';
  playMelody();
  previewTimeout = setTimeout(stopPreview, 2000);
}

function stopPreview() {
  isPreviewing = false;
  clearTimeout(previewTimeout);
  screenEl.classList.remove('previewing');
  previewBtn.textContent = '▶ PREVIEW';
}

// ── Numpad ─────────────────────────────────────────────────
document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const digit = btn.dataset.num;
    if (inputValue.length < 10) {
      inputValue += digit;
      renderInput();
    }
    playBeep(660 + inputValue.length * 40, 50);
  });
});

// ── Nav buttons ────────────────────────────────────────────
backBtn.addEventListener('click', () => {
  if (inputValue.length > 0) {
    inputValue = inputValue.slice(0, -1);
    renderInput();
    playBeep(440, 50);
  } else {
    // Navigate songs backwards
    currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    renderSong();
    playBeep(520, 60);
  }
});

clrBtn.addEventListener('click', () => {
  inputValue = '';
  renderInput();
  playBeep(330, 80);
  showToast('INPUT CLEARED');
});

callBtn.addEventListener('click', () => {
  if (inputValue) {
    showToast(`CALLING: ${inputValue}`);
    playBeep(900, 300, 'sine');
  } else {
    showToast('ENTER A NUMBER FIRST');
  }
});

// ── D-pad ──────────────────────────────────────────────────
document.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up' || dir === 'right') {
      currentSongIndex = (currentSongIndex + 1) % SONGS.length;
    } else {
      currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    }
    renderSong();
    playBeep(600, 50);
  });
});

okBtn.addEventListener('click', () => {
  if (isPreviewing) {
    stopPreview();
  } else {
    startPreview();
  }
});

// ── Screen buttons ─────────────────────────────────────────
previewBtn.addEventListener('click', () => {
  if (isPreviewing) {
    stopPreview();
  } else {
    startPreview();
  }
});

setBtn.addEventListener('click', () => {
  const song = SONGS[currentSongIndex];
  showToast(`✓ SET: ${song.title}`);
  playBeep(1046, 200, 'sine');
  // Flash effect
  setBtn.style.background = '#78e838';
  setTimeout(() => { setBtn.style.background = ''; }, 300);
});

// ── Keyboard support ───────────────────────────────────────
document.addEventListener('keydown', e => {
  const key = e.key;
  if ('0123456789*#'.includes(key)) {
    if (inputValue.length < 10) {
      inputValue += key;
      renderInput();
      playBeep(660 + inputValue.length * 40, 50);
    }
  } else if (key === 'Backspace') {
    inputValue = inputValue.slice(0, -1);
    renderInput();
    playBeep(440, 50);
  } else if (key === 'ArrowUp' || key === 'ArrowRight') {
    currentSongIndex = (currentSongIndex + 1) % SONGS.length;
    renderSong();
    playBeep(600, 50);
  } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
    currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    renderSong();
    playBeep(600, 50);
  } else if (key === 'Enter') {
    isPreviewing ? stopPreview() : startPreview();
  }
});

// ── Init ───────────────────────────────────────────────────
renderSong();
renderInput();
