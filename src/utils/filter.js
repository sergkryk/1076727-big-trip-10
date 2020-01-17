import {FILTERS} from '../const';

export const getEverythingEvents = (events) => {
  return events.slice().sort((a, b) => a.startDate - b.startDate);
};

export const getFutureEvents = (events) => {
  return events.filter((event) => event.startDate > Date.now());
};

export const getPastEvents = (events) => {
  return events.filter((event) => event.startDate < Date.now());
};

export const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case FILTERS.EVERYTHING:
      return getEverythingEvents(events);
    case FILTERS.FUTURE:
      return getFutureEvents(events);
    case FILTERS.PAST:
      return getPastEvents(events);
  }

  return events;
};
