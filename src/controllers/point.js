import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {renderElement, replaceElement, removeElement, RenderPosition} from '../utils/render.js';
import {MODE, EMPTY_POINT} from '../const.js';

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = MODE.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === MODE.ADDING) {
        this._onDataChange(this, EMPTY_POINT, null);
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

  render(point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._mode = mode;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point, this._mode);

    this._eventComponent.setRollUpButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() =>
      this._onDataChange(this, point, null)
    );

    this._eventEditComponent.setSubmitClickHandler((evt) => {
      evt.preventDefault();

      const data = this._eventEditComponent.getData();
      this._onDataChange(this, point, Object.assign({}, data, {id: point.id}));
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => this._replaceEditToEvent());

    this._eventEditComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {isFavorite: !point.isFavorite}));
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
