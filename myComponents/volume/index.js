import '../lib/webaudio-controls.js';

const getBaseUrl = () => {
    return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
  }

const template = document.createElement("template");
template.innerHTML = /*html*/`
<h1>Audio Player</h1>
'`;

class Volume extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

    }

    connectedCallback() {
        
    }

   


 

}

customElements.define("my-volume", Volume);