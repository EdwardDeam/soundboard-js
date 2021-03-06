import { SFX_LIST } from "./sfxList.js";

// Find the right Audio Context to make.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

const pads = document.querySelector('.pad-collection');
const settings = {
  currentPage: 1,
  maxButtons: Math.floor(pads.offsetWidth / 200) * Math.floor(pads.offsetHeight / 200),
  volume: document.querySelector('#volume').value
}

SFX_LIST.forEach(sound => {
  loadSound(sound);
});

setupPage();
window.onresize = () => {
  createButtons();
  updatePagination();
};

function setupPage() {
  // Add listeners
  document.querySelector('.btn-prev').addEventListener('click', prevPage);
  document.querySelector('.btn-next').addEventListener('click', nextPage);
  document.querySelector('#volume').addEventListener('change', updateVolume);
  createButtons();
  updatePagination();
}

function createButtons() {
  // Calcutate new max buttons
  settings.maxButtons = Math.floor(pads.offsetWidth / 200) * Math.floor(pads.offsetHeight / 200);
  // load sound depending on page
  const startIndex = (settings.currentPage - 1) * settings.maxButtons;
  // Clean up old elements
  while (pads.firstChild) {
    pads.firstChild.remove();
  }
  // Find how many 200px square buttons can fit in the collection area.
  for (let i = startIndex; i < startIndex + settings.maxButtons && i < SFX_LIST.length; i++) {
    const btn = document.createElement('div');
    const text = document.createElement('h3');
    text.innerText = SFX_LIST[i].name;
    text.className = 'pad-text';
    btn.appendChild(text);
    btn.className = 'pad';
    btn.id = `sfx-${i}`;
    btn.addEventListener('mousedown', (event) => {
      event.toElement.style.cursor = 'grabbing';
    })
    btn.addEventListener('mouseup', (event) => {
      if (event.which === 1) { // Left click
        event.toElement.style.cursor = 'grab';
        playSound(i);
      }
    })
    pads.appendChild(btn);
  }
};

function loadSound(sound) {
  const request = new XMLHttpRequest();
  request.open('GET', sound.url, true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    context.decodeAudioData(request.response, buffer => { sound.buffer = buffer });
  }
  request.send();
}

function playSound(id) {
  const effect = SFX_LIST[id];
  if (effect) {
    const source = context.createBufferSource();
    source.buffer = effect.buffer;
    const gainNode = context.createGain();
    gainNode.gain.value = (settings.volume / 100) ** 2 + .1;
    source.connect(gainNode);
    gainNode.connect(context.destination)
    source.start(0);
  }
}

function updatePagination() {
  settings.maxPages = Math.ceil(SFX_LIST.length / settings.maxButtons);
  setting.currentPage = Math.min(Math.max(setting.currentPage, 1), settings.maxPages) // JS version of clamp()...
}

function nextPage() {
  if (settings.currentPage < settings.maxPages) {
    settings.currentPage++;
    createButtons();
  }
}

function prevPage() {
  if (settings.currentPage > 1) {
    settings.currentPage--;
    createButtons();
  }
}

function updateVolume() {
  settings.volume = document.querySelector('#volume').value;
}
