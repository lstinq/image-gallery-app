import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class PlayListSlide extends DDDSuper(I18NMixin(LitElement)) {
    
  static get tag() {
    return "play-list-slide";
  }

  static get properties() {
    return {
      ...super.properties,
      active: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [super.styles, css`
      :host {
        display: none;
      }
      :host([active]) {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .slide-body {
        margin: 0;
        flex: 1;
        overflow-y: auto;
        width: 100%;
      }
    `];
  }

  render() {
    return html`
      <div class="slide-body">
        <slot></slot>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);