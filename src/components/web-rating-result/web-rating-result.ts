class WebRatingResult extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  templateFragment: DocumentFragment;
  valueElement: HTMLSpanElement;
  
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    const template = <HTMLTemplateElement>document.getElementById("template-web-rating-result");
    this.templateFragment = <DocumentFragment>template.content.cloneNode(true);
    this.valueElement = <HTMLSpanElement>this.templateFragment.querySelector("#wrr-value");
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
      this.classList.add("web-rating-result");
      this.append(this.templateFragment);
      this.#initialMount = false;
    }
    this.upgradeProperty("value");
  }
  
  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "value":
        this.valueElement.textContent = newValue;
        break;
      default:
        throw new Error("The modified attribute is not observed");
    }
  }
}

export default WebRatingResult;