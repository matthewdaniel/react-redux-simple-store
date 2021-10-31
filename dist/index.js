"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.createGlobalStore = void 0;
const react_redux_1 = require("react-redux");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const redux_1 = require("redux");
const index_types_1 = require("./index.types");
const redux_devtools_extension_1 = require("redux-devtools-extension");
const { entries } = Object;
const createGlobalStore = (stores, extraMiddleware = [], devTools) => {
    const combined = (0, redux_1.combineReducers)(stores.reduce((c, n) => (Object.assign(Object.assign({}, c), { [n.path]: n.reducer })), {}));
    const store = (0, redux_1.createStore)(combined, devTools
        ? (0, redux_devtools_extension_1.composeWithDevTools)((0, redux_1.applyMiddleware)(redux_thunk_1.default, ...extraMiddleware))
        : (0, redux_1.applyMiddleware)(redux_thunk_1.default, ...extraMiddleware));
    stores.forEach((s) => s.registerRealStore(store));
    return store;
};
exports.createGlobalStore = createGlobalStore;
const ensureNamespaced = (k) => {
    if (!k.match(/:[\w\-]*\//))
        throw new Error(`Action ${k} must have a namespace. ie :todos/${k}`);
};
const ensureThunkNameConvention = (k) => {
    if (!k.includes('/->'))
        throw new Error(`Thunk with key ${k} should have arrow convention ie :todos/->save-todo`);
};
class Store {
    constructor(path, initState, actionMap, bypassActionConventions) {
        this.path = path;
        this.initState = initState;
        this.actionMap = actionMap;
        this.stateHelper = {};
        this.queuedWork = [];
        this.registerRealStore = (realStore) => this.realStore = realStore;
        this.rename = (fn, newName) => Object.defineProperty(fn, 'name', { value: newName });
        /**
         * queue an action for dispatch after current dispatching action.
         * Likely shouldn't be used outside of your action reducers
         * @param action
         * @param payload
         */
        this.queue = (action, ...payload) => {
            this.queuedWork.push([action, ...payload]);
        };
        /**
         * dispatch an action
         * @param action
         * @param payload
         * @returns
         */
        this.dispatch = (action, ...payload) => {
            const handler = this.actionMap[action];
            if ((0, index_types_1.isThunk)(handler))
                return this.realStore.dispatch((_, getState) => {
                    const getStateSlice = () => getState()[this.path];
                    // const state = root[this.path];
                    return handler.thunk(getStateSlice, payload).catch((e) => {
                        console.error('!!!swallowed thunk error', e);
                    });
                });
            if ((0, index_types_1.isHandler)(handler)) {
                const res = this.realStore.dispatch({ payload, type: action });
                this.queuedWork.splice(-0).forEach(params => this.dispatch(...params));
                return res;
            }
            throw new Error('unimplemented handler type');
        };
        /**
         * Make a curried dispatcher
         * @param t
         * @returns
         */
        this.dispatcher = (t, ...payload) => {
            const part = (payload === null || payload === void 0 ? void 0 : payload.length) ? payload : [];
            return (...p) => this.dispatch(t, ...part.concat(p));
        };
        this.multiDispatch = (actions) => {
            return (...any) => actions.forEach(([t, ...payload]) => this.dispatch(t, ...payload));
        };
        /**
         * Reducer that
         * @param state
         * @param action
         * @returns
         */
        this.reducer = (state = this.initState, action) => {
            var _a;
            return !(0, index_types_1.isHandler)(this.actionMap[action.type])
                ? state
                : (_a = this.actionMap[action.type](state, action.payload)) !== null && _a !== void 0 ? _a : state;
        };
        this.useSelector = () => (0, react_redux_1.useSelector)((store) => store[this.path]);
        // enforce naming conventions
        if (!bypassActionConventions)
            entries(actionMap).forEach(([k, action]) => {
                ensureNamespaced(k);
                if ((0, index_types_1.isThunk)(action))
                    ensureThunkNameConvention(k);
            });
        // name the reducer functions for stack traces
        entries(actionMap).forEach(([action, handler]) => {
            const newName = `reducer:|:${action}`;
            const h = handler.thunk || handler.fx || handler;
            this.rename(h, newName);
        });
    }
}
exports.Store = Store;
// interface SomeState {
//     red: 'blue',
//     blue: 'green'
// }
// const t = new Store('test', {} as SomeState, {
//     ':test/->thunk-action': { thunk: async (getState, [thing]: [thing: number, other: string, another: 'blue']) => {
//     } },
//     ':test/some-action': (state, [evt]: [evt: 'red', more: 'blue']) => state
// })
// const fn = t.dispatcher(':test/->thunk-action', 1)
// const fn2 = t.dispatcher(':test/some-action', 'red')
// const store = createGlobalStore([t])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsNkNBQTBDO0FBQzFDLDhEQUFnQztBQUNoQyxpQ0FBMEY7QUFDMUYsK0NBQTZHO0FBQzdHLHVFQUErRDtBQUUvRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDO0FBSXBCLE1BQU0saUJBQWlCLEdBQUcsQ0FBZ0MsTUFBUyxFQUFFLGtCQUFzRCxFQUFFLEVBQUUsUUFBa0IsRUFBa0UsRUFBRTtJQUN4TixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLGlDQUFLLENBQUMsS0FBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsRyxNQUFNLEtBQUssR0FBRyxJQUFBLG1CQUFnQixFQUMxQixRQUFRLEVBQ1IsUUFBUTtRQUNKLENBQUMsQ0FBQyxJQUFBLDhDQUFtQixFQUFDLElBQUEsdUJBQWUsRUFBQyxxQkFBSyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLElBQUEsdUJBQWUsRUFBQyxxQkFBSyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQzVDLENBQUM7SUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDLENBQUE7QUFYWSxRQUFBLGlCQUFpQixxQkFXN0I7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUU7SUFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMs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