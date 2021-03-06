/**
 * There is a lot of intricate typescript stuff going on to make this helper
 * easier to use. It would be best to see the readme before trying to grok this code
 * to see what the target is.
 */
// return last type in array of types

type pop<T extends any[]> = T extends [...any, infer LAST] ? LAST : never;

type handler<S> = (state: S, payload: any) => S|void;
export const isHandler = (test: any): test is handler<any> => !!test && !isThunk(test) && typeof test === 'function';

type thunkHandler<S> = { thunk: (getState: () => S, payload?: any) => any }
export const isThunk = (test: any): test is thunkHandler<any> => 'thunk' in test;

export type IActionMap<S> = Record<string, handler<S>|thunkHandler<S>>

// determine the payload (last prop of handler)
export type Payload<S, T extends handler<S>|thunkHandler<S>> = T extends handler<S>
    ? Parameters<T> extends [any]
        ? []
        : pop<Parameters<T>>
    : T extends thunkHandler<S>
        ? Parameters<T['thunk']> extends [any]
            ? []
            : pop<Parameters<T['thunk']>>
        : never;

type Minus<n extends number> = n extends 10 ? 9 
: n extends 9 ? 8
: n extends 8 ? 7
: n extends 7 ? 6
: n extends 6 ? 5
: n extends 5 ? 4
: n extends 4 ? 3
: n extends 3 ? 2
: n extends 2 ? 1
: 0;

export type DropFirst<T extends unknown[], n extends number> = T extends [] ? [] :
    T extends [infer F, ...infer R]
        ? n extends 1
            ? R
            : DropFirst<R, Minus<n>>
        : T;
// type testing = DropFirst<[1, 2, 3, 4], 2>

export type Split<T extends unknown[]> = [T[0]]
|[T[0], T[1]]
|[T[0], T[1], T[2]]
|[T[0], T[1], T[2], T[3]]
|[T[0], T[1], T[2], T[3], T[4]]
|[T[0], T[1], T[2], T[3], T[4], T[5]]
|[T[0], T[1], T[2], T[3], T[4], T[5], T[6]]
|[T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]]
|[T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]]
|[T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]]
|[T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10]]


/**
 * This is all to extract a full store from an array of store slices
 */
type h = { stateHelper: any }
// type TO<S extends h> = Record<S['path'], ReturnType<S['reducer']>>
type TO<S extends h> = S['stateHelper']
export type MaxStores<T extends h> = [T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, ...any];
export type tHelper<T extends MaxStores<any>> = T extends []
? {}
: T extends [h]
? TO<T[0]>
: T extends [h, h]
? TO<T[0]> & TO<T[1]>
: T extends [h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]>
: T extends [h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]>
: T extends [h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]>
: T extends [h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]>
: T extends [h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]>
: T extends [h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]>
: T extends [h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]>
: T extends [h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]>
: T extends [h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]> & TO<T[15]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]> & TO<T[15]> & TO<T[16]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]> & TO<T[15]> & TO<T[16]> & TO<T[17]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]> & TO<T[15]> & TO<T[16]> & TO<T[17]> & TO<T[18]>
: T extends [h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h, h]
? TO<T[0]> & TO<T[1]> & TO<T[2]> & TO<T[3]> & TO<T[4]> & TO<T[5]> & TO<T[6]> & TO<T[7]> & TO<T[8]> & TO<T[9]> & TO<T[10]> & TO<T[11]> & TO<T[12]> & TO<T[13]> & TO<T[14]> & TO<T[15]> & TO<T[16]> & TO<T[17]> & TO<T[18]> & TO<T[19]>
: never;