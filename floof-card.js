import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class FloofCard extends DDDSuper(LitElement) {

    static get tag() {
        return "floof-card";
    }

    static get properties() {
        return {
            ...super.properties,
            image: { type: String },
            title: { type: String },
        };
    }

    constructor() {
        super();
        this.image = "";
        this.title = "";
    }

    async firstUpdated() {
        const response = await fetch("https://randomfox.ca/floof/");
        const data = await response.json();
        this.image = data.image;
    }

    static get styles() {
        return [super.styles, css`
            :host {
                display: block;
                width: 100%;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            .card {
                width: 100%;
                max-height: 60vh;
                overflow: hidden;
                aspect-ratio: 1 / 1;
            }
        `];
    }

    render() {
        return html`
            <div class="card">
                <img src="${this.image}" alt="a random fox" />
            </div>
        `;
    }
}

globalThis.customElements.define(FloofCard.tag, FloofCard);