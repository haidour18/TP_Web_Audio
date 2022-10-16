import "../lib/webaudio-controls.js";
const template = document.createElement("template");

template.innerHTML = /*html*/ `
  <style>
  canvas {
    width: 300px;
    height: 400px;
    background-color: transparent;
    margin-left: 20px;
    margin-right: 20px;
    padding: 10px;
  }
  label {
    margin-left: 20px;
  }
  </style>
 <canvas id="canvas"></canvas>
 

 `;


class Visualiser extends HTMLElement {
  constructor(params) {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.canvas = this.shadowRoot.getElementById("canvas");

    this.canvasinit();
    requestAnimationFrame(() => this.animate());
  }

  canvasinit() {
    const interval = setInterval(() => {
      if (this.audioContext) {
        this.analyser = this.audioContext.createAnalyser();

        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.addAudioNode(this.analyser);
        clearInterval(interval);
      }
    }, 100);

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvasContext = this.canvas.getContext("2d");
  }

  animate() {
    if (!this.analyser) {
      setTimeout(() => {
        requestAnimationFrame(() => this.animate());
      }, 100);
      return;
    }

    this.canvasContext.clearRect(0, 0, this.width, this.height);
    this.analyser.getByteFrequencyData(this.dataArray);

    const barWidth = this.width / this.bufferLength;
    var barHeight;
    var x = 0;
    const heightScale = this.height / 128;

    for (var i = 0; i < this.bufferLength; i++) {
         this.red= i*barHeight/20;
         this.green= i*4;
         this.blue= barHeight/2;
      barHeight = this.dataArray[i];
      this.canvasContext.fillStyle = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
      barHeight *= heightScale;
      this.canvasContext.fillRect(
        x,
        this.height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }
    requestAnimationFrame(() => this.animate());
  }
}

customElements.define("freq-visualiser", Visualiser);
