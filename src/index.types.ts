/**
 * There is a lot of intricate typescript stuff going on to make this helper
 * easier to use. It would be best to see the readme before trying to grok this code
 * to see what the target is.
 */
// return last type in array of types

import { Dispatch } from "redux";

export type pop<T extends any[]> = T extends [...any, infer LAST] ? LAST : never;

export type handler<S> = (state: S, payload: any) => S|void;
export type thunkHandler<S> = {thunk: (dispatch: Dispatch, state: {state: S, root: any}, payload: any) => any}

export const isThunk = (test: any): test is thunkHandler<any> => !!test?.thunk;
export const isHandler = (test: any): test is handler<any> => !!test && !test?.thunk && typeof test === 'function';

export type IActionMap<S> = Record<string, handler<S> | thunkHandler<S>>

// determin the payload (last prop of handler)
export type Payload<S, T extends (handler<S> | thunkHandler<S>)> = T extends handler<S>
    ? Parameters<T> extends [any]
        ? []
        : pop<Parameters<T>>
    : T extends thunkHandler<S>
        ? pop<Parameters<T['thunk']>>
        : never;

// action / action dispatcher types
export type afn<S, T extends IActionMap<S>> = <T2 extends keyof T>(t: T2, ...p: Payload<S, T[T2]>) => any;
export type ActionDispatchFunction<S, T extends IActionMap<S>> = <T2 extends keyof T>(dispatch: Dispatch, t: T2, ...p: Payload<S, T[T2]>) => (...any: any[]) => any;
type TO<S extends AnyStore> = Record<S['path'], ReturnType<S['reducer']>>

export const typeHelper = <T extends [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, ...any]>(stores: T)  => {
    // this is a helper function only used to infer types out of the stores. should never be actually called and results used,
    // todo: circle back to see if there is a way to infer without the function.
    return {
    } as T extends []
    ? {}
    : T extends [any]
    ? TO<typeof stores[0]>
    : T extends [any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]>
    : T extends [any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]>
    : T extends [any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]>
    : T extends [any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]>
    : T extends [any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]>
    : T extends [any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]>
    : T extends [any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]>
    : T extends [any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]>
    : T extends [any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]> & TO<typeof stores[15]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]> & TO<typeof stores[15]> & TO<typeof stores[16]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]> & TO<typeof stores[15]> & TO<typeof stores[16]> & TO<typeof stores[17]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]> & TO<typeof stores[15]> & TO<typeof stores[16]> & TO<typeof stores[17]> & TO<typeof stores[18]>
    : T extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any]
    ? TO<typeof stores[0]> & TO<typeof stores[1]> & TO<typeof stores[2]> & TO<typeof stores[3]> & TO<typeof stores[4]> & TO<typeof stores[5]> & TO<typeof stores[6]> & TO<typeof stores[7]> & TO<typeof stores[8]> & TO<typeof stores[9]> & TO<typeof stores[10]> & TO<typeof stores[11]> & TO<typeof stores[12]> & TO<typeof stores[13]> & TO<typeof stores[14]> & TO<typeof stores[15]> & TO<typeof stores[16]> & TO<typeof stores[17]> & TO<typeof stores[18]> & TO<typeof stores[19]>
    : never;
}

// final form!! 🐉✪𝐙
export type Store<AM1, AM2, S, T2> = {
    path: T2,
    action: AM2, 
    dispatch: AM1,
    reducer: (...a: any) => S, 
    useSelector: () => S,
}

export type AnyStore = Store<any, any, any, any>;
