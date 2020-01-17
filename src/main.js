import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
import TripController from './controllers/trip-controller';
import FilterController from './controllers/filter-controller';
import StatisticsController from './controllers/statistics-controller';
import SiteMenuComponent from './components/menu';
import LoadEvents from './components/load-events';
import EventsModel from './models/events-model';
import EventModel from './models/event-model';
import {renderElement, removeElement, RenderPosition} from './utils/render';
import {MenuItem, AUTHORIZATION, END_POINT, STORE_NAME} from './const';


const tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageMainElement = document.querySelector(`.page-main`);
const bodyContainerElement = pageMainElement.querySelector(`.page-body__container`);
const eventAddButtonElement = document.querySelector(`.trip-main__event-add-btn`);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch((err) => {
      throw new Error(err);
    });
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

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
const tripController = new TripController(tripEventsElement, eventsModel, apiWithProvider);
const statisticsController = new StatisticsController(bodyContainerElement, eventsModel);
const loadEvents = new LoadEvents();

renderElement(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
filterController.render();
renderElement(tripEventsElement, loadEvents);

eventAddButtonElement.addEventListener(`click`, () => {
  tripController.createEvent();
});

menuComponent.setItemClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      filterController.hide();
      tripController.hide();
      statisticsController.show();
      break;
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      filterController.show();
      statisticsController.hide();
      tripController.show();
      break;
  }
});

Promise.all([apiWithProvider.getDestinations(), apiWithProvider.getOffers(), apiWithProvider.getEvents()])
   .then((response) => {
     const [destinations, offers, events] = response;

     tripController.setDestinations(destinations);
     tripController.setOffers(offers);
     eventsModel.setEvents(events);
     tripController.render();
     removeElement(loadEvents);
     statisticsController.render();
     statisticsController.hide();
   });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
    .then((events) => {
      eventsModel.setEvents(EventModel.parseEvents(events));
      tripController.updateEvents();
    })
    .catch((err) => {
      throw new Error(err);
    });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
