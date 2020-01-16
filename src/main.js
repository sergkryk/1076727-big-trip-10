import Api from './api/api.js';
import TripController from './controllers/trip-controller.js';
import StatisticsComponent from './components/statistics.js';
import FilterController from './controllers/filter-controller.js';
import EventsModel from './models/events-model.js';
import LoadEvents from './components/load-events.js';
import SiteMenuComponent from './components/menu.js';
import {renderElement, removeElement, RenderPosition} from './utils/render.js';
import {MenuItem, AUTHORIZATION, END_POINT} from './const.js';

const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageMainElement = document.querySelector(`.page-main`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();

const menuItems = Object.values(MenuItem)
   .map((item) => {
     return {
       name: item,
       active: item === MenuItem.TABLE
     };
   });

const menuComponent = new SiteMenuComponent(menuItems);
const filterController = new FilterController(tripControlsElement, eventsModel);
const tripController = new TripController(tripEventsElement, eventsModel, api);
const loadEvents = new LoadEvents();
const statisticsComponent = new StatisticsComponent(eventsModel);

renderElement(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
filterController.render();
renderElement(tripEventsElement, loadEvents);
renderElement(pageMainElement.querySelector(`.page-body__container`), statisticsComponent);

statisticsComponent.hide();

document.querySelector(`.trip-main__event-add-btn`)
   .addEventListener(`click`, () => {
     tripController.createEvent();
   });

menuComponent.setItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});

Promise.all([api.getDestinations(), api.getOffers(), api.getEvents()])
   .then((response) => {
     const [destinations, offers, events] = response;
     tripController.setDestinations(destinations);
     tripController.setOffers(offers);
     eventsModel.setEvents(events);
     tripController.render();
     removeElement(loadEvents);
   });
