import AbstractComponent from './abstract-component.js';

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

export default class SiteMenu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._items);
  }
}
