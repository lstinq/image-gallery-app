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
    this.postId = "";
    this.title = "";
    this.index = 0;
    this.slideCount = 0;
    this.slides = [];
    this.username = "";
    this.avatar = "";
    this.since = "";
    this.channel = "";
    this.caption = "";
    this.date = "";
    this.liked = false;
    this.saved = false;
    this.t = this.t || {};
    this.t = { ...this.t, title: "Title" };
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      postId: { type: String },
      title: { type: String },
      index: { type: Number, reflect: true },
      slideCount: { type: Number },
      slides: { type: Array },
      username: { type: String },
      avatar: { type: String },
      since: { type: String },
      channel: { type: String },
      caption: { type: String },
      date: { type: String },
      liked: { type: Boolean },
      saved: { type: Boolean },
    };
  }

  async firstUpdated() {
    const params = new URLSearchParams(window.location.search);
    const startIndex = parseInt(params.get("activeIndex")) || 0;
    const res = await fetch("/api/data");
    const data = await res.json();
    this.postId = data.postId;
    this.slides = data.slides;
    this.slideCount = this.slides.length;
    this.username = data.author.username;
    this.avatar = data.author.avatar;
    this.since = data.author.since;
    this.channel = data.author.channel;
    this.index = startIndex;
    this.liked = localStorage.getItem(`liked:${this.postId}`) === "true";
    this.saved = localStorage.getItem(`saved:${this.postId}`) === "true";
    this._updateMeta(startIndex);
  }

  toggleLike() {
    this.liked = !this.liked;
    localStorage.setItem(`liked:${this.postId}`, this.liked);
  }

  toggleSave() {
    this.saved = !this.saved;
    localStorage.setItem(`saved:${this.postId}`, this.saved);
  }

  _updateMeta(i) {
    const slide = this.slides[i];
    this.title = slide.title;
    this.caption = slide.description;
    this.date = slide.date;
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
    this._updateMeta(i);
    const url = new URL(window.location);
    url.searchParams.set("activeIndex", i);
    window.history.pushState({}, "", url);
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
        color-scheme: light dark;
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
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        overflow-y: hidden;
        width: min(460px, 100%);
        height: auto;
        min-height: 600px;
      }
      .image-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        aspect-ratio: 1 / 1;
        pointer-events: none;
        z-index: 10;
      }

      .navigation-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: all;
        z-index: 10;
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
        opacity: 0.75;
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
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      }
      .navigation-button:hover {
        color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
        background-color: light-dark(var(--ddd-theme-default-beaverBlue), var(--ddd-theme-default-accent));
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
        position: relative;
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
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
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
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      }
      .gallery-channel {
        display: block;
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-limestoneGray);
      }
      .gallery-since {
        display: block;
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-limestoneGray);
      }
      .gallery-title {
        display: block;
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-limestoneGray);
      }
      .gallery-caption {
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4) 0;
        font-size: var(--ddd-font-size-s);
        flex-shrink: 0;
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      }
      .gallery-caption-username {
        font-weight: var(--ddd-font-weight-bold);
        margin-right: var(--ddd-spacing-1);
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      }
      .gallery-date {
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-limestoneGray);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-4);
        flex-shrink: 0;
      }
      @media (max-width: 500px) {
        .wrapper {
          padding: var(--ddd-spacing-2);
        }
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

              <div class="gallery-header">
                <img class="avatar" src="${this.avatar}" alt="${this.username}"/>
                <div>
                  <span class="gallery-username">${this.username}</span>
                  <span class="gallery-channel">Channel: ${this.channel}</span>
                  <span class="gallery-since">User Since: ${this.since}</span>
                  <span class="gallery-title">Title: ${this.title}</span>
                </div>
              </div>

            <div class="play-list-body">
              <div class="image-container">
                <div class="image-wrapper">
                  <button class="navigation-button navigation-prev" @click="${this.prevSlide}">&#8592;</button>
                  <button class="navigation-button navigation-next" @click="${this.nextSlide}">&#8594;</button>
                </div>
                <div class="slide-viewport">
                  ${this.slides.length > 0 ? html`
                  <play-list-slide active>
                    <floof-card
                      .title="${this.slides[this.index].title}"
                      .image="${this.slides[this.index].thumbnail}"
                      .slideCount="${this.slideCount}"
                      .activeIndex="${this.index}"
                      .liked="${this.liked}"
                      .saved="${this.saved}"
                      @toggle-like="${this.toggleLike}"
                      @toggle-save="${this.toggleSave}">
                    </floof-card>
                  </play-list-slide>
                  ` : ''}
                </div>
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