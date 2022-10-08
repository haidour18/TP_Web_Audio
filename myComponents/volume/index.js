import '../lib/webaudio-controls.js';

const getBaseUrl = () => {
    return "https://github.com/haidour18/TP_Web_Audio/tree/master/myComponents";
  }

const template = document.createElement("template");
template.innerHTML =`
  <style>
h1  {color:black;}
  
  </style>

  <webaudio-knob
  id="volume"
  src="${getBaseUrl()}/assets/knobs/vernier.png"
  value=0
  min=0
  max=1
  step=0.1
  diameter=150
  tooltip="Volume %d"
  style="position: absolute; top: 108px; left: 65px;">
</webaudio-knob>

`;

class Volume extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));


    }

    connectedCallback() {
        
    }

   


 

}

customElements.define("my-volume", Volume);