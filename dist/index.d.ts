declare module 'react';
import { applyMiddleware, createStore as reactCreateStore } from 'redux';
import { IActionMap, tHelper, DropFirst, Payload, Split } from './index.types';
declare type AnyStore = Store<any, any, any>;
export declare const createGlobalStore: <S extends [(AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, (AnyStore | undefined)?, ...any[]]>(stores: S, extraMiddleware?: Parameters<typeof applyMiddleware>, devTools?: boolean | undefined) => import("redux").Store<unknown, import("redux").Action<any>> & {
    getStore: tHelper<S>;
};
export declare class Store<S, AM1 extends IActionMap<S>, T2 extends string> {
    path: T2;
    private initState;
    private actionMap;
    stateHelper: Record<T2, S>;
    constructor(path: T2, initState: S, actionMap: AM1, bypassActionConventions?: boolean);
    private queuedWork;
    private realStore;
    registerRealStore: (realStore: any) => any;
    private rename;
    /**
     * queue an action for dispatch after current dispatching action.
     * Likely shouldn't be used outside of your action reducers
     * @param action
     * @param payload
     */
    queue: <ACTION extends keyof AM1>(action: ACTION, ...payload: Payload<S, AM1[ACTION]>) => void;
    /**
     * dispatch an action
     * @param action
     * @param payload
     * @returns
     */
    dispatch: <ACTION extends keyof AM1>(action: ACTION, ...payload: Payload<S, AM1[ACTION]>) => any;
    /**
     * Make a curried dispatcher
     * @param t
     * @returns
     */
    dispatcher: <T2_1 extends keyof AM1, P extends [] | Split<Payload<S, AM1[T2_1]>>>(t: T2_1, ...payload: P) => (...p: P extends [] ? Payload<S, AM1[T2_1]> : DropFirst<Payload<S, AM1[T2_1]>, P["length"]>) => any;
    multiDispatch: <T1 extends keyof AM1, P1 extends Payload<S, AM1[T1]>, T2_1 extends keyof AM1, P2 extends Payload<S, AM1[T2_1]>, T3 extends keyof AM1, P3 extends Payload<S, AM1[T3]>, T4 extends keyof AM1, P4 extends Payload<S, AM1[T4]>, T5 extends keyof AM1, P5 extends Payload<S, AM1[T5]>>(actions: [[T1, ...P1]] | [[T1, ...P1], [T2_1, ...P2]] | [[T1, ...P1], [T2_1, ...P2], [T3, ...P3]] | [[T1, ...P1], [T2_1, ...P2], [T3, ...P3], [T4, ...P4]] | [[T1, ...P1], [T2_1, ...P2], [T3, ...P3], [T4, ...P4], [T5, ...P5]]) => (...any: any[]) => void;
    /**
     * Reducer that
     * @param state
     * @param action
     * @returns
     */
    reducer: (state: S | undefined, action: any) => any;
    useSelector: () => S;
}
export {};
//# sourceMappingURL=index.d.ts.map