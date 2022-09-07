class WebRatingForm extends HTMLElement {
  #initialMount = true;
  templateFragment: DocumentFragment;
  
  constructor() {
    super();
    const template = <HTMLTemplateElement>document.getElementById("template-web-rating-form");
    this.templateFragment = <DocumentFragment>template.content.cloneNode(true);
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add("web-rating-form");
      this.append(this.templateFragment);
      this.#initialMount = false;
    }
  }
}

export default WebRatingForm;