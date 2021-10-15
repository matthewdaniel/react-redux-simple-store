/**
 * There is a lot of intricate typescript stuff going on to make this helper
 * easier to use. It would be best to see the readme before trying to grok this code
 * to see what the target is.
 */
// return last type in array of types

import { Dispatch } from "redux";

export type pop<T extends any[]> = T extends [...any, infer LAST] ? LAST : never;

export type handler<S> = (state: S, payload: any) => S;
export type batchHandlers<S, T> = (d: (<T2 extends keyof T>(a: T2) => any), state: S, payload: any) => {db: S}
export type thunkHandler<S, T> = (dispatch: ((a: keyof T) => any), state: {state: S, root: any}, payload: any) => any|Promise<any>;

type thunk<S, T> = { thunk: thunkHandler<S, T> }
type batch<S, T> = { batch: batchHandlers<S, T> };

type plugin<S, T> = thunk<S, T> | batch<S, T>
type maybePlugin<S, T> = handler<S> | plugin<S, T>;

// todo: move this to a plug and play paradigm for easier extension
export const isThunk = (test: any): test is thunk<any, any> => !!test.thunk;
export const isBatch = (test: any): test is batch<any, any> => !!test.batch;

export const isHandler = (test: any): test is handler<any> => !!test && !isThunk(test) && !isBatch(test) && typeof test === 'function';

export type IActionMap<S, X> = Record<string, plugin<S, X>>

// determin the payload (last prop of handler)
export type Payload<S, T extends maybePlugin<S, any>> = T extends handler<S>
    ? Parameters<T> extends [any]
        ? []
        : pop<Parameters<T>>
    : T extends thunk<S, T>
        ? pop<Parameters<T['thunk']>>
        : T extends batch<S, any>
            ? pop<Parameters<T['batch']>>
            : never;

// action / action dispatcher types
export type afn<S, T extends IActionMap<S, T>> = <T2 extends keyof T>(t: T2, ...p: Payload<S, T[T2]>) => any;
export type ActionDispatchFunction<S, T extends IActionMap<S, T>> = <T2 extends keyof T>(t: T2) => (...p: Payload<S, T[T2]>) => any;

type h = {path: string, reducer: (...p: any) => any }
type TO<S extends h> = Record<S['path'], ReturnType<S['reducer']>>
export type MaxStores = [h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, h?, ...any];
export type tHelper<T extends MaxStores> = T extends []
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

// final form!! 🐉✪𝐙
export type Store<AM1, AM2 extends (...args: any) => any, S, T2> = {
    path: T2,
    dispatch: AM2,
    dispatcher: AM1
    reducer: (...a: any) => S|{db: S, dispatch: Parameters<AM2>[]},
    useSelector: () => S,
}

export type AnyStore = Store<any, any, any, any>;
