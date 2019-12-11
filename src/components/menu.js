import {createElement} from '../utils.js';

const createSiteMenuTemplate = (items) => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${items
        .map((item, index) => {
          return `<a class="trip-tabs__btn ${index === 0 ? `trip-tabs__btn--active` : ``}" href="#">${item}</a>`;
        })
        .join(`
  `)}
    </nav>
  `;
};

export default class SiteMenu {
  constructor(items) {
    this._element = null;
    this._items = items;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._items);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
