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
    this.slideCount = 0;
    this.slides = [];
    this.username = "";
    this.avatar = "";
    this.caption = "";
    this.date = "";
    this.t = this.t || {};
    this.t = { ...this.t, title: "Title" };
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      index: { type: Number, reflect: true },
      slideCount: { type: Number },
      slides: { type: Array },
      username: { type: String },
      avatar: { type: String },
      caption: { type: String },
      date: { type: String },
    };
  }

  async firstUpdated() {
    const params = new URLSearchParams(window.location.search);
    const startIndex = parseInt(params.get("activeIndex")) || 0;
    const res = await fetch("/api/data");
    const data = await res.json();
    this.slides = data.slides;
    this.slideCount = this.slides.length;
    this.index = startIndex;
    this.username = data.slides[0].username;
    this.avatar = data.slides[0].avatar;
    this.caption = data.slides[0].description;
    this.date = data.slides[0].date;
  }

  prevSlide() {
    if (this.index > 0) {
      this.goToSlide(this.index - 1);
    }
  }

  nextSlide() {
    if (this.index < this.slideCount - 1) {
      this.goToSlide(this.index + 1);
    }
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
    const url = new URL(window.location);
    url.searchParams.set("activeIndex", i);
    window.history.pushState({}, "", url);
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
        justify-content: center;
        gap: var(--ddd-spacing-4);
        margin: 0;
      }
      .play-list-shell {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        overflow-y: hidden;
        width: 460px;
        height: 720px;
      }
      .navigation-button {
        position: absolute;
        top: calc(60px + 230px);
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(255, 255, 255, 0.75);
        color: var(--ddd-theme-default-beaverBlue);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: var(--ddd-font-size-m);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      }
      .navigation-button:hover {
        color: var(--ddd-theme-default-white);
        background-color: var(--ddd-theme-default-beaver80);
      }
      .navigation-prev {
        left: var(--ddd-spacing-4);
      }
      .navigation-next {
        right: var(--ddd-spacing-4);
      }
      .play-list-body {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        padding: 0;
        overflow: hidden;
      }
      .slide-viewport {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      .gallery-header {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-4) var(--ddd-spacing-4);
        flex-shrink: 0;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--ddd-theme-default-beaverBlue);
      }
      .gallery-username {
        font-weight: var(--ddd-font-weight-bold);
        font-size: var(--ddd-font-size-s);
      }
      .gallery-caption {
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4) 0;
        font-size: var(--ddd-font-size-s);
        flex-shrink: 0;
      }
      .gallery-caption-username {
        font-weight: var(--ddd-font-weight-bold);
        margin-right: var(--ddd-spacing-1);
      }
      .gallery-date {
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-limestoneGray);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-2);
        flex-shrink: 0;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <div class="play-list-outer">
          <div class="play-list-shell" @keydown="${this.handleKeyDown}" tabindex="0"
              @indicator-clicked="${(e) => this.goToSlide(e.detail.index)}">
              
              <button class="navigation-button navigation-prev" @click="${this.prevSlide}">&#8592;</button>
              <button class="navigation-button navigation-next" @click="${this.nextSlide}">&#8594;</button>

              <div class="gallery-header">
                <img class="avatar" src="${this.avatar}" alt="${this.username}"/>
                <span class="gallery-username">${this.username}</span>
              </div>

            <div class="play-list-body">
              <div class="slide-viewport">
                ${this.slides.map((slide, i) => html`
                  <play-list-slide ?active="${i === this.index}">
                    <floof-card
                      .slideId="${slide.id}"
                      .image="${slide.image}"
                      .title="${slide.title}"
                      .slideCount="${this.slideCount}"
                      .activeIndex="${this.index}">
                    </floof-card>
                  </play-list-slide>
                `)}
              </div>
            </div>

            <div class="gallery-caption">
              <span class="gallery-caption-username">${this.username}</span>
              ${this.caption}
            </div>
            <div class="gallery-date">${this.date}</div>

          </div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject.tag, PlayListProject);