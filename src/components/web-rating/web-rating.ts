import WebRatingForm from "@components/web-rating-form/web-rating-form";
import WebRatingResult from "@components/web-rating-result/web-rating-result";
import { gsap } from "gsap";

class WebRating extends HTMLElement {
  #initialMount = true;
  #initialAnimation = true;
  webRatingForm: WebRatingForm;
  webRatingResult: WebRatingResult;

  static get observedAttributes() {
    return ["current-view"];
  }
  
  constructor() {
    super();
    this.webRatingForm = <WebRatingForm>document.createElement("web-rating-form");
    this.webRatingResult = <WebRatingResult>document.createElement("web-rating-result");
    this.handleRatingFormView = this.handleRatingFormView.bind(this);
    this.handleRatingResultView = this.handleRatingResultView.bind(this);
  }

  get currentView(): string | null {
    return this.getAttribute("current-view");
  }

  set currentView(currentView: string | null) {
    const hasCurrentView = currentView !== null;
    if (hasCurrentView) {
      this.setAttribute("current-view", currentView);
    } else {
      this.removeAttribute("current-view");
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add("web-rating");
      this.#initialMount = false;
    }
    if (this.currentView === null) {
      this.currentView = "form";
    }
    this.addEventListener("display-rating-form-view", this.handleRatingFormView);
    this.addEventListener("display-rating-result-view", this.handleRatingResultView);
  }

  disconnectedCallback() {
    this.removeEventListener("display-rating-form-view", this.handleRatingFormView);
    this.removeEventListener("display-rating-result-view", this.handleRatingResultView);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "current-view":
        const hasCurrentView = newValue !== null;
        if (hasCurrentView) {
          if (this.#initialAnimation) {
            this.displayView(newValue);
            this.#initialAnimation = false;
          } else {
            this.displayViewWithAnimation(newValue);
          }
        } else {
          this.currentView = "form";
        }
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }

  displayViewWithAnimation(updatedView: string) {
    gsap.to(this, {
      y: -24,
      opacity: 0,
      ease: "back",
      duration: 0.3,
      onComplete: () => {
        gsap.to(this, {
          y: 0,
          opacity: 1,
          ease: "back",
          duration: 0.3,
        });
        this.displayView(updatedView);
      }
    });
  }
  
  displayView(view: string) {
    switch (view) {
      case "form":
        this.replaceChildren(this.webRatingForm);
        break;
      case "result":
        this.replaceChildren(this.webRatingResult);
        break;
      default:
        throw new Error("The new current view is not valid");
    }
  }

  handleRatingFormView() {
    this.currentView = "form";
  }

  handleRatingResultView(customEvent: Event) {
    const { value } = (<CustomEvent>customEvent).detail;
    this.webRatingResult.value = value;
    this.currentView = "result";
  }
}

export default WebRating;