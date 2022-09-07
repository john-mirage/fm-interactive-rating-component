import "./main.css";

import WebRating from "@components/web-rating/web-rating";
import WebRatingForm from "@components/web-rating-form/web-rating-form";
import WebRatingCheckbox from "@components/web-rating-checkbox/web-rating-checkbox";
import WebRatingResult from "@components/web-rating-result/web-rating-result";

customElements.define("web-rating", WebRating);
customElements.define("web-rating-form", WebRatingForm);
customElements.define("web-rating-checkbox", WebRatingCheckbox);
customElements.define("web-rating-result", WebRatingResult);