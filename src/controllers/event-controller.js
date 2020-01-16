import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {renderElement, replaceElement, removeElement, RenderPosition} from '../utils/render.js';
import {MODE, EMPTY_EVENT} from '../const.js';
import EventModel from '../models/event-model.js';
import moment from "moment";
import he from 'he';

const parseFormData = (formData, destinations) => {
  const offers = [...document.querySelectorAll(`.event__offer-checkbox`)]
    .filter((input) => input.checked)
    .map((offer) => {
      return {
        title: offer.parentElement.querySelector(`.event__offer-title`).textContent.trim(),
        price: parseInt(offer.parentElement.querySelector(`.event__offer-price`).textContent, 10)
      };
    });

  const city = he.encode(formData.get(`event-destination`));
  const destination = destinations.find((item) => {
    return city === item.name;
  });

  const startDate = moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf();
  const endDate = moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf();

  return new EventModel({
    'type': formData.get(`event-type`),
    'destination': destination,
    'offers': offers,
    'date_from': moment(startDate).toISOString(),
    'date_to': moment(endDate).toISOString(),
    'base_price': parseInt(formData.get(`event-price`), 10),
    'is_favorite': formData.get(`event-favorite`) === `on`
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._destinations = destinations;
    this._offers = offers;

    this._mode = MODE.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === MODE.ADDING) {
        this._onDataChange(this, EMPTY_EVENT, null);
      }

      this._replaceEditToEvent();
    }
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();
    replaceElement(this._eventComponent, this._eventEditComponent);
    this._mode = MODE.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replaceElement(this._eventEditComponent, this._eventComponent);
    this._mode = MODE.EDIT;
  }

  destroy() {
    removeElement(this._eventEditComponent);
    removeElement(this._eventComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._mode, this._destinations, this._offers);

    this._eventComponent.setRollUpButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() =>
      this._onDataChange(this, event, null)
    );

    this._eventEditComponent.setSubmitClickHandler((evt) => {
      evt.preventDefault();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._destinations);

      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite}));
    });

    switch (mode) {
      case MODE.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replaceElement(this._eventComponent, oldEventComponent);
          replaceElement(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          renderElement(this._container, this._eventComponent);
        }
        break;
      case MODE.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          removeElement(oldEventComponent);
          removeElement(oldEventEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._eventEditComponent, RenderPosition.AFTEREND);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
