import "./balance/index.js";
import "./lib/webaudio-controls.js";
import "./visualizer/index.js";
import "./equalizer/index.js";
const songs = [
  "https://mainline.i3s.unice.fr/mooc/guitarRiff1.mp3",
  
  "https://mainline.i3s.unice.fr/mooc/LaSueur.mp3",
  "http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
];

let songIndex = 0;
const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
    h1 {
          color:red;
    }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    display: grid;
    place-content: center;
    min-height: 100vh;
    background: #0e0e0e;}
.controles {
  display: grid;
column-gap: 10px;}

  button {
    background-color: transparent;
    color: white;
    border-radius: 10%;
  margin: 10px 10px 10px 10px;
    border: 1px solid #3498db;

    border-color: white;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
  }
  
  /* Darker background on mouse-over */
  button:hover {
    background-color: RoyalBlue;
  }

  .container {
    background-color: transparent;
  margin: 10px 10px 10px 10px;
  }

  .controls {
    display: grid;
  }
  .controls > * {
    margin: 10px 10px 10px 10px;
  }
  .controls > *:first-child {
    margin-top: 0;
  }
  .volume {
    display: grid;  

  }
  .balance {
    display: grid;}
    .my{
      display: grid;
      grid-column-gap: 10px;
    }


  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    <audio id="myPlayer"  crossorigin="anonymous" >
    <source src="${songs[songIndex]}" type="audio/mp3">
    </audio>
    <freq-visualiser id="visualiser"></freq-visualiser>

    <div class="progress-indicator" style="width:auto; padding:auto;margin:auto,auto value="0">
    <span class="current-time" style ="color:white; margin:25px;">0:0</span>
    <input type="range" max="1000" value="0" class="progress-bar" style="width:80%; padding:15px;margin:auto,auto; transition : all 0.1s">
    <span class="duration" style ="color:white">0:00</span>
    </div>
<div class="controls" style="display:grid;margin-left:70px, margin-bottom:0px,position:center, padding:25px">
<div class="container" style="margin-left:90px, margin-bottom:0px,position:center">
    <button id ="pauseButton" ><i class="fa fa-pause"></i>  Pause</button>
    <button id="playButton"><i class="fa-sharp fa fa-play"></i> Play</button>
    <button id="raz"><i class="fa fa-stop"></i> Arrêter</button>
    <button id="advance"><i class="fa fa-forward"></i> + 10s</button>
    <button id="return"><i class="fa fa-backward"></i> - 10s</button>
    <button id="next"><i class="fa fa-caret-right"></i> Suivant</button>
    <button id="previous"><i class="fa fa-caret-left"></i> Précédent</button>
    </div>
  <div class="my" style= "display:grid">

    <label for="volume" style=" color: white;position: absolute; top: 210px; left: 830px ">Volume</label>
    
    <webaudio-knob
    id="volume"
    style="position: absolute; top: 240px; left: 830px"
src="myComponents/lineshadow2.png"
    value=1
    min=0
    max=1
    step=0.1
    diameter=60
    >
  
    
  </webaudio-knob>


  <label        
  for="balance" style=" color: white;position: absolute; top: 320px; left: 830px  ">Balance</label>

  <my-balance         style="position: absolute; top: 340px; left: 830px"
  id ="balance"></my-balance>
</div>

</div>

<my-equalizer id="equalizer"></my-equalizer>
  <br>
    <br>
  `;

class MyAudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.volume = 1;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.audioContext = new AudioContext();

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.volume = this.shadowRoot.getElementById("volume");
    this.balance = this.shadowRoot.getElementById("balance");
    this.progressIndicator = this.shadowRoot.querySelector(
      ".progress-indicator"
    );
    this.currentTimeEl = this.progressIndicator.querySelector(".current-time");
    this.progressBar = this.progressIndicator.querySelector(".progress-bar");
    this.durationEl = this.progressIndicator.querySelector(".duration");
    this.playbutton = this.shadowRoot.querySelector("#playButton");
    this.pauseButton = this.shadowRoot.querySelector("#pauseButton");
    this.advanceButton = this.shadowRoot.querySelector("#advance");
    this.returnButton = this.shadowRoot.querySelector("#return");
    this.razButton = this.shadowRoot.querySelector("#raz");
    this.nextButton = this.shadowRoot.querySelector("#next");
    this.previousButton = this.shadowRoot.querySelector("#previous");
    this.freq_visualiser = this.shadowRoot.getElementById("visualiser");
    this.equalizer = this.shadowRoot.getElementById("equalizer");
    this.sourceNode = this.audioContext.createMediaElementSource(this.player);
    this.sourceNode.connect(this.audioContext.destination);
    this.audioNodes = [this.sourceNode];

    setTimeout(() => {
      this.freq_visualiser.audioContext = this.audioContext;
      this.freq_visualiser.addAudioNode = (audioNode) =>
        this.connectAudioNode(audioNode, "freq visualier");
    }, 1000);
    this.equalizer.audioContext = this.audioContext;
    this.equalizer.addAudioNode = (audioNode) =>
      this.addAudioNode(audioNode, "equalizer");
    this.balance.audioContext = this.audioContext;
    this.balance.addAudioNode = (audioNode) =>
      this.addAudioNode(audioNode, "balance");

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
    console.log(`Linked ${previousNode.name || "input"} to ${audioNode.name}`);
  }

  declareListeners() {
    this.playbutton.addEventListener("click", () => {
      this.player.play();
      this.audioContext.resume().then(() => {});
    });
    this.pauseButton.addEventListener("click", () => {
      this.player.pause();
    });

    this.advanceButton.addEventListener("click", () => {
      this.player.currentTime = this.player.currentTime + 10;
    });
    this.returnButton.addEventListener("click", () => {
      this.player.currentTime = this.player.currentTime - 10;
    });
    this.returnButton.addEventListener("click", () => {
      this.player.currentTime = this.player.currentTime - 10;
    });
    this.nextButton.addEventListener("click", () => {
      this.next();
    });
    this.previousButton.addEventListener("click", () => {
      this.previous();
    });
    this.progressBar.addEventListener(
      "input",
      () => this.seekTo(this.progressBar.value),
      false
    );
    this.razButton.addEventListener("click", () => {
      this.player.currentTime = 0;
    });
    this.player.addEventListener("loadedmetadata", () => {
      this.progressBar.max = this.player.duration;
      this.durationEl.textContent = this.getTimeString(this.player.duration);
      this.updateAudioTime();
    });
    this.player.addEventListener("timeupdate", () => {
      this.updateAudioTime(this.player.currentTime);
      this.progressBar.value = this.player.currentTime;
    });
    this.player.addEventListener("ended", () => {
      this.next();
    });

    this.volume.addEventListener("input", ({ target: { value } }) => {
      this.player.volume = parseFloat(value, 10);
    });

    this.balance.addEventListener("input", ({ target: { value } }) => {
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
    this.currentTimeEl.textContent = this.getTimeString(
      this.player.currentTime
    );
  }
  initAudio() {
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.player.crossOrigin = "anonymous";
    this.player.src = songs[songIndex];
    this.player.play();
  }
}
customElements.define("my-audioplayer", MyAudioPlayer);
