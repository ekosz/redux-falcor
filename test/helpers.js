import expect from 'expect';
import deepEqual from 'deep-equal';

expect.extend({
  toMatchObject(obj) {
    const nonMatches = [];
    const args = [this.actual, obj];
    Object.keys(obj).forEach(key => {
      if (!deepEqual(this.actual[key], obj[key])) {
        nonMatches.push(key);
        args.push(key);
        args.push(this.actual[key]);
        args.push(obj[key]);
      }
    });

    expect.assert.apply(this, [
      nonMatches.length === 0,
      'expected %s to match the object %s\n\n' + nonMatches.map(() => '     %s: %s should equal %s').join('\n'),
    ].concat(args));
  },
});
