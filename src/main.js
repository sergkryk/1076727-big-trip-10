import {createTripInfoTemplate} from './components/trip-info.js';
import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterFormTemplate} from './components/filter.js';
import {createSortFormTemplate} from './components/sort.js';
import {createEventEditTemplate} from './components/event-edit.js';
import {createTripDaysListTemplate} from './components/trip-days-list.js';
import {createTripDayTemplate} from './components/day.js';
import {createEventsListItemTemplate} from './components/event.js';
import {render, createElement, renderElement} from './utils.js';
import {FILTERS, MENU_ITEMS} from './const.js';
import {events, dates} from './mock/mock.js';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripInfo, createTripInfoTemplate(events), `afterbegin`);
render(tripMenu.firstElementChild, createSiteMenuTemplate(MENU_ITEMS), `afterend`);
render(tripMenu, createFilterFormTemplate(FILTERS));
render(tripEvents, createSortFormTemplate());
render(tripEvents, createTripDaysListTemplate());

const tripDaysList = document.querySelector(`.trip-days`);

dates.forEach((date, dateIndex) => {
  const day = createElement(createTripDayTemplate(date, dateIndex));

  events
  .filter((_event) => new Date(_event.startDate).toDateString() === date)
  .forEach((_event, eventIndex) => {
    render(
        day.querySelector(`.trip-events__list`),
        eventIndex === 0 && dateIndex === 0 ? createEventEditTemplate(_event) : createEventsListItemTemplate(_event)
    );
  });
  renderElement(tripDaysList, day);
});

const tripCost = events.reduce((acc, value) => acc + value.price, 0);
tripInfo.querySelector(`.trip-info__cost-value`).textContent = tripCost;

