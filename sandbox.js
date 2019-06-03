const _ = require('underscore');

let map =  { one: 1, two: 2, three: 3 };

const keysToRemove = ['one', 'two'];

map = _.omit(map, (value, key) => {
  const _key = key.split('.');
  let match;

  for (let i = 0; i < keysToRemove.length; i++) {
    match = false;
    const _str = keysToRemove[i].split('.');
    for (let j = 0; j < _str.length; j++) {
      if (_key[j] != _str[j]) {
        match = true;
        break;
      }
    }
    if (match === false) {
      break;
    }
  }
  return match;
});

console.log('*********************');
console.log(map);
console.log('*********************');
