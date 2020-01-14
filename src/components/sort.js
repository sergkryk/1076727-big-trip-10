import AbstractComponent from './abstract-component.js';
import {toUpperCaseFirstLetter} from '../utils/common.js';
import {SORT_TYPE} from '../const.js';

const createSortMarkup = (sortType) => {
  return Object.values(sortType)
    .map((type, index) => {
      return `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input
            id="sort-${type}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${type}"
            data-sort-type="${type}"
            ${index === 0 ? `checked` : ``}
          >
          <label
            class="trip-sort__btn"
            for="sort-${type}"
          >
            ${toUpperCaseFirstLetter(type)}
          </label>
        </div>
      `;
    })
    .join(``);
};

export default class SortForm extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SORT_TYPE.EVENT;
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${createSortMarkup(SORT_TYPE)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
       </form>
    `;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (this._currenSortType === evt.target.dataset.sortType) {
        return;
      }

      this._currenSortType = evt.target.dataset.sortType;

      this.getElement()
        .querySelector(`.trip-sort__item--day`)
        .textContent = this._currenSortType === SORT_TYPE.EVENT ? `Day` : ``;

      handler(this._currenSortType);
    });
  }
}
