/**
 * Copyright 2026 Mandy Liu
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `play-list-project`
 * 
 * @demo index.html
 * @element play-list-project
 */
export class PlayListProject extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "play-list-project";
  }

  constructor() {
    super();
    this.title = "";
    this.index = 0;
    this.slides = [];
    this.slideCount = 0;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      index: { type: Number, reflect: true },
      slideCount: { type: Number },
    };
  }

  async firstUpdated() {
    this.slides = Array.from(this.querySelectorAll("play-list-slide"));
    this.slideCount = this.slides.length;
    this.slides.forEach((slide, i) => {
      slide.active = i === this.index;
    });
  }

  updated(changedProperties) {
    if (changedProperties.has("index")) {
      this.slides.forEach((slide, i) => {
        slide.active = i === this.index;
      });
    }
  }

  prevSlide() {
    this.index = this.index > 0 ? this.index - 1 : this.slideCount - 1;
  }

  nextSlide() {
    this.index = this.index < this.slideCount - 1 ? this.index + 1 : 0;
  }

  handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      this.prevSlide();
    } else if (e.key === "ArrowRight") {
      this.nextSlide();
    }
  }

  goToSlide(i) {
    this.index = i;
    this.dispatchEvent(new CustomEvent("slide-changed", {
      composed: true,
      bubbles: true,
      detail: { index: i },
    }));
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        padding: var(--ddd-spacing-8);
      }
      .play-list-outer {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-4);
        margin: 0;
      }
      .play-list-shell {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--ddd-theme-default-limestoneMaxLight);
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        overflow: hidden;
      }
      .navigation-button {
        background: none;
        color: var(--ddd-theme-default-beaverBlue);
        border: 2px solid var(--ddd-theme-default-beaverBlue);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        width: 48px;
        height: 48px;
        font-size: var(--ddd-font-size-l);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .navigation-button:hover {
        background-color: var(--ddd-theme-default-beaver80);
        color: white;
      }
      .play-list-body {
        flex: 1;
        display: flex;
        padding: var(--ddd-spacing-8) var(--ddd-spacing-8) 0;
        flex-direction: column;
      }
      .slide-viewport {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .play-list-footer {
        padding: 0 var(--ddd-spacing-8) var(--ddd-spacing-8);
        display: flex;
        justify-content: left;
        gap: var(--ddd-spacing-2);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <div class="play-list-outer">
          <button class="navigation-button" @click="${this.prevSlide}">&#8592;</button>
          <div class="play-list-shell" @keydown="${this.handleKeyDown}" tabindex="0"
              @indicator-clicked="${(e) => this.goToSlide(e.detail.index)}">
            <div class="play-list-body">
              <div class="slide-viewport">
                <slot></slot>
              </div>
            </div>
            <div class="play-list-footer">
              ${this.slides.map((_, i) => html`
                <play-list-indicator
                  index="${i}"
                  ?active="${i === this.index}">
                </play-list-indicator>
              `)}
            </div>
          </div>
          <button class="navigation-button" @click="${this.nextSlide}">&#8594;</button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject.tag, PlayListProject);