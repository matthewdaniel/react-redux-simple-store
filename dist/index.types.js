"use strict";
/**
 * There is a lot of intricate typescript stuff going on to make this helper
 * easier to use. It would be best to see the readme before trying to grok this code
 * to see what the target is.
 */
// return last type in array of types
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThunk = exports.isHandler = void 0;
const isHandler = (test) => !!test && !(0, exports.isThunk)(test) && typeof test === 'function';
exports.isHandler = isHandler;
const isThunk = (test) => 'thunk' in test;
exports.isThunk = isThunk;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7QUFDSCxxQ0FBcUM7OztBQUs5QixNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVMsRUFBd0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFBLGVBQU8sRUFBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLENBQUM7QUFBeEcsUUFBQSxTQUFTLGFBQStGO0FBRzlHLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBUyxFQUE2QixFQUFFLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUFwRSxRQUFBLE9BQU8sV0FBNkQifQ==