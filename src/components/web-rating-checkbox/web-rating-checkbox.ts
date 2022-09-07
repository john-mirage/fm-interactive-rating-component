class WebRatingCheckbox extends HTMLElement {
  #initialMount = true;
  templateFragment: DocumentFragment;
  inputElement: HTMLInputElement;
  labelElement: HTMLLabelElement;
  
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    const template = <HTMLTemplateElement>document.getElementById("template-web-rating-checkbox");
    this.templateFragment = <DocumentFragment>template.content.cloneNode(true);
    this.inputElement = <HTMLInputElement>this.templateFragment.querySelector("#wrc-input");
    this.labelElement = <HTMLLabelElement>this.templateFragment.querySelector("#wrc-label");
    this.handleInputEnterKey = this.handleInputEnterKey.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
      this.classList.add("web-rating-checkbox");
      this.append(this.templateFragment);
      this.#initialMount = false;
    }
    this.inputElement.setAttribute("id", `wrc-input-${this.value}`);
    this.labelElement.setAttribute("id", `wrc-label-${this.value}`);
    this.labelElement.setAttribute("for", `wrc-input-${this.value}`);
    this.inputElement.addEventListener("keydown", this.handleInputEnterKey);
    this.inputElement.addEventListener("change", this.handleInputChange);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("keydown", this.handleInputEnterKey);
    this.inputElement.removeEventListener("change", this.handleInputChange);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "value":
        this.labelElement.textContent = newValue;
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }

  handleInputEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.inputElement.checked) {
      this.inputElement.checked = true;
    }
  }

  handleInputChange() {
    const customEvent = new CustomEvent("update-current-rating", {
      bubbles: true,
      detail: { value: this.value }
    });
    this.dispatchEvent(customEvent);
  }
}

export default WebRatingCheckbox;