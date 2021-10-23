import { useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as reactCreateStore } from 'redux';
import { IActionMap,isThunk, isHandler, MaxStores, tHelper, Payload, DropFirst, Split } from './index.types';
import { composeWithDevTools } from 'redux-devtools-extension';
const { entries } = Object;

type AnyStore = Store<any, any, any>

export const createGlobalStore = <S extends MaxStores<AnyStore>>(stores: S, extraMiddleware: Parameters<typeof applyMiddleware> = [], devTools?: boolean): ReturnType<typeof reactCreateStore> & { getStore: tHelper<S> } => {
    const combined = combineReducers(stores.reduce((c, n: any) => ({...c, [n.path]: n.reducer}), {}));

    const store = reactCreateStore(
        combined,
        devTools
            ? composeWithDevTools(applyMiddleware(thunk, ...extraMiddleware))
            : applyMiddleware(thunk, ...extraMiddleware)
    ) as any;
    stores.forEach((s: any) => s.registerRealStore(store));
    return store;
}

const ensureNamespaced = (k: string) => {
    if (!k.match(/:[\w\-]*\//)) throw new Error(`Action ${k} must have a namespace. ie :todos/${k}`)
};

const ensureThunkNameConvention = (k: string) => {
    if (!k.includes('/->')) throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`)
}

export class Store<S, AM1 extends IActionMap<S>, T2 extends string> {
    public stateHelper: Record<T2, S> = {} as any;

    constructor(public path: T2, private initState: S, private actionMap: AM1, bypassActionConventions?: boolean) {
        // enforce naming conventions
        if (!bypassActionConventions) entries(actionMap).forEach(([k, action]: any) => {
            ensureNamespaced(k);
            if (isThunk(action)) ensureThunkNameConvention(k);
        });

        // name the reducer functions for stack traces
        entries(actionMap).forEach(([action, handler]: any) => {
            const newName = `reducer:|:${action}`;
            const h = handler.thunk || handler.fx || handler;
            this.rename(h, newName);
        })
    }
    private queuedWork: any[] = [];
    
    private realStore: any;
    registerRealStore = (realStore: any) => this.realStore = realStore;

    private rename = (fn: any, newName: string) => Object.defineProperty(fn, 'name', { value: newName });

    /**
     * queue an action for dispatch after current dispatching action.
     * Likely shouldn't be used outside of your action reducers
     * @param action 
     * @param payload 
     */
    queue = <ACTION extends keyof AM1>(action: ACTION, ...payload: Payload<S, AM1[ACTION]>) => {
        this.queuedWork.push([action, ...payload]);
    }

    /**
     * dispatch an action
     * @param action 
     * @param payload 
     * @returns 
     */
    dispatch = <ACTION extends keyof AM1>(action: ACTION, ...payload: Payload<S, AM1[ACTION]>) => {
        const handler = this.actionMap[action];

        if (isThunk(handler)) return (_: any, getState: any) => {
            const getStateSlice = () => getState()[this.path];
            // const state = root[this.path];
            return handler.thunk(getStateSlice, payload).catch((e: any) => {
                console.error('!!!swallowed thunk error', e);
            })
        }

        if (isHandler(handler)) {
            const res = this.realStore.dispatch({ payload, type: action });
            this.queuedWork.splice(-0).forEach(params => (this.dispatch as any)(...params));
            return res;
        }

        throw new Error('unimplemented handler type');
    }

    /**
     * Make a curried dispatcher
     * @param t 
     * @returns 
     */
    dispatcher = <T2 extends keyof AM1, P extends [] | Split<Payload<S, AM1[T2]>>>(t: T2, ...payload: P) => {
        const part: any = payload?.length ? payload : [];
        return (...p: P extends [] ? Payload<S, AM1[T2]> : DropFirst<Payload<S, AM1[T2]>, P['length']>) => this.dispatch(t, ...part.concat(p))
    }

    multiDispatch = <
    T1 extends keyof AM1, P1 extends Payload<S, AM1[T1]>,
    T2 extends keyof AM1, P2 extends Payload<S, AM1[T2]>,
    T3 extends keyof AM1, P3 extends Payload<S, AM1[T3]>,
    T4 extends keyof AM1, P4 extends Payload<S, AM1[T4]>,
    T5 extends keyof AM1, P5 extends Payload<S, AM1[T5]>,
    >(actions: 
        [[T1, ...P1]]|
        [[T1, ...P1], [T2, ...P2]]|
        [[T1, ...P1], [T2, ...P2], [T3, ...P3]]|
        [[T1, ...P1], [T2, ...P2], [T3, ...P3], [T4, ...P4]]|
        [[T1, ...P1], [T2, ...P2], [T3, ...P3], [T4, ...P4], [T5, ...P5]]) => {
        return (...any: any[]) => actions.forEach(([t, ...payload]) => this.dispatch(t as any, ...(payload as any)))
    }

    /**
     * Reducer that 
     * @param state 
     * @param action 
     * @returns 
     */
    reducer = (state = this.initState, action: any) => !isHandler(this.actionMap[action.type])
        ? state
        : (this.actionMap[action.type] as any)(state, action.payload) ?? state

    useSelector = () => useSelector((store: any) => store[this.path] as S)
}

interface SomeState {
    red: 'blue',
    blue: 'green'
}
const t = new Store('test', {} as SomeState, {
    ':test/->thunk-action': { thunk: async (getState, [thing]: [thing: number, other: string, another: 'blue']) => {
        
    } },
    ':test/some-action': (state, [evt]: [evt: 'red', more: 'blue']) => state
})

// const fn = t.dispatcher(':test/->thunk-action', 1)
// const fn2 = t.dispatcher(':test/some-action', 'red')

const store = createGlobalStore([t])
