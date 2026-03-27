/* ===== RINGTONE ZONE — script.js ===== */

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

let currentSongIndex = 0;
let inputValue       = '';
let isPreviewing     = false;
let previewTimeout   = null;
let toastTimeout     = null;

const songTitleEl  = document.getElementById('songTitle');
const songArtistEl = document.getElementById('songArtist');
const inputDisplay = document.getElementById('inputDisplay');
const previewBtn   = document.getElementById('previewBtn');
const setBtn       = document.getElementById('setBtn');
const callBtn      = document.getElementById('callBtn');
const endBtn       = document.getElementById('endBtn');
const clrBtn       = document.getElementById('clrBtn');
const menuBtn      = document.getElementById('menuBtn');
const okBtn        = document.getElementById('okBtn');
const screenEl     = document.querySelector('.screen');
const toastEl      = document.getElementById('toast');

function renderSong() {
  songTitleEl.style.opacity  = '0';
  songArtistEl.style.opacity = '0';
  setTimeout(() => {
    const s = SONGS[currentSongIndex];
    songTitleEl.textContent  = s.title;
    songArtistEl.textContent = s.artist;
    songTitleEl.style.transition  = 'opacity 0.25s';
    songArtistEl.style.transition = 'opacity 0.25s';
    songTitleEl.style.opacity  = '1';
    songArtistEl.style.opacity = '1';
  }, 120);
}

function renderInput() { inputDisplay.textContent = inputValue; }

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
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.start(); osc.stop(ctx.currentTime + duration / 1000);
  } catch (_) {}
}

function playMelody() {
  const notes = [[880,120],[784,120],[698,120],[784,120],[880,120],[880,120],[880,240]];
  let t = 0;
  notes.forEach(([f, d]) => { setTimeout(() => playBeep(f, d - 10, 'square'), t); t += d + 20; });
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

function nextSong() { currentSongIndex = (currentSongIndex + 1) % SONGS.length; renderSong(); playBeep(600, 50); }
function prevSong() { currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length; renderSong(); playBeep(560, 50); }

// Numpad
document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const digit = btn.dataset.num;
    if (inputValue.length < 12) { inputValue += digit; renderInput(); }
    playBeep(660 + inputValue.length * 35, 50);
  });
});

// D-pad
document.querySelectorAll('.dp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = btn.dataset.dir;
    if (dir === 'up' || dir === 'right') nextSong(); else prevSong();
  });
});

// Green call = call / navigate
callBtn.addEventListener('click', () => {
  if (inputValue) { showToast('CALLING: ' + inputValue); playBeep(900, 300, 'sine'); }
  else { prevSong(); }
});

// Red end = clear / end
endBtn.addEventListener('click', () => {
  if (isPreviewing) stopPreview();
  else if (inputValue) { inputValue = ''; renderInput(); showToast('CLEARED'); playBeep(330, 80); }
  else nextSong();
});

// C = delete one character
clrBtn.addEventListener('click', () => {
  if (inputValue.length > 0) { inputValue = inputValue.slice(0, -1); renderInput(); playBeep(440, 50); }
  else showToast('NOTHING TO CLEAR');
});

// Menu
menuBtn.addEventListener('click', () => { showToast('MENU'); playBeep(700, 60); });

// OK
okBtn.addEventListener('click', () => { isPreviewing ? stopPreview() : startPreview(); });

// Screen buttons
previewBtn.addEventListener('click', () => { isPreviewing ? stopPreview() : startPreview(); });
setBtn.addEventListener('click', () => {
  const song = SONGS[currentSongIndex];
  showToast('✓ SET: ' + song.title);
  playBeep(1046, 200, 'sine');
  setBtn.style.background = '#78e838';
  setTimeout(() => { setBtn.style.background = ''; }, 300);
});

// Keyboard
document.addEventListener('keydown', e => {
  const key = e.key;
  if ('0123456789*#'.includes(key)) {
    if (inputValue.length < 12) { inputValue += key; renderInput(); }
    playBeep(660 + inputValue.length * 35, 50);
  } else if (key === 'Backspace') {
    inputValue = inputValue.slice(0, -1); renderInput(); playBeep(440, 50);
  } else if (key === 'ArrowUp' || key === 'ArrowRight') {
    nextSong();
  } else if (key === 'ArrowDown' || key === 'ArrowLeft') {
    prevSong();
  } else if (key === 'Enter') {
    isPreviewing ? stopPreview() : startPreview();
  }
});

renderSong();
renderInput();
