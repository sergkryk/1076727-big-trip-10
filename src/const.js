import nanoid from 'nanoid';

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const AUTHORIZATION = `Basic ${nanoid()}`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

export const DEBOUNCE_TIMEOUT = 500;

export const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const EVENTS_COUNT = 5;

export const EVENT_TYPES = {
  TRANSFERS: [
    `bus`,
    `drive`,
    `flight`,
    `ship`,
    `taxi`,
    `train`,
    `transport`
  ],
  ACTIVITIES: [
    `check-in`,
    `restaurant`,
    `sightseeing`
  ]
};

export const emojiMap = {
  'bus': `🚌`,
  'check-in': `🏨`,
  'drive': `🚗`,
  'flight': `✈️`,
  'restaurant': `🍽️`,
  'ship': `🚢`,
  'sightseeing': `🏛️`,
  'taxi': `🚕`,
  'train': `🚂`,
  'transport': `🚊`
};

export const CITIES = [
  `Amsterdam`,
  `Rotterdam`,
  `Berlin`,
  `Vienna`,
  `Prague`,
  `Paris`
];

export const OFFERS = [
  {
    title: `Add luggage`,
    price: 10
  },
  {
    title: `Switch to comfort class`,
    price: 150
  },
  {
    title: `Add meal`,
    price: 2
  },
  {
    title: `Choose seats`,
    price: 9
  },
  {
    title: `Travel by train`,
    price: 40
  }
];

export const HIDDEN_CLASS = `visually-hidden`;

export const MODE = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const SORT_TYPE = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const FILTERS = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MENU_ITEMS = {
  TABLE: `table`,
  STATS: `stats`
};

export const ChartTitle = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPENT: `time spent`
};

export const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

export const EMPTY_EVENT = {
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    pictures: [{
      src: ``,
      description: ``
    }]
  },
  offers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const DefaultButtonText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  CANCEL: `Cancel`
};

export const ActionButtonText = {
  SAVE: `Saving...`,
  DELETE: `Deleting...`
};
