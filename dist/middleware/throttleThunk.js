"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = exports.throttleThunk = void 0;
const cache = {};
const isThrottleThunk = (t) => {
    return typeof t === 'function' && 'throttleThunk' in t;
};
const throttleThunk = ({ dispatch, getState }) => (next) => (action) => {
    if (!isThrottleThunk(action))
        return next(action);
    const { throttleThunk: k } = action;
    // already running so throttle request
    if (!!cache[k]) {
        console.info('throttling duplicate thunk by key', k);
        return;
    }
    const actCall = action(dispatch, getState, undefined);
    cache[k] = Promise.resolve(actCall).then(() => delete cache[k]);
    return actCall;
};
exports.throttleThunk = throttleThunk;
const throttle = (key, fn) => {
    fn.throttleThunk = key;
    return fn;
};
exports.throttle = throttle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGVUaHVuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Rocm90dGxlVGh1bmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBTSxLQUFLLEdBQWlDLEVBQUUsQ0FBQztBQUUvQyxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQU0sRUFBa0UsRUFBRTtJQUNqRyxPQUFPLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxlQUFlLElBQUksQ0FBQyxDQUFBO0FBQ3hELENBQUMsQ0FBQztBQUVLLE1BQU0sYUFBYSxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO0lBRTNGLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEQsTUFBTSxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFFcEMsc0NBQXNDO0lBQ3RDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDcEQsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFdEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEUsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBaEJXLFFBQUEsYUFBYSxpQkFnQnhCO0FBRUssTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBbUMsRUFBRSxFQUFFO0lBQzFFLEVBQVUsQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFBO0FBSFksUUFBQSxRQUFRLFlBR3BCIn0=