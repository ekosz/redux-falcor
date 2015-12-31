import { update } from './duck';

export default function createStore(reduxStore) {
  const listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
    let isSubscribed = true;

    return function unsubscribe() {
      if (!isSubscribed) return;

      isSubscribed = false;
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  function trigger(cache) {
    // Update the redux with the changes
    reduxStore.dispatch(update(cache));

    // Trigger listeners to refetch possible invalidated data
    listeners.slice().forEach((listener) => listener());
    return cache;
  }

  return {
    subscribe,
    trigger,
  };
}
