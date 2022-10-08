import './lib/webaudio-controls.js';
import'./volume/index.js';

const songs = ['https://mainline.i3s.unice.fr/mooc/guitarRiff1.mp3','https://mainline.i3s.unice.fr/mooc/LaSueur.mp3', 'http://mainline.i3s.unice.fr/mooc/horse.mp3'];
let songIndex = 0;

const getBaseUrl = () => {
  return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
}

// Update song details


const template = document.createElement("template");
template.innerHTML = `
  <style>
    h1 {
          color:red;
    }
  
  </style>
    <audio id="myPlayer" >
    <source src="${songs[songIndex]}" type="audio/mp3">

    </audio>
   
    <div class="progress-indicator">
    <span class="current-time">0:0</span>
    <input type="range" max="100" value="0" class="progress-bar">
    <span class="duration">0:00</span>
    <canvas class="visualizer" style="width: 100%; height: 20px"></canvas>
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
    <my-volume id="volume"></my-volume>

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
    this.player.loop = true;
    this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
    this.currentTimeEl = this.progressIndicator.children[0];
    this.progressBar = this.progressIndicator.children[1];
    this.durationEl = this.progressIndicator.children[2];
    this.volume = this.shadowRoot.getElementById('volume');
    this.declareListeners();


  };


  declareListeners() {
    this.shadowRoot.querySelector("#playButton").addEventListener("click", (event) => {
      this.play();
    });
    this.shadowRoot.querySelector("#pauseButton").addEventListener("click", (event) => {
      this.pause();
    });
    this.shadowRoot.querySelector("#raz").addEventListener("click", (event) => {
      this.reset();
    });
    this.shadowRoot.querySelector("#advance").addEventListener("click", (event) => {
      this.advance();
    });
    this.shadowRoot.querySelector("#return").addEventListener("click", (event) => {
      this.return();
    });
    this.shadowRoot.querySelector("#previous").addEventListener("click", (event) => {
      this.previous();
    });
    this.shadowRoot.querySelector("#next").addEventListener("click", (event) => {
      this.next();
    });
    this.progressBar.addEventListener('input', (e) => this.seekTo(this.progressBar.value), false);

    this.player.addEventListener('loadedmetadata', () => {
      this.progressBar.max = this.player.duration;
      this.durationEl.textContent = this.getTimeString(this.player.duration);
      this.updateAudioTime();
    });
    this.player.addEventListener('timeupdate', () => {
      this.updateAudioTime(this.player.currentTime);
    })
   
    this.volume.addEventListener('input', (e) => this.setVolume(this.volume.value), false);
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
  updateAudioTime() {
    this.progressBar.value = this.player.currentTime;
    this.currentTimeEl.textContent = this.getTimeString(this.player.currentTime);
  }
  seekTo(value) {
    this.player.currentTime = value;
  }

  updateAudioTime() {
    this.progressBar.value = this.player.currentTime;
    this.currentTimeEl.textContent = this.getTimeString(this.player.currentTime);
  }

}
customElements.define("my-audioplayer", MyAudioPlayer);
