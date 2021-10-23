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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGVUaHVuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90aHJvdHRsZVRodW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sS0FBSyxHQUFpQyxFQUFFLENBQUM7QUFFL0MsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQWtFLEVBQUU7SUFDakcsT0FBTyxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksZUFBZSxJQUFJLENBQUMsQ0FBQTtBQUN4RCxDQUFDLENBQUM7QUFFSyxNQUFNLGFBQWEsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtJQUUzRixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELE1BQU0sRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBRXBDLHNDQUFzQztJQUN0QyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3BELE9BQU87S0FDUjtJQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXRELEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhFLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQWhCVyxRQUFBLGFBQWEsaUJBZ0J4QjtBQUVLLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQW1DLEVBQUUsRUFBRTtJQUMxRSxFQUFVLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUNoQyxPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQTtBQUhZLFFBQUEsUUFBUSxZQUdwQiJ9