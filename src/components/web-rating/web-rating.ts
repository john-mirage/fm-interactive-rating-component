import WebRatingForm from "@components/web-rating-form/web-rating-form";
import WebRatingResult from "@components/web-rating-result/web-rating-result";

class WebRating extends HTMLElement {
  #initialMount = true;
  webRatingForm: WebRatingForm;
  webRatingResult: WebRatingResult;

  static get observedAttributes() {
    return ["current-view"];
  }
  
  constructor() {
    super();
    this.webRatingForm = <WebRatingForm>document.createElement("web-rating-form");
    this.webRatingResult = <WebRatingResult>document.createElement("web-rating-result");
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
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "current-view":
        const hasCurrentView = newValue !== null;
        if (hasCurrentView) {
          this.updateCurrentView(newValue);
        } else {
          this.currentView = "form";
        }
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }

  updateCurrentView(newCurrentView: string) {
    switch (newCurrentView) {
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
}

export default WebRating;