import { ThunkAction } from 'redux-thunk';
export declare const throttleThunk: ({ dispatch, getState }: any) => (next: any) => (action: any) => any;
export declare const throttle: (key: string, fn: ThunkAction<any, any, any, any>) => ThunkAction<any, any, any, any>;
//# sourceMappingURL=throttleThunk.d.ts.map