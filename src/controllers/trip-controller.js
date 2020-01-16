import {formatFullDate} from '../utils/format.js';
import TripDayComponent from '../components/day.js';
import TripInfoComponent from '../components/trip-info.js';
import EventController from '../controllers/event-controller.js';
import SortFormComponent from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import TripDaysListComponent from '../components/trip-days-list.js';
import {renderElement, RenderPosition, removeElement} from '../utils/render.js';
import {SORT_TYPE, MODE, EMPTY_EVENT} from '../const.js';

const HIDDEN_CLASS = `visually-hidden`;

const renderEvents = (container, events, onDataChange, onViewChange, destinations, offers, isSorted = true) => {
  const eventControllers = [];

  const days = isSorted
    ? [...new Set(events.map((item) => formatFullDate(item.startDate)))]
    : [true];

  days.forEach((date, dateIndex) => {
    const tripDayComponent = isSorted
      ? new TripDayComponent(date, dateIndex + 1)
      : new TripDayComponent();

    renderElement(container, tripDayComponent);

    events
      .filter((event) => isSorted
        ? formatFullDate(event.startDate) === date
        : event)
      .forEach((event) => {
        const eventController = new EventController(tripDayComponent.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange, destinations, offers);

        eventController.render(event, MODE.DEFAULT);
        eventControllers.push(eventController);
      });
  });
  return eventControllers;
};


export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;

    this._eventControllers = [];
    this._eventsModel = eventsModel;
    this._isSorted = true;
    this._activeSortType = SORT_TYPE.EVENT;
    this._creatingEvent = null;
    this._api = api;

    this._destinations = [];
    this._offers = [];

    this._noEventsComponent = null;
    this._tripDaysList = new TripDaysListComponent();
    this._sortComponent = new SortFormComponent();
    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _calculateTotalTripCost() {
    const totalPrice = this._eventsModel.getEvents()
      .reduce((totalCost, value) => totalCost + value.price +
        value.offers
          .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0),
      0);
    document.querySelector(`.trip-info__cost-value`).textContent = totalPrice;
  }

  _createNoEventsComponent() {
    this._noEventsComponent = new NoEventsComponent();
    renderElement(this._container, this._noEventsComponent);

    this._removeTripSortComponent();
  }

  _createTripSortComponent() {
    if (!this._sortComponent) {
      this._sortComponent = new SortFormComponent();
    }

    renderElement(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _onDataChange(eventController, oldData, newData) {
    if (oldData === EMPTY_EVENT) {
      this._creatingEvent = null;

      if (newData === null) {
        eventController.destroy();

        if (eventController.getMode() === MODE.ADDING) {
          this._toggleNoEventsComponent();
        }

        if (eventController.getMode() !== MODE.ADDING) {
          this._updateEvents();
        }
      } else {
        eventController.blockEditForm();

        this._api.createEvent(newData)
           .then((eventModel) => {
             this._eventsModel.addEvent(eventModel);
             eventController.render(eventModel, MODE.DEFAULT);

             this._eventControllers = [].concat(eventController, this._eventControllers);

             this._createTripSortComponent();

             this._removeEvents();
             this._renderEvents(this._eventsModel.getEvents());
           })
           .catch(() => {
             eventController.shake();
           });
      }
    } else if (newData === null) {
      eventController.blockEditForm();

      this._api.deleteEvent(oldData.id)
         .then(() => {
           this._eventsModel.removeEvent(oldData.id);
           this._updateEvents();
           this._toggleNoEventsComponent();
         })
          .catch(() => {
            eventController.shake();
          });
    } else {
      eventController.blockEditForm();

      this._api.updateEvent(oldData.id, newData)
         .then((eventModel) => {
           const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);

           if (isSuccess) {
             eventController.render(eventModel, MODE.DEFAULT);
             this._updateEvents();
           }
         })
          .catch(() => {
            eventController.shake();
          });
    }

    this._calculateTotalTripCost();
  }

  _onFilterChange() {
    this._updateEvents();
    this._onSortTypeChange(this._activeSortType);
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const events = this._eventsModel.getEvents();

    this._activeSortType = sortType;
    this._isSorted = sortType === SORT_TYPE.EVENT;

    switch (sortType) {
      case SORT_TYPE.EVENT:
        sortedEvents = events.slice().sort((a, b) => a.startDate - b.startDate);
        break;
      case SORT_TYPE.TIME:
        sortedEvents = events.slice().sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
        break;
      case SORT_TYPE.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
        break;
    }
    this._removeEvents();
    this._renderEvents(sortedEvents);
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());
  }

  _removeEvents() {
    this._tripDaysList.getElement().innerHTML = ``;
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _removeNoEventsComponent() {
    if (this._noEventsComponent) {
      removeElement(this._noEventsComponent);
      this._noEventsComponent = null;
    }
  }

  _removeTripSortComponent() {
    if (this._sortComponent) {
      removeElement(this._sortComponent);
      this._sortComponent = null;
    }
  }

  _renderEvents(events) {
    this._eventControllers = renderEvents(
        this._tripDaysList.getElement(),
        events,
        this._onDataChange,
        this._onViewChange,
        this._destinations,
        this._offers,
        this._isSorted
    );

    this._tripInfoComponent.rerender(this._eventsModel.getEventsAll());
    this._calculateTotalTripCost();
  }

  _toggleNoEventsComponent() {
    if (this._eventsModel.isNoEvents()) {
      // this._noEventsComponent = new NoEventsComponent();
      // renderElement(this._container, this._noEventsComponent);

      // removeElement(this._sortComponent);
      // this._sortComponent = null;
      this._createNoEventsComponent();
    } else {
      this._removeNoEventsComponent();
    }
  }

  _updateEvents() {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents());
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const container = this._eventsModel.isNoEvents()
      ? document.querySelector(`.trip-events h2`)
      : this._sortComponent.getElement();


    this._eventControllers.forEach((it) => it.setDefaultView());

    // this._renderSortComponent();
    if (!this._eventsModel.isNoEvents()) {
      this._createTripSortComponent();
    }
    this._removeNoEventsComponent();

    this._creatingEvent = new EventController(
        container,
        this._onDataChange,
        this._onViewChange,
        this._destinations,
        this._offers
    );

    this._creatingEvent.render(EMPTY_EVENT, MODE.ADDING);

    EMPTY_EVENT.id = String(Math.round(Date.now() * Math.random()));
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEvents();

    const tripInfo = document.querySelector(`.trip-main__trip-info`);
    this._tripInfoComponent = new TripInfoComponent(this._eventsModel.getEventsAll());
    renderElement(tripInfo, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    // this._renderSortComponent();
    renderElement(container, this._tripDaysList);

    this._createTripSortComponent();
    this._toggleNoEventsComponent();
    this._renderEvents(events);

    tripInfo.querySelector(`.trip-info__cost-value`).textContent = events
    .reduce((totalCost, value) => totalCost + value.price + value.offers
    .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0), 0);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }


  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }
}
