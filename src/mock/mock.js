import {getRandomArrayItem, getRandomIntegerNumber, shuffleArray, getRandomBool} from '../utils.js';
import {EVENT_TYPES, CITIES, OFFERS, DESCRIPTIONS, EVENTS_COUNT} from '../const.js';

const generateDate = () => {
  const day = 24 * 3600 * 1000;
  return getRandomIntegerNumber(Date.now(), Date.now() + day * 7);
};

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
  const firstDate = generateDate();
  const secondDate = generateDate();
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
    price: getRandomIntegerNumber(10, 200),
    isFavorite: getRandomBool()
  };
};

const generateEvents = () => {
  return [...Array(EVENTS_COUNT)]
  .map(() => generateEvent());
};

export {
  generateEvents,
  Destinations
};
