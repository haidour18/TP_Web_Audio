import '../lib/webaudio-controls.js';



///The js was frm Dorian but I worked on the UI to improve it and make it more user friendly
const template = document.createElement("template");
template.innerHTML = /*html*/`
    <style>
    </style>
    <webaudio-knob
        id="balance"
        value=0
        min=-1
        max=1
        src="myComponents/balance/Vintage_Knob.png"
        step=0.1
        diameter=50
        tooltip="Balance"
    >
    </webaudio-knob>
`;

class Balance extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.filters = [];
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
this.balance = this.shadowRoot.getElementById('balance');
const interval = setInterval(() => {
    if (this.audioContext) {
        this.pannerNode = this.audioContext.createStereoPanner();
        this.addAudioNode(this.pannerNode);
        clearInterval(interval);
    }
}, 500);

this.balance.addEventListener('input', ({ target: { value }}) => {
            if (this.pannerNode) {
                this.pannerNode.pan.value = parseFloat(value, 10);
            }
        });    }

  
       
    


 

  

    
      
    

}

customElements.define("my-balance", Balance);