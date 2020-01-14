// import {getRandomBool} from '../utils/common.js';
import {formatDate, formatTime} from '../utils/format.js';
import {EVENT_TYPES} from '../const.js';
import {Destinations, Offers} from '../mock/mock.js';
import {MODE} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {toUpperCaseFirstLetter, formatEventTypePlaceholder, getRandomIntegerNumber} from '../utils/common.js';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";
import moment from "moment";

const createDestinationsMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return `
        <option value="${destination.name}"></option>
      `;
    })
    .join(``);
};

const createEventTypesMarkup = (types, eventType) => {
  return types
    .map((type) => {
      return `
        <div class="event__type-item">
          <input
            id="event-type-${type}-1"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${type}" ${type === eventType ? `checked` : ``}
          >
          <label
            class="event__type-label  event__type-label--${type}"
            for="event-type-${type}-1"
          >
            ${toUpperCaseFirstLetter(type)}
          </label>
        </div>
      `;
    })
    .join(``);
};

const createOffersMarkup = (eventType, offers) => {
  const offersList = Offers.find((offer) => {
    return eventType === (offer.type);
  });

  return offersList.offers
    .map((offer) => {
      const isCheckedOffer = offers.some((it) => it.title === offer.title);
      const offerId = getRandomIntegerNumber(Date.now(), Date.now() + Math.random() * 1000);
      return `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${offerId}-1"
          type="checkbox"
          name="event-offer" ${isCheckedOffer ? `checked` : ``}
        >
        <label
          class="event__offer-label"
          for="event-offer-${offerId}-1"
        >
          <span class="event__offer-title">
            ${offer.title}
          </span>
            &plus;
            &euro;&nbsp;
          <span class="event__offer-price">
            ${offer.price}
          </span>
        </label>
      </div>
    `;
    })
    .join(``);
};

const createEventPhotosMarkup = (photos) => {
  return photos
    .map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    })
    .join(``);
};

const parseFormData = (form) => {
  const formData = new FormData(form);
  const description = form.querySelector(`.event__destination-description`).textContent;

  const offers = [...form.querySelectorAll(`.event__offer-checkbox`)]
    .filter((input) => input.checked)
    .map((offer) => {
      return {
        title: offer.parentElement.querySelector(`.event__offer-title`).textContent.trim(),
        price: parseInt(offer.parentElement.querySelector(`.event__offer-price`).textContent, 10)
      };
    });

  const photos = [...form.querySelectorAll(`.event__photo`)]
    .map((photo) => {
      return {
        src: photo.src,
        description: photo.alt
      };
    });

  return {
    type: formData.get(`event-type`),
    destination: {
      name: formData.get(`event-destination`),
      description,
      photos
    },
    offers,
    startDate: moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf(),
    endDate: moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf(),
    price: parseInt(formData.get(`event-price`), 10),
    isFavorite: formData.get(`event-favorite`) === `on`
  };
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, mode) {
    super();

    this._event = event;
    this._type = event.type;
    this._destination = Object.assign({}, event.destination);
    this._price = event.price;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._mode = mode;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();

    this._deleteButtonClickHandler = null;
    this._submitHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteClickHandler = null;

    this._isModeAdding = this._isModeAdding.bind(this);
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate && this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);

    const flatpickrOptions = {
      allowInput: true,
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      minDate: `today`
    };

    this._flatpickrStartDate = flatpickr(startDateElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.startDate
            }
        )
    );

    this._flatpickrEndDate = flatpickr(endDateElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.endDate
            }
        )
    );

  }

  _getFormElement() {
    const {offers, isFavorite} = this._event;
    const {name, description, photos} = this._destination;

    const photosMarkup = createEventPhotosMarkup(photos);
    const offersMarkup = createOffersMarkup(this._type, offers);

    const {TRANSFERS, ACTIVITIES} = EVENT_TYPES;
    const cities = createDestinationsMarkup(Destinations);

    return `<form class="${this._isModeAdding() ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event ${this._type} icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${createEventTypesMarkup(TRANSFERS, this._type)}
                  </fieldset>
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Activity</legend>
                  ${createEventTypesMarkup(ACTIVITIES, this._type)}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
              ${formatEventTypePlaceholder(this._type)}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
              <datalist id="destination-list-1">
                ${cities}
              </datalist>
            </div>
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">
                From
              </label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                value="${formatDate(this._startDate)} ${formatTime(this._startDate)}">
                &mdash;
              <label class="visually-hidden" for="event-end-time-1">
                To
              </label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                value="${formatDate(this._endDate)} ${formatTime(this._endDate)}">
            </div>
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
            </div>
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${this._isModeAdding() ? `Cancel` : `Delete`}</button>
            ${this._isModeAdding() ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
            <label class="event__favorite-btn" for="event-favorite-1">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </label>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>`}
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
              ${offersMarkup}
            </section>
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${photosMarkup}
                </div>
              </div>
            </section>
          </section>
        </form>
    `;
  }

  _isModeAdding() {
    return this._mode === MODE.ADDING;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._type = evt.target.value;

        this.rerender();
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const destination = Destinations.find((it) => {
          return it.name === evt.target.value;
        });

        if (!destination) {
          return;
        }

        this._destination = destination;

        this.rerender();
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._price = parseInt(evt.target.value, 10);
      });

    element.querySelector(`#event-start-time-1`)
      .addEventListener(`change`, (evt) => {
        this._startDate = moment(evt.target.value, `DD/MM/YY HH:mm`).valueOf();
      });

    element.querySelector(`#event-end-time-1`)
      .addEventListener(`change`, (evt) => {
        this._endDate = moment(evt.target.value, `DD/MM/YY HH:mm`).valueOf();
      });
  }

  getData() {
    const form = this._isModeAdding() ? this.getElement() : this.getElement().querySelector(`.event--edit`);

    return parseFormData(form);
  }

  getTemplate() {
    if (this._isModeAdding()) {
      return this._getFormElement();
    }

    return `<li class="trip-events__item">${this._getFormElement()}</li>`;
  }


  recoveryListeners() {
    this.setSubmitClickHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }


  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;
    this._type = event.type;
    this._destination = Object.assign({}, event.destination);
    this._price = event.price;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this.rerender();
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoriteClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__favorite-checkbox`);

    if (element) {
      element.addEventListener(`change`, handler);
    }

    this._favoriteClickHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__rollup-btn`);

    if (element) {
      element.addEventListener(`click`, handler);
    }

    this._rollupButtonClickHandler = handler;
  }

  setSubmitClickHandler(handler) {
    const element = this._isModeAdding() ? this.getElement() : this.getElement().querySelector(`.event--edit`);
    element.addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }
}
