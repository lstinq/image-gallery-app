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
      topHeading: { type: String, attribute: "top-heading" },
      subHeading: { type: String, attribute: "sub-heading" },
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
      .slide-top-heading {
        margin: 0;
        font-size: var(--ddd-font-size-xs);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-beaver80);
        text-transform: uppercase;
      }
      .slide-sub-heading {
        margin: 0;
        font-size: var(--ddd-font-size-xl);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-beaverBlue);
      }
      .slide-body {
        margin: 0;
        flex: 1;
        overflow-y: auto;
        width: 100%;
        max-width: 60ch;
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-coalyGray);
      }
    `];
  }

  render() {
    return html`
      ${this.topHeading ? html`<p class="slide-top-heading">${this.topHeading}</p>` : ""}
      ${this.subHeading ? html`<h2 class="slide-sub-heading">${this.subHeading}</h2>` : ""}
      <div class="slide-body">
        <slot></slot>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);