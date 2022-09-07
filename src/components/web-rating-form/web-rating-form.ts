class WebRatingForm extends HTMLElement {
  #initialMount = true;
  templateFragment: DocumentFragment;
  buttonElement: HTMLButtonElement;
  
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    const template = <HTMLTemplateElement>document.getElementById("template-web-rating-form");
    this.templateFragment = <DocumentFragment>template.content.cloneNode(true);
    this.buttonElement = <HTMLButtonElement>this.templateFragment.querySelector("#wrf-button");
    this.handleFormValue = this.handleFormValue.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  get value(): string | null {
    return this.getAttribute("value");
  }

  set value(value: string | null) {
    const hasValue = value !== null;
    if (hasValue) {
      this.setAttribute("value", value);
    } else {
      this.removeAttribute("value");
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add("web-rating-form");
      this.buttonElement.setAttribute("id", "wrf-submit-button");
      this.append(this.templateFragment);
      this.#initialMount = false;
    }
    this.updateFormState(this.value === null);
    this.addEventListener("update-current-rating", this.handleFormValue);
    this.buttonElement.addEventListener("click", this.handleFormSubmit);
  }

  disconnectedCallback() {
    this.removeEventListener("update-current-rating", this.handleFormValue);
    this.buttonElement.removeEventListener("click", this.handleFormSubmit);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "value":
        const hasValue = newValue !== null;
        this.updateFormState(!hasValue);
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }

  updateFormState(isDisabled: boolean) {
    if (isDisabled) {
      if (!this.buttonElement.hasAttribute("disabled")) {
        this.buttonElement.setAttribute("disabled", "");
      }
    } else if (this.buttonElement.hasAttribute("disabled")) {
      this.buttonElement.removeAttribute("disabled");
    }
  }

  handleFormValue(customEvent: Event) {
    const { value } = (<CustomEvent>customEvent).detail;
    this.value = value;
  }

  handleFormSubmit() {
    const customEvent = new CustomEvent("display-rating-result-view", {
      bubbles: true,
      detail: { value: this.value }
    });
    this.dispatchEvent(customEvent);
  }
}

export default WebRatingForm;