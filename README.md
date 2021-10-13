# makeStore
make store is a helper function to abstract a lot of the redux cruft while 
still allowing typescript safe actions and store data. It will return a reducer to use in combineReducers, an action that should be added to the root action which is the central jump spot for making reducer actions. It also provides a useReducer that simply gets the whole state.

## makeStore Props
>### prop path 
> path to where in combine reducers this lives or string if root prop
>### initial state 
>the state to initialize with. This needs to be typed (see init below)
>### action map 
>provide a map of key (action name) and the function to determin next state. action must have a namespace `:ns/` prefixed. This is primarily for global search making it easier to understand scope of feature integration. Thunks are supported and convention is to prefix with `->` (see below)

## Pure functions
immer is used to help ensure pure function and easier data changes. The state that is provided to your handler is a draft. You can either mutate parts of it *OR* return a new state.

## Building a store
```typescript
const init: MyState = {}
export const { reducer, useSelector, action, afn } = makeStore('task', init, {
    ':name-space/do-thing':
    (state, payload: MyPayload) => {
        state.something = 'else'
    },

    ':name-space/->some-thunk': 
    {thunk: async (dispatch, state, [id]: [id: string]) => {
        // !!! state is just your state but there is a secret prop 'root` with entire state
        // !!! thunks automatically try catch log 
        const res = await something();
        dispatch(build action)
    }
})
// reducer goes into site store
// action/afn get put into feature/action.ts
// useSelector gets imported into a feature hook file for derived state
```

## Making Actions
only use the return action directly in your makeStore call. Everything else should import the global `action`
```typescript
import { action, afn } from '../../feature/action';
const dispatch = useDispatch();

return <div>
    <span>title</span>
    <button onClick={() => dispatch(action(':ns/event-1', 'some-id', 'something-else'))} />
    <button onClick={afn(':ns/event-1', 'some-id', 'something-else')} />
</div>


