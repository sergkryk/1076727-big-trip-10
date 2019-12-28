import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate, shuffleArray} from '../utils.js';
import {EVENT_TYPES, CITIES, OFFERS, DESCRIPTIONS, EVENTS_COUNT} from '../const.js';

const generatePhotos = (description) => {
  const count = getRandomIntegerNumber(1, 6);

  return [...Array(count)]
    .map(() => {
      return {
        src: `http://picsum.photos/300/150?r=${Math.random()}`,
        description
      };
    });
};

const generateOffers = () => {
  const count = getRandomIntegerNumber(0, 6);

  return [...Array(count)].map((it, i) => OFFERS[i]);
};

const generateDescription = (descriptions) => {
  const count = getRandomIntegerNumber(1, 4);

  return shuffleArray(descriptions.slice())
    .slice(0, count)
    .join(` `);
};

const Destinations = CITIES.map((city) => {
  return {
    name: city,
    description: generateDescription(DESCRIPTIONS),
    photos: generatePhotos(city)
  };
});

const generateEvent = () => {
  const firstDate = getRandomDate();
  const secondDate = getRandomDate();
  const destination = Destinations[getRandomIntegerNumber(0, Destinations.length)];

  return {
    type: getRandomArrayItem([...EVENT_TYPES.transfers, ...EVENT_TYPES.activities]),
    destination,
    city: getRandomArrayItem(CITIES),
    photos: generatePhotos(),
    offers: generateOffers(),
    description: generateDescription(DESCRIPTIONS),
    startDate: Math.min(firstDate, secondDate),
    endDate: Math.max(firstDate, secondDate),
    price: getRandomIntegerNumber(10, 200)
  };
};

const generateEvents = (count) => {
  return [...Array(count)]
  .map(() => generateEvent())
  .sort((currentCard, nextCard) => currentCard.startDate - nextCard.startDate);
};

const events = generateEvents(EVENTS_COUNT);

const dates = events.map((item) => new Date(item.startDate).toDateString());

export {
  events,
  dates,
  Destinations
};
