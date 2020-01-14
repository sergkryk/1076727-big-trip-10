const EVENTS_COUNT = 10;

const EVENT_TYPES = {
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

const CITIES = [
  `Amsterdam`,
  `Rotterdam`,
  `Berlin`,
  `Vienna`,
  `Prague`,
  `Paris`
];

const OFFERS = [
  {
    // type: `luggage`,
    title: `Add luggage`,
    price: 10
  },
  {
    // type: `comfort`,
    title: `Switch to comfort class`,
    price: 150
  },
  {
    // type: `meal`,
    title: `Add meal`,
    price: 2
  },
  {
    // type: `seats`,
    title: `Choose seats`,
    price: 9
  },
  {
    // type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

const SORT_TYPE = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const MODE = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const FILTERS = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MENU_ITEMS = [
  `Table`,
  `Stats`
];

const DESCRIPTIONS = [
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

const EMPTY_POINT = {
  id: String(new Date() + Math.random()),
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


export {EVENT_TYPES, CITIES, OFFERS, FILTERS, MENU_ITEMS, DESCRIPTIONS, EVENTS_COUNT, SORT_TYPE, MODE, EMPTY_POINT};
