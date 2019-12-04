import {createRouteInfoTemplate} from './components/route-info.js';
import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterFormTemplate} from './components/filter.js';
import {createSortFormTemplate} from './components/sort.js';
import {createEventEditFormTemplate} from './components/event-edit.js';
import {createDayListTemplate} from './components/days-list.js';
import {createDayListItemTemplate} from './components/events-list.js';
import {createEventsListItemTemplate} from './components/event.js';

const CARD_COUNT = 4;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const routeInfoSection = document.querySelector(`.trip-main__trip-info`);
const tripMenu = document.querySelector(`.trip-main__trip-controls`);
const tripEventsSection = document.querySelector(`.trip-events`);

render(routeInfoSection, createRouteInfoTemplate(), `afterbegin`);
render(tripMenu, createSiteMenuTemplate());
render(tripMenu, createFilterFormTemplate());
render(tripEventsSection, createSortFormTemplate());
render(tripEventsSection, createDayListTemplate());

const tripDaysList = document.querySelector(`.trip-days`);
render(tripDaysList, createDayListItemTemplate());

const tripEvents = tripEventsSection.querySelector(`.trip-events__list`);
new Array(CARD_COUNT)
  .fill(``)
  .forEach(
      () => render(tripEvents, createEventsListItemTemplate())
  );
const eventItem = tripEvents.querySelector(`.trip-events__item`);
eventItem.innerHTML = createEventEditFormTemplate();
