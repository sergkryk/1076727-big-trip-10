import {createElement} from '../utils.js';

const createTripDayTemplate = (date, index) => {
  const day = new Date(date);
  const month = day.toLocaleString(`en`, {month: `short`});
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${date}">${month} ${day.getDate()}</time>
      </div>
      <ul class="trip-events__list">
    </ul>
    </li>
  `;
};

export default class TripDay {
  constructor(date, index) {
    this._date = date;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._index);
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
