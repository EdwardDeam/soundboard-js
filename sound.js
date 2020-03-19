import { SFX_LIST } from "./sfxList.js";

// Find the right Audio Context to make.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

SFX_LIST.forEach(sound => {
  loadSound(sound);
});

createButtons();
window.onresize = createButtons;


function createButtons() {
  const element = document.querySelector(".button-collection");
  // Clean up old elements
  while (element.firstChild) {
    element.firstChild.remove();
  }
  // Find how many 200px square buttons can fit in the collection area.
  const maxButtons = Math.floor(element.offsetWidth / 200) * Math.floor(element.offsetHeight / 200);

  for (let i = 0; i < maxButtons; i++) {
    const btn = document.createElement("div");
    btn.className = "button";
    btn.id = `sfx-${i}`;
    btn.addEventListener('mousedown', (event) => {
      event.toElement.style.cursor = "grabbing";
    })
    btn.addEventListener('mouseup', (event) => {
      event.toElement.style.cursor = "grab";
      playSound(event.toElement.id);
    })
    element.appendChild(btn);
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
  id = id.replace("sfx-", "");
  const effect = SFX_LIST.find((element) => element.id == id)
  console.log(effect);
  if (effect) {
    const source = context.createBufferSource();
    source.buffer = effect.buffer;
    source.connect(context.destination);
    source.start(0);
  }
}




