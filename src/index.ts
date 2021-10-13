import { useSelector } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as reactCreateStore } from 'redux';
import { IActionMap, ActionDispatchFunction, afn, isThunk, isHandler, Store, typeHelper, AnyStore } from './index.types';
import { throttleThunk } from './throttleThunk';
import { composeWithDevTools } from 'redux-devtools-extension';
const { entries } = Object;

const thunkMiddleware = [throttleThunk, thunk];

const combineStores = (stores: Store<any, any, any, any>[]) => combineReducers(stores.reduce((c, n) => ({
    ...c,
    [n.path]: n.reducer
}), {}));

let store;
export const createGlobalStore = <S extends [any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, any?, ...any]>(stores: S, extraMiddleware: Parameters<typeof applyMiddleware> = [], dev?: boolean) => {
    const reactStore = reactCreateStore(
        combineStores(stores),
        dev
            ? composeWithDevTools(applyMiddleware(...thunkMiddleware.concat(extraMiddleware)))
            : applyMiddleware(...thunkMiddleware.concat(extraMiddleware))
    );
    
    const typeHelp = typeHelper(stores);
    return store = {
        ...reactStore,
        getState: reactStore.getState as () => typeof typeHelp
    }
}

/**
 * Make redux store helpers. See makeStore.readme.md
 * @param path path in redux where you will register store
 * @param initialState
 * @param actionMap
 */
export const makeStore = <S, T extends IActionMap<S>, T2 extends string>(path: T2, initialState: S, actionMap: T, useConventions: boolean = true): Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> => {
    if (useConventions) entries(actionMap).forEach(([k, action]) => {
        ensureNamespaced(k);
        if (isThunk(action)) ensureThunkNameConvention(k);
    });
    
    const store: Store<ActionDispatchFunction<S, T>, afn<S, T>, S, T2> = ({
        path,
        action: (action: keyof T, ...payload: any[]) => {
            const a = actionMap[action];
            if (isThunk(a)) return (dispatch: any, getState: any) => {
                const root = getState();
                const state = [].concat(path as any).reduce((c, n) => c?.[n], root);

                return Promise.resolve().then(() => a.thunk(dispatch, { state, root }, payload)).catch((e: any) => {
                    console.error('!!!swallowed thunk error', e);
                });
            }
    
            if (isHandler(a)) return ({ payload, type: action });    
    
            throw new Error('unimplemented handler type');
        },
        dispatch: (...rest: any[]) => () => (store as any).dispatch(
            (store.action as any)(...rest)
        ),
        reducer: (state = initialState, action) => isHandler(actionMap[action.type])
            ? (actionMap[action.type] as any)(state, action.payload)
            : state,
        useSelector: () => useSelector(store => [].concat(path as any)
            .reduce((c, n) => c?.[n], store as any))
    });

    return store;
};

// require namespaced (:string/)
const ensureNamespaced = (k: string) => {
    if (!k.match(/:[\w]*\//)) throw new Error(`Action ${k} must have a namespace. ie :todos/${k}`)
};

const ensureThunkNameConvention = (k: string) => {
    if (!k.includes('/->')) throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`)
}