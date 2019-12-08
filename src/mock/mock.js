import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate, shuffleArray} from '../utils.js';
import {EVENT_TYPES, CITIES, OFFERS, DESCRIPTIONS} from '../const.js';

const generatePhotos = () => {
  const count = getRandomIntegerNumber(1, 6);

  return [...Array(count)].map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
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

const generateEvent = () => {
  const firstDate = getRandomDate();
  const secondDate = getRandomDate();

  return {
    type: getRandomArrayItem([...EVENT_TYPES.transfers, ...EVENT_TYPES.activities]),
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
  return [...Array(count)].map(() => generateEvent());
};

export {generateEvents};
