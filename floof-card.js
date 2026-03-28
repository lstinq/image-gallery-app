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
            slideId: { type: String },
            liked: { type: Boolean, reflect: true },
            saved: { type: Boolean, reflect: true },
            slideCount: { type: Number },
            activeIndex: { type: Number },
        };
    }

    constructor() {
        super();
        this.image = "";
        this.title = "";
        this.slideId = "";
        this.liked = false;
        this.saved = false;
        this._localStorageLoaded = false;
        this.slideCount = 0;
        this.activeIndex = 0;
    }

    updated(changedProperties) {
        if (changedProperties.has("slideId") && this.slideId && !this._localStorageLoaded) {
            this._localStorageLoaded = true;
            this.liked = localStorage.getItem(`liked:${this.slideId}`) === "true";
            this.saved = localStorage.getItem(`saved:${this.slideId}`) === "true";
        }
    }

    toggleLike() {
        this.liked = !this.liked;
        localStorage.setItem(`liked:${this.slideId}`, this.liked);
    }

    toggleSave() {
        this.saved = !this.saved;
        localStorage.setItem(`saved:${this.slideId}`, this.saved);
    }

    goToSlide(i) {
        this.dispatchEvent(new CustomEvent("indicator-clicked", {
            bubbles: true,
            composed: true,
            detail: { index: i },
        }));
    }

    static get styles() {
        return [super.styles, css`
            :host {
                display: block;
                width: 100%;
            }
            .card {
                width: 100%;
                background-color: var(--ddd-theme-default-white);
            }
            .card-image {
                width: 100%;
                aspect-ratio: 1 / 1;
                object-fit: cover;
                display: block;
                max-height: 460px;
            }
            .card-header {
                display: flex;
                align-items: center;
                gap: var(--ddd-spacing-4);
                padding: var(--ddd-spacing-4) var(--ddd-spacing-4);
            }
            .avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid var(--ddd-theme-default-beaverBlue);
            }
            .username {
                font-weight: var(--ddd-font-weight-bold);
                font-size: var(--ddd-font-size-s);
            }
            .card-actions {
                display: flex;
                align-items: center;
                gap: var(--ddd-spacing-2);
                padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
            }
            .action-button {
                background: none;
                border: none;
                cursor: pointer;
                justify-content: left;
                font-size: var(--ddd-font-size-s);
                padding: 0;
                line-height: 1;
            }
            .card-indicators {
                display: flex;
                justify-content: center;
                gap: var(--ddd-spacing-2);
                padding: var(--ddd-spacing-4) 0 var(--ddd-spacing-2);
            }
            .indicator-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: none;
                background-color: var(--ddd-theme-default-limestoneGray);
                opacity: 0.5;
                cursor: pointer;
                padding: 0;
            }
            .indicator-dot.active {
                background-color: var(--ddd-theme-default-beaverBlue);
                opacity: 1;
            }
        `];
    }

    render() {
        return html`
            <div class="card">
                <img class="card-image" src="${this.image}" alt="${this.title}" loading="lazy"/>


                <div class="card-indicators">
                    ${Array.from({ length: this.slideCount }, (_, i) => html`
                    <button
                        class="indicator-dot ${i === this.activeIndex ? 'active' : ''}"
                        @click="${() => this.goToSlide(i)}">
                    </button>
                    `)}
                </div>

                <div class="card-actions">
                    <button class="action-button like-button" @click="${this.toggleLike}">
                        ${this.liked ? "❤️" : "🤍"}
                    </button>
                    <button class="action-button save-button" @click="${this.toggleSave}">
                        ${this.saved ? "✅" : "💾"}
                    </button>
                </div>

            </div>
        `;
    }
}

globalThis.customElements.define(FloofCard.tag, FloofCard);