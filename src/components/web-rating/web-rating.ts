import WebRatingForm from "@components/web-rating-form/web-rating-form";
import WebRatingResult from "@components/web-rating-result/web-rating-result";

const fadeAndScaleAnimation: Keyframe[] = [
  { opacity: 0, transform: "scale(0.9)", offset: 0 },
  { opacity: 1, transform: "scale(1)", offset: 1 }
];

const fadeAndScaleAnimationTimeline: KeyframeAnimationOptions = {
  duration: 300,
  fill: "backwards",
  easing: "ease-in-out",
};

const fadeOutAndTranslateAnimation: Keyframe[] = [
  { opacity: 1, transform: "translateY(0)", offset: 0 },
  { opacity: 0, transform: "translateY(-2rem)", offset: 1 }
];

const fadeOutAndTranslateAnimationTimeline: KeyframeAnimationOptions = {
  duration: 300,
  fill: "backwards",
  easing: "ease-in-out",
};

class WebRating extends HTMLElement {
  #initialMount = true;
  #initialAnimation = true;
  webRatingForm: WebRatingForm;
  webRatingResult: WebRatingResult;
  appOpeningKeyframes: KeyframeEffect;
  appUpdateKeyframes: KeyframeEffect;
  appAnimation: Animation;

  static get observedAttributes() {
    return ["current-view"];
  }
  
  constructor() {
    super();
    this.webRatingForm = <WebRatingForm>document.createElement("web-rating-form");
    this.webRatingResult = <WebRatingResult>document.createElement("web-rating-result");
    this.appOpeningKeyframes = new KeyframeEffect(this, fadeAndScaleAnimation, fadeAndScaleAnimationTimeline);
    this.appUpdateKeyframes = new KeyframeEffect(this, fadeOutAndTranslateAnimation, fadeOutAndTranslateAnimationTimeline);
    this.appAnimation = new Animation(this.appOpeningKeyframes, document.timeline);
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
    if (this.appAnimation.effect !== this.appOpeningKeyframes) {
      this.appAnimation.effect = this.appOpeningKeyframes;
    }
    this.removeEventListener("display-rating-form-view", this.handleRatingFormView);
    this.removeEventListener("display-rating-result-view", this.handleRatingResultView);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "current-view":
        const hasCurrentView = newValue !== null;
        if (hasCurrentView) {
          this.appAnimation.playbackRate = 1;
          if (this.#initialAnimation) {
            this.displayInitialView(newValue);
          } else {
            this.displayUpdatedView(newValue);
          }
        } else {
          this.currentView = "form";
        }
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }

  displayInitialView(initialView: string) {
    this.displayView(initialView);
    this.appAnimation.play();
    this.appAnimation.addEventListener("finish", () => {
      this.appAnimation.effect = this.appUpdateKeyframes;
      this.#initialAnimation = false;
    });
  }

  displayUpdatedView(updatedView: string) {
    this.appAnimation.play();
    this.appAnimation.addEventListener("finish", () => {
      this.appAnimation.playbackRate = -1;
      this.appAnimation.play();
      this.displayView(updatedView);
    }, { once: true });
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
    if (this.appAnimation.playState !== "running") {
      this.currentView = "form";
    } else {
      console.log("already animating");
    }
  }

  handleRatingResultView(customEvent: Event) {
    if (this.appAnimation.playState !== "running") {
      const { value } = (<CustomEvent>customEvent).detail;
      this.webRatingResult.value = value;
      this.currentView = "result";
    } else {
      console.log("already animating");
    }
  }
}

export default WebRating;