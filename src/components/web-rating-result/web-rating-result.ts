class WebRatingResult extends HTMLElement {
  #initialMount = true;
  
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.#initialMount = false;
    }
  }
}

export default WebRatingResult;