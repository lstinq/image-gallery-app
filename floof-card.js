import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class FloofCard extends DDDSuper(LitElement) {

    static get tag() {
        return "floof-card";
    }

    static get properties() {
        return {
            ...super.properties,
            image: { type: String },
            title: { type: String },
            liked: { type: Boolean, reflect: true },
            saved: { type: Boolean, reflect: true },
            copied: { type: Boolean, reflect: true },
            slideCount: { type: Number },
            activeIndex: { type: Number },
        };
    }

    constructor() {
        super();
        this.image = "";
        this.title = "";
        this.liked = false;
        this.saved = false;
        this.copied = false;
        this.slideCount = 0;
        this.activeIndex = 0;
    }

    toggleLike() {
        this.dispatchEvent(new CustomEvent("toggle-like", {
            bubbles: true,
            composed: true
        }));
    }

    toggleSave() {
        this.dispatchEvent(new CustomEvent("toggle-save", {
            bubbles: true,
            composed: true
        }));
    }

    shareSlide() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.copied = true;
            setTimeout(() => this.copied = false, 2000);
        });
    }

    goToSlide(i) {
        this.dispatchEvent(new CustomEvent("indicator-clicked", {
            bubbles: true,
            composed: true,
            detail: { index: i }
        }));
    }

    static get styles() {
        return [super.styles, css`
            :host {
                display: block;
                width: 100%;
                color-scheme: light dark;
            }
            .card {
                width: 100%;
                background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalGray));
            }
            .card-image {
                width: 100%;
                aspect-ratio: 1 / 1;
                object-fit: cover;
                display: block;
                max-height: 460px;
            }
            .card-indicators {
                display: flex;
                justify-content: center;
                gap: var(--ddd-spacing-2);
                padding: var(--ddd-spacing-4) 0;
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
                background-color: light-dark(var(--ddd-theme-default-beaverBlue), var(--ddd-theme-default-accent));
                opacity: 1;
            }
            .card-actions {
                display: flex;
                align-items: center;
                gap: var(--ddd-spacing-2);
                padding: var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-2);
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
            .share-button {
                color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
                font-size: var(--ddd-font-size-s);
                font-family: var(--ddd-font-navigation);
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
                    <button class="action-button share-button" @click="${this.shareSlide}">
                        ${this.copied ? "🔗 Link copied!" : "🔗 Share"}
                    </button>
                </div>

            </div>
        `;
    }
}

globalThis.customElements.define(FloofCard.tag, FloofCard);