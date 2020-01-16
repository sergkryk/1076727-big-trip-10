import nanoid from "nanoid";
import EventModel from "../models/event-model.js";

const getSyncedEvents = (items) => items
  .filter(({
    success
  }) => success)
  .map(({
    payload
  }) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

  createEvent(event) {
    const events = this._store.getAll().points;

    if (this._isOnLine()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItem(`points`, [].concat(events, newEvent.toRAW()));

          return newEvent;
        });
    }

    const fakeNewEventId = nanoid();
    const fakeNewEvent = EventModel.parseEvent(
        Object.assign({}, event.toRAW(), {
          id: fakeNewEventId
        }));

    this._isSynchronized = false;

    this._store.setItem(`points`, [].concat(events, fakeNewEvent.toRAW()));

    return Promise.resolve(fakeNewEvent);
  }

  deleteEvent(id) {
    const events = this._store.getAll().points;

    if (this._isOnLine()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.setItem(`points`, events.filter((point) => point.id !== id));
        });
    }

    this._isSynchronized = false;

    this._store.setItem(`points`, events.filter((point) => point.id !== id));

    return Promise.resolve();
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(`destinations`, destinations);

          return destinations;
        });
    }

    const destinations = this._store.getAll().destinations;

    return Promise.resolve(destinations);
  }

  getEvents() {
    if (this._isOnLine()) {
      return this._api.getEvents()
        .then((events) => {
          this._store.setItem(`points`, events.map((event) => event.toRAW()));

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getAll().points);

    this._isSynchronized = false;

    return Promise.resolve(EventModel.parseEvents(storeEvents));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(`offers`, offers);

          return offers;
        });
    }

    const offers = this._store.getAll().offers;

    return Promise.resolve(offers);
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  sync() {
    if (this._isOnLine()) {
      const storeEvents = Object.values(this._store.getAll().points);

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);

          this._store.setItem(`points`, [...updatedEvents, ...createdEvents]);

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  updateEvent(id, event) {
    const events = this._store.getAll().points;
    const index = events.findIndex((point) => point.id === id);

    if (this._isOnLine()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {

          this._store.setItem(
              `points`,
              [].concat(
                  events.slice(0, index),
                  newEvent.toRAW(),
                  events.slice(index + 1)
              )
          );

          return newEvent;
        });
    }

    const fakeUpdatedEvent = EventModel.parseEvent(
        Object.assign({}, event.toRAW(), {
          id
        }));

    this._isSynchronized = false;

    this._store.setItem(
        `points`,
        [].concat(
            events.slice(0, index),
            fakeUpdatedEvent.toRAW(),
            events.slice(index + 1)
        )
    );

    return Promise.resolve(fakeUpdatedEvent);
  }
}
