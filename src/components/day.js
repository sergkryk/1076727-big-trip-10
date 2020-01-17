import AbstractComponent from './abstract-component';
import {formatFullDate, formatMonth, formatDay} from '../utils/format';

export default class TripDay extends AbstractComponent {
  constructor(date = null, index = 0) {
    super();
    this._date = date;
    this._index = index;
  }

  getTemplate() {
    const month = this._date ? formatMonth(this._date) : ``;
    const day = this._date ? formatDay(this._date) : ``;
    const datetime = this._date ? formatFullDate(this._date) : ``;

    return `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._index || ``}</span>
          <time class="day__date" datetime="${datetime}">
            ${month} ${day}
          </time>
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>
    `;
  }
}
