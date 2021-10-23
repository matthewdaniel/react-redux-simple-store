"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                return (_, getState) => {
                    const getStateSlice = () => getState()[this.path];
                    // const state = root[this.path];
                    return handler.thunk(getStateSlice, payload).catch((e) => {
                        console.error('!!!swallowed thunk error', e);
                    });
                };
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
const t = new Store('test', {}, {
    ':test/->thunk-action': { thunk: (getState, [thing]) => __awaiter(void 0, void 0, void 0, function* () {
        }) },
    ':test/some-action': (state, [evt]) => state
});
// const fn = t.dispatcher(':test/->thunk-action', 1)
// const fn2 = t.dispatcher(':test/some-action', 'red')
const store = (0, exports.createGlobalStore)([t]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTBDO0FBQzFDLDhEQUFnQztBQUNoQyxpQ0FBMEY7QUFDMUYsK0NBQTZHO0FBQzdHLHVFQUErRDtBQUMvRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDO0FBSXBCLE1BQU0saUJBQWlCLEdBQUcsQ0FBZ0MsTUFBUyxFQUFFLGtCQUFzRCxFQUFFLEVBQUUsUUFBa0IsRUFBa0UsRUFBRTtJQUN4TixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLGlDQUFLLENBQUMsS0FBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsRyxNQUFNLEtBQUssR0FBRyxJQUFBLG1CQUFnQixFQUMxQixRQUFRLEVBQ1IsUUFBUTtRQUNKLENBQUMsQ0FBQyxJQUFBLDhDQUFtQixFQUFDLElBQUEsdUJBQWUsRUFBQyxxQkFBSyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLElBQUEsdUJBQWUsRUFBQyxxQkFBSyxFQUFFLEdBQUcsZUFBZSxDQUFDLENBQzVDLENBQUM7SUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDLENBQUE7QUFYWSxRQUFBLGlCQUFpQixxQkFXN0I7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUU7SUFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxL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