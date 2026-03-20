import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class PlayListIndicator extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "play-list-indicator";
  }

  static get properties() {
    return {
      ...super.properties,
      active: { type: Boolean, reflect: true },
      index: { type: Number, reflect: true },
    };
  }

    static get styles() {
    return [super.styles, css`
        button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background-color: var(--ddd-theme-default-limestoneGray);
            opacity: 0.5;
            cursor: pointer;
        }
        :host([active]) button {
            background-color: var(--ddd-theme-default-beaverBlue);
            opacity: 1;
        }
    `];
  }

  render() {
    return html`
    <button @click="${() => this.dispatchEvent(new CustomEvent("indicator-clicked", {
        bubbles: true,
        composed: true,
        detail: { index: this.index }
        }))}"></button>
    `;
  }
}
globalThis.customElements.define(PlayListIndicator.tag, PlayListIndicator);