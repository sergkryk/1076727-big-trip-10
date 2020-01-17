import EventComponent from '../components/event';
import EventEditComponent from '../components/event-edit';
import {renderElement, replaceElement, removeElement, RenderPosition} from '../utils/render';
import {MODE, EMPTY_EVENT, DefaultButtonText, ActionButtonText} from '../const';
import EventModel from '../models/event-model';
import moment from "moment";
import he from 'he';

const SHAKE_ANIMATION_TIMEOUT = 600;

const parseFormData = (formData, destinations) => {
  const offers = formData.getAll(`event-offer`)
     .map((title) => {
       const input = document.querySelector(`input[value="${title}"]`);

       return {
         title,
         price: parseInt(input.dataset.offerPrice, 10)
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

  blockEditForm() {
    this._eventEditComponent.blockFormElements();
  }

  getMode() {
    return this._mode;
  }

  destroy() {
    removeElement(this._eventEditComponent);
    removeElement(this._eventComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(event, mode, isFavoriteChanged) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._mode, this._destinations, this._offers);

    this._eventComponent.setRollUpButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitClickHandler((evt) => {
      evt.preventDefault();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._destinations);

      this._eventEditComponent.setButtonText({
        SAVE: ActionButtonText.SAVE
      });

      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      if (mode === MODE.ADDING) {
        this._onDataChange(this, EMPTY_EVENT, null);
      } else {
        this._eventEditComponent.setButtonText({
          DELETE: ActionButtonText.DELETE
        });

        this._onDataChange(this, event, null);
      }
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent);
    });

    switch (mode) {
      case MODE.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replaceElement(this._eventComponent, oldEventComponent);
          replaceElement(this._eventEditComponent, oldEventEditComponent);

          if (!isFavoriteChanged) {
            this._replaceEditToEvent();
          }
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

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventEditComponent.getElement().style.outline = `2px solid red`;

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;

      this._eventEditComponent.setButtonText({
        SAVE: DefaultButtonText.SAVE,
        DELETE: DefaultButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceEditToEvent();
    }
  }
}
