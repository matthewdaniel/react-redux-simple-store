import { useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as reactCreateStore } from 'redux';
import { IActionMap,isThunk, isHandler, MaxStores, tHelper, Payload } from './index.types';
import { composeWithDevTools } from 'redux-devtools-extension';
const { entries } = Object;

const combineStores = (stores: Store<any, any, any>[]) => combineReducers(stores.reduce((c, n) => ({
    ...c,
    [n.path]: n.reducer
}), {}));

let realStore: any;
export const createGlobalStore = <S extends MaxStores>(stores: S, extraMiddleware: Parameters<typeof applyMiddleware> = [], dev?: boolean): ReturnType<typeof reactCreateStore> & { getStore: tHelper<S> } => {
    return realStore = reactCreateStore(
        combineStores(stores),
        dev
            ? composeWithDevTools(applyMiddleware(thunk, ...extraMiddleware))
            : applyMiddleware(thunk, ...extraMiddleware)
    ) as any;
}

/**
 * Make redux store helpers. See makeStore.readme.md
 * @param path path in redux where you will register store
 * @param initialState
 * @param actionMap
 */
// export const makeStoreyo = <S, T extends IActionMap<S>, T2 extends string>(path: T2, initialState: S, actionMap: T, useConventions: boolean = true): Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> => {
//     if (useConventions) entries(actionMap).forEach(([k, action]: any) => {
//         ensureNamespaced(k);
//         if (isThunk(action)) ensureThunkNameConvention(k);
//         if (isBatch(action)) ensureFxNameConvention(k);
//     });
    
//     let baching = {};

//     const store: Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> = ({
//         path,
//         dispatch: (action: keyof T, ...payload: any[]) => {
//             const a = actionMap[action];
//             if (isThunk(a)) return (dispatch: any, getState: any) => {
//                 const root = getState();
//                 const state = [].concat(path as any).reduce((c, n) => c?.[n], root);

//                 return Promise.resolve().then(() => a.thunk(dispatch, { state, root }, payload)).catch((e: any) => {
//                     console.error('!!!swallowed thunk error', e);
//                 });
//             }
    
//             if (isBatch(a)) {
//                 const work = [];
//                 const queuedDispatch = (...params: any[]) => work.push(params);
//                 batch(() => {
//                     realStore.dispatch({ payload, type: action })
//                 })
                
//             }

//             if (isHandler(a)) return realStore.dispatch({ payload, type: action });
    
//             throw new Error('unimplemented handler type');
//         },
//         dispatcher: (action: keyof T) => (...payload: any[]) => store.dispatch(action, ...(payload as any)),
//         reducer: (state = initialState, action) => {
//             if(!isHandler(actionMap[action.type])) return state;

//             const nextState = (actionMap[action.type] as any)(state, action.payload);

//             return nextState;
//         },
//         useSelector: () => useSelector((store: any) => [].concat(path as any)
//             .reduce((c, n) => c?.[n], store as any))
//     });

//     return store;
// };


const ensureNamespaced = (k: string) => {
    if (!k.match(/:[\w\-]*\//)) throw new Error(`Action ${k} must have a namespace. ie :todos/${k}`)
};

const ensureThunkNameConvention = (k: string) => {
    if (!k.includes('/->')) throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`)
}

export class Store<S, AM1 extends IActionMap<S>, T2> {
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

    dispatcher = <T2 extends keyof AM1>(t: T2) => this.rename(
        (...p: Payload<S, AM1[T2]>) => this.dispatch(t, ...p),
        `dispatcherFn ${t}`
    );

    reducer = (state = this.initState, action: any) => !isHandler(this.actionMap[action.type])
        ? state
        : (this.actionMap[action.type] as any)(state, action.payload)

    useSelector = () => useSelector((store: any) => store[this.path])
}

interface SomeState {
    red: 'blue',
    blue: 'green'
}
const t = new Store('test', {} as SomeState, {
    ':test/->thunk-action': { thunk: async (getState, [thing]: [thing: number]) => {
        
    } },
    ':test/some-action': (state, []) => state
})
