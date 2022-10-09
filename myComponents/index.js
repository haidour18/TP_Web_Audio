import './balance/index.js';
import './lib/webaudio-controls.js';
const AudioContext = window.AudioContext || window.webkitAudioContext;

const songs = ['https://mainline.i3s.unice.fr/mooc/guitarRiff1.mp3', 'https://mainline.i3s.unice.fr/mooc/LaSueur.mp3', 'http://mainline.i3s.unice.fr/mooc/horse.mp3'];
let songIndex = 0;
const template = document.createElement("template");
template.innerHTML = `
  <style>
    h1 {
          color:red;
    }
  
  </style>
    <audio id="myPlayer"  crossorigin="anonymous">
    <source src="${songs[songIndex]}" type="audio/mp3">
    </audio>
    <div class="progress-indicator">
    <span class="current-time">0:0</span>
    <input type="range" max="100" value="0" class="progress-bar">
    <span class="duration">0:00</span>
</div>
    <button id ="pauseButton">Pause</button>
    <button id="playButton">Play</button>
    <button id="raz">Retour à zero</button>
    <button id="advance">Avancer</button>
    <button id="return">Retourner</button>
    <button id="next">Morceau suivant</button>
    <button id="previous">Morceau précédent</button>
    <br>
    <br>
    <label for="volume">Volume</label>
    <br>
    <webaudio-knob
    id="volume"
    script="https://github.com/haidour18/TP_assets/blob/main/Vintage_Knob.png"
    value=1
    min=0
    max=1
    step=0.1
    diameter=50
    >
  </webaudio-knob>
  <br>
  <br>
  <label for="balance">Balance</label>
  <br>

  <my-balance id ="balance"></my-balance>

  <br>
    <br>`;

class MyAudioPlayer extends HTMLElement {

  constructor() {
    super();
    this.volume = 1;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.volume = this.shadowRoot.getElementById('volume');
    this.balance = this.shadowRoot.getElementById('balance');
    this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
    this.currentTimeEl = this.progressIndicator.children[0];
    this.progressBar = this.progressIndicator.children[1];
    this.durationEl = this.progressIndicator.children[2];
    this.playbutton = this.shadowRoot.querySelector("#playButton");
    this.pauseButton = this.shadowRoot.querySelector("#pauseButton");
    this.advanceButton = this.shadowRoot.querySelector("#advance");
    this.returnButton = this.shadowRoot.querySelector("#return");
    this.razButton = this.shadowRoot.querySelector("#raz");
    this.nextButton = this.shadowRoot.querySelector("#next");
    this.previousButton = this.shadowRoot.querySelector("#previous");
    this.audioContext = new AudioContext();
    this.sourceNode = this.audioContext.createMediaElementSource(this.player);
    this.sourceNode.connect(this.audioContext.destination);
    this.audioNodes = [this.sourceNode];
    this.balance.audioContext = this.audioContext;
    this.balance.addAudioNode = (audioNode) => this.addAudioNode(audioNode, "balance");
    this.declareListeners();
  
  }
//from Dorian TP
  async connectAudioNode(audioNode) {
    audioNode.name = name;
    const length = this.audioNodes.length;
    const previousNode = this.audioNodes[length - 1];
    previousNode.connect(audioNode);
    audioNode.connect(this.audioContext.destination);
  }
//from Dorian TP
  addAudioNode(audioNode, name) {
    audioNode.name = name;
    const length = this.audioNodes.length;
    const previousNode = this.audioNodes[length - 1];
    previousNode.disconnect();
    previousNode.connect(audioNode);
    audioNode.connect(this.audioContext.destination);
    this.audioNodes.push(audioNode);
    console.log(`Linked ${previousNode.name || 'input'} to ${audioNode.name}`);
  }


  declareListeners() {
    this.playbutton.addEventListener("click", (event) => {
      this.player.play();
    });
    this.pauseButton.addEventListener("click", (event) => { this.player.pause(); });

    this.advanceButton.addEventListener("click", (event) => { this.player.currentTime = this.player.currentTime + 10; });
    this.returnButton.addEventListener("click", (event) => { this.player.currentTime = this.player.currentTime - 10; });
    this.returnButton.addEventListener("click", (event) => { this.player.currentTime = this.player.currentTime - 10; });
    this.nextButton.addEventListener("click", (event) => { this.next(); });
    this.previousButton.addEventListener("click", (event) => { this.previous(); });
    this.progressBar.addEventListener('input', (e) => this.seekTo(this.progressBar.value), false);
    this.razButton.addEventListener("click", (event) => { this.player.currentTime = 0; });
    this.player.addEventListener('loadedmetadata', () => {
      this.progressBar.max = this.player.duration;
      this.durationEl.textContent = this.getTimeString(this.player.duration);
      this.updateAudioTime();
    });
    this.player.addEventListener('timeupdate', () => {
      this.updateAudioTime(this.player.currentTime);
    })

    this.volume.addEventListener('input', ({ target: { value } }) => {
      this.player.volume = parseFloat(value, 10);

    });
this.balance.addEventListener('input', ({ target: { value } }) => {
      this.player.balance = parseFloat(value, 10);

    });
  }
  // API
  setVolume(val) {
    this.player.volume = val;
  }
  play() {
    this.player.play();
  }
  pause() {
    this.player.pause();
  }
  reset() {
    this.player.currentTime = 0;
  }

  advance() {
    this.player.currentTime = this.player.currentTime + 10;
  }

  return() {
    this.player.currentTime = this.player.currentTime - 10;
  }
  previous() {
    songIndex--;

    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }


    this.player.src = songs[songIndex];
    this.player.play();
  }
  next() {
    songIndex++;

    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }

    this.player.src = songs[songIndex];
    this.player.play();
  }

  getTimeString(time) {
    const secs = `${parseInt(`${time % 60}`, 10)}`.padStart(2, '0');
    const min = parseInt(`${(time / 60) % 60}`, 10);

    return `${min}:${secs}`;
  }

  seekTo(value) {
    this.player.currentTime = value;
  }

  updateAudioTime() {
    this.progressBar.value = this.player.currentTime;
    this.currentTimeEl.textContent = this.getTimeString(this.player.currentTime);
  }
  initAudio() {
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.player.crossOrigin = "anonymous";
    this.player.src = songs[songIndex];
    this.player.play();
  }

}
customElements.define("my-audioplayer", MyAudioPlayer);
