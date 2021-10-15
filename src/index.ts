import { useSelector, batch } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as reactCreateStore } from 'redux';
import { IActionMap, ActionDispatchFunction, afn, isThunk, isBatch, isHandler, Store, MaxStores, tHelper } from './index.types';
import { throttleThunk } from './middleware/throttleThunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const { entries } = Object;

const thunkMiddleware = [throttleThunk, thunk];

const combineStores = (stores: Store<any, any, any, any>[]) => combineReducers(stores.reduce((c, n) => ({
    ...c,
    [n.path]: n.reducer
}), {}));

let realStore: any;
export const createGlobalStore = <S extends MaxStores>(stores: S, extraMiddleware: Parameters<typeof applyMiddleware> = [], dev?: boolean): ReturnType<typeof reactCreateStore> & { getStore: tHelper<S> } => {
    return realStore = reactCreateStore(
        combineStores(stores),
        dev
            ? composeWithDevTools(applyMiddleware(...thunkMiddleware.concat(extraMiddleware)))
            : applyMiddleware(...thunkMiddleware.concat(extraMiddleware))
    ) as any;
}

/**
 * Make redux store helpers. See makeStore.readme.md
 * @param path path in redux where you will register store
 * @param initialState
 * @param actionMap
 */
export const makeStore = <S, T extends IActionMap<S, T>, T2 extends string>(path: T2, initialState: S, actionMap: T, useConventions: boolean = true): Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> => {
    if (useConventions) entries(actionMap).forEach(([k, action]: any) => {
        ensureNamespaced(k);
        if (isThunk(action)) ensureThunkNameConvention(k);
        if (isBatch(action)) ensureFxNameConvention(k);
    });
    
    const store: Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> = ({
        path,
        dispatch: (action: keyof T, ...payload: any[]) => {
            const a = actionMap[action];
            if (isThunk(a)) return (dispatch: any, getState: any) => {
                const root = getState();
                const state = [].concat(path as any).reduce((c, n) => c?.[n], root);

                return Promise.resolve().then(() => a.thunk(dispatch, { state, root }, payload)).catch((e: any) => {
                    console.error('!!!swallowed thunk error', e);
                });
            }
    
            if (isBatch(a)) {
                const work = [];
                const queuedDispatch = (...params: any[]) => work.push(params);
                batch(() => {
                    realStore.dispatch({ payload, type: action })

                })
                
            }

            if (isHandler(a)) return realStore.dispatch({ payload, type: action });
    
            throw new Error('unimplemented handler type');
        },
        dispatcher: (action: keyof T) => (...payload: any[]) => store.dispatch(action, ...(payload as any)),
        reducer: (state = initialState, action) => {
            if(!isHandler(actionMap[action.type])) return state;

            const nextState = (actionMap[action.type] as any)(state, action.payload);

            return nextState;
        },
        useSelector: () => useSelector((store: any) => [].concat(path as any)
            .reduce((c, n) => c?.[n], store as any))
    });

    return store;
};

interface SomeState {
    red: 'blue',
    blue: 'green'
}
const t = makeStore('test', {} as SomeState, {
    ':test/->thunk-action': { 'thunk': (dispatch, state, [thing]: [thing: number]) => state },
    ':test/-|some-action': { 'batch': (state, [thing]: [thing: number]) => ({
        db: state,
        dispatch: [[':test/->thunk-action']]
    }) },
})

// require namespaced (:string/)
const ensureNamespaced = (k: string) => {
    if (!k.match(/:[\w\-]*\//)) throw new Error(`Action ${k} must have a namespace. ie :todos/${k}`)
};

const ensureThunkNameConvention = (k: string) => {
    if (!k.includes('/->')) throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`)
}
const ensureFxNameConvention = (k: string) => {
    if (!k.includes('/-<')) throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`)
}
