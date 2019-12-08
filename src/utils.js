const render = (container, component, position = `beforeend`) => {
  container.insertAdjacentHTML(position, component);
};

const getRandomBool = () => Math.random() > 0.5;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * (i + 1));
    let temp = array[random];

    array[random] = array[i];
    array[i] = temp;
  }

  return array;
};

const addLeadZero = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = addLeadZero(date.getDate());
  const month = addLeadZero(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${month}/${year}`;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  const hours = addLeadZero(date.getHours());
  const minutes = addLeadZero(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDuration = (time) => {
  const millisecondsInMinute = 60 * 1000;
  const millisecondsInHour = millisecondsInMinute * 60;

  const hours = addLeadZero(Math.floor(time / millisecondsInHour));
  const minutes = addLeadZero(Math.floor(time % millisecondsInHour / millisecondsInMinute));

  return `${hours > 0 ? `${hours}H` : ``} ${minutes}M`;
};

export {
  render,
  getRandomBool,
  getRandomIntegerNumber,
  getRandomArrayItem,
  getRandomDate,
  shuffleArray,
  formatDate,
  formatTime,
  formatDuration
};

