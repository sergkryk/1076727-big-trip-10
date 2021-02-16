import {createTripInfoTemplate} from './components/trip-info';
import {createTripControlsTemplate} from './components/trip-controls';
import {createFilterTemplate} from './components/filter';
import {createSortingTemplate} from './components/sorting';
import {createTripDaysTemplate} from './components/trip-days';
import {createTripDayTemplate} from './components/trip-day';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfo = document.querySelector('.trip-info');
const tripControls = document.querySelector('.trip-controls');
const tripEvents = document.querySelector('.trip-events');

render(tripInfo, createTripInfoTemplate(), 'afterbegin');
render(tripControls, createTripControlsTemplate(), 'afterbegin');
render(tripControls, createFilterTemplate(), 'beforeend');
render(tripEvents, createSortingTemplate(), 'afterbegin');
render(tripEvents, createTripDaysTemplate(), 'beforeend');

const tripDays = document.querySelector('.trip-days');
render(tripDays, createTripDayTemplate(), 'afterbegin');


