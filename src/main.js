import {createTripInfoTemplate} from './components/trip-info.js';
import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterFormTemplate} from './components/filter.js';
import {createSortFormTemplate} from './components/sort.js';
import {createEventEditTemplate} from './components/event-edit.js';
import {createTripDaysListTemplate} from './components/trip-days-list.js';
import {createEventsListItemTemplate} from './components/event.js';
import {render} from './utils.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {generateEvents} from './mock/mock.js';

const EVENTS_COUNT = 4;

const events = generateEvents(EVENTS_COUNT);

const getEvents = () => {
  return events
    .slice(1, EVENTS_COUNT)
    .map((event) => createEventsListItemTemplate(event))
    .join(``);
};

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripInfo, createTripInfoTemplate(events), `afterbegin`);
render(tripMenu.firstElementChild, createSiteMenuTemplate(MENU_ITEMS), `afterend`);
render(tripMenu, createFilterFormTemplate(FILTERS));
render(tripEvents, createSortFormTemplate());
render(tripEvents, createTripDaysListTemplate());

const tripDay = document.querySelector(`.trip-days__item`);
const tripEventsList = tripDay.querySelector(`.trip-events__list`);

render(tripEventsList, createEventEditTemplate(events[0]));
render(tripEventsList, getEvents());

const tripCost = events.reduce((acc, value) => acc + value.price, 0);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;
