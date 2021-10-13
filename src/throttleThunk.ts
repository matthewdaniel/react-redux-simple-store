import { ThunkAction } from 'redux-thunk';

const cache: Record<string, Promise<any>> = {};

const isThrottleThunk = (t: any): t is ThunkAction<any, any, any, any> & {throttleThunk: string} => {
  return typeof t === 'function' && 'throttleThunk' in t
};

export const throttleThunk = ({ dispatch, getState }: any) => (next: any) => (action: any) => {

  if (!isThrottleThunk(action)) return next(action);
  const { throttleThunk: k } = action;

  // already running so throttle request
  if (!!cache[k]) {
    console.info('throttling duplicate thunk by key', k)
    return;
  }

  const actCall = action(dispatch, getState, undefined);

  cache[k] = Promise.resolve(actCall).then(() => delete cache[k]);

  return actCall;
};

export const throttle = (key: string, fn: ThunkAction<any, any, any, any>) => {
  (fn as any).throttleThunk = key;
  return fn;
}