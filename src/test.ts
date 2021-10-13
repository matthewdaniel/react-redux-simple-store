import { createGlobalStore, makeStore } from './index';
import { AnyStore } from '../src/index.types';

type store1Type = {a?: boolean, b: number};

const store1 = makeStore('store1', {b: 1} as store1Type, {
    ':test/thing': (state, []: [params1: string]) => {
        return state;
    },
})

type store2Type = {c?: boolean, d: number};

const store2 = makeStore('store2', {d: 1} as store2Type, {
    ':test/thing': (state, []: [params1: string]) => {
        return state;
    },
})

const t = createGlobalStore([store1, store2]);
type Store = ReturnType<typeof t.getState>
