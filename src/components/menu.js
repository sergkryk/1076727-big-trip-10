import AbstractComponent from './abstract-component.js';
import {toUpperCaseFirstLetter} from '../utils/common.js';

const BUTTON_ACTIVE_CLASS = `trip-tabs__btn--active`;

const createMenuItemMarkup = ((item, isActive) => {
  const {name} = item;

  return `<a class="trip-tabs__btn ${isActive ? BUTTON_ACTIVE_CLASS : ``}" href="#" data-item-type="${name}">
  ${toUpperCaseFirstLetter(name)}
    </a>
  `;
});


export default class SiteMenu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
    this._currentItem = null;
  }

  getTemplate() {
    const menuItemsMarkup = this._items
       .map((item) => createMenuItemMarkup(item, item.active))
       .join(``);

    return `<nav class="trip-controls__trip-tabs  trip-tabs">${menuItemsMarkup}</nav>`;
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`a`);
    items.forEach((item) => item.classList.remove(BUTTON_ACTIVE_CLASS));

    this._currentItem = [...items].find((item) => item.dataset.itemType === menuItem);
    this._currentItem.classList.add(BUTTON_ACTIVE_CLASS);
  }

  setItemClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._currentItem = evt.target;

      if (this._currentItem.tagName !== `A`) {
        return;
      }

      if (this._currentItem.classList.contains(BUTTON_ACTIVE_CLASS)) {
        return;
      }

      handler(evt.target.dataset.itemType);
    });
  }
}
