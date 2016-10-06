import { Model } from 'falcor';

const cache = {
  people: [{
    name: 'Dan',
    movie: 'Redux'
  }]
};

const falcor = new Model({
  cache
});

export {
  cache,
  falcor
};
