import {getRandomArrayItem, getRandomIntegerNumber, shuffleArray, getRandomBool} from '../utils/common.js';
import {EVENT_TYPES, CITIES, OFFERS, DESCRIPTIONS, EVENTS_COUNT} from '../const.js';

const generateDate = () => {
  const day = 24 * 3600 * 1000;
  return Date.now() + getRandomIntegerNumber(-day, day * 3);
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
  return shuffleArray(OFFERS.slice()).slice(0, count);
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
    pictures: generatePhotos(city)
  };
});

const Offers = [...EVENT_TYPES.TRANSFERS, ...EVENT_TYPES.ACTIVITIES]
   .map((type) => {
     return {type, offers: generateOffers()};
   });

const generateEvent = () => {
  const firstDate = generateDate();
  const secondDate = generateDate();
  const destination = Destinations[getRandomIntegerNumber(0, Destinations.length)];

  return {
    id: String(Math.round(Date.now() * Math.random())),
    type: getRandomArrayItem([...EVENT_TYPES.TRANSFERS, ...EVENT_TYPES.ACTIVITIES]),
    destination,
    city: getRandomArrayItem(CITIES),
    pictures: generatePhotos(),
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
  Destinations,
  Offers
};
