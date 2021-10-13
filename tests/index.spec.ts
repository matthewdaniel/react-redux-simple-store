/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable jest/no-conditional-expect */
import { makeStore } from '../src/index';
import * as rr from 'react-redux';
import { isThunk, isHandler } from '../src/index.types';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { assoc, dissoc, pipe } from 'ramda';

type IColor = 'red' | 'blue' | 'green';
type IDay = 'mon' | 'tue' | 'wed' | 'thur' | 'fri' | 'sat' | 'sun';
interface State {
  color: IColor;
  day?: IDay;
  passthrough?: any;
}
describe('make store', () => {
  const storeProp = 'p1';
  const inits1: State = {
    color: 'red',
  };
  const s1Start = makeStore(storeProp, inits1, {
    ':ns/passthrough': (state, [...all]: any[]) => assoc('passthrough', all, state),
    ':ns/change-color': (state, [c]: [IColor]) => assoc('color', c, state),
    ':ns/change-day': (state, [d]: [IDay]) => assoc('day', d, state),
    ':ns/change-day-both': (state, [d]: [IDay]) => pipe(
        assoc('color', 'blue'),
        assoc('day', d)
    )(state),
    ':ns/unset-day': state => dissoc('day', state),
    ':ns/->thunkerate': {
      thunk: (dispatch, state, [fn, ...args]) => {
        fn(state);
        return { type: 'some-action', payload: 'whatever' };
      },
    },
  });
  let s1 = s1Start;
  let s: Store<{ [storeProp]: State }>;
  beforeEach(() => {
    s1 = s1Start;
    s = createStore(combineReducers({ [storeProp]: s1.reducer }), applyMiddleware(thunk));
  });

  it('should add test coverage to helper fns', () => {
    expect(isThunk({ thunk: () => {} })).toBe(true);
    expect(isHandler(() => {})).toBe(true);
  });

  it('should use local state for useSelector', () => {
    const useSelector = jest.spyOn(rr, 'useSelector');
    useSelector.mockImplementation(h => h(s.getState()));

    const t = s1.useSelector();
    expect(t).toEqual(inits1);
  });

  it('should throw if an unsupported action is implemented', () => {
    const { action } = makeStore('k', '', {
      ':ns/some-action': { noSupported: () => {} },
    } as any);

    expect(() => (action as any)(':ns/some-action', '')).toThrow();
  });

  it('make change color action', () => {
    const a = s1.action(':ns/change-color', 'blue');
    expect(a).toEqual({
      type: ':ns/change-color',
      payload: ['blue'],
    });
  });

  it('should fail without namespace', () => {
    expect(() =>
      makeStore('k', '', {
        test: () => ({} as any),
      }),
    ).toThrow();
  });

  it('change reflected in store', () => {
    // const newState = s1.reducer(inits1, s1.action(':ns/change-day', 'sat'))
    s.dispatch(s1.action(':ns/change-day', 'sat'));
    const newState = s.getState()[storeProp];
    expect(newState).toEqual({
      color: 'red',
      day: 'sat',
    });
  });

//   it('should make a dispatcher', () => {
//     const dispatch = jest.fn();
//     const oldDispatch = store.dispatch;
//     store.dispatch = dispatch;
//     s1.afn(dispatch, ':ns/change-color', 'blue')();
//     store.dispatch = oldDispatch;

//     expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: ['blue'], type: ':ns/change-color' }));
//   });

  it('should pass args through', () => {
    const args = ['one', 'two', 'three', 4];
    const pass = s1.reducer(inits1, s1.action(':ns/passthrough', ...args)).passthrough;
    expect(pass).toEqual(args);
  });

  it('should return thunk fn', () => {
    const thunk = s1.action(':ns/->thunkerate', () => {});
    expect(typeof thunk).toBe('function');
  });
  it('should not throw if thunk throws', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const thunk = () => {
      throw new Error('m');
    };
    expect(() => s.dispatch(s1.action(':ns/->thunkerate', thunk))).not.toThrow();
  });

  it('should thunk', async () => {
    const thunkFn = jest.fn(({ state, root }) => {
      expect(state).toEqual(expect.objectContaining(inits1));
      expect(root).toEqual(
        expect.objectContaining({
          [storeProp]: expect.objectContaining(inits1),
        }),
      );
    });

    await s.dispatch(s1.action(':ns/->thunkerate', thunkFn));

    expect(thunkFn).toHaveBeenCalled();
  });
});
