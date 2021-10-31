# makeStore
make store is a helper function to abstract a lot of the redux cruft while 
still allowing typescript safe actions and store data. Also adds several other useful tools

### Reduce cruft
example common redux pattern.
```typescript
// Add the action type
export const ADD_TODO = 'TODO: Add' as const;
export const LOADING_FLAG = 'TODO: Loading' as const;
export const INIT_TODOS = 'TODO: Init' as const;

// add action builders
export const addTodo = (todo: iTodo) => ({
    type: ADD_TODO,
    payload: { todo }
});
export const setLoadTodo = (state: boolean) => ({
    type: LOADING_FLAG,
    payload: { state }
})
export const initTodos = (state: iTodo[]) => ({
    type: INIT_TODOS,
    payload: { todos }
})

export const loadTodos = () => async (dispatch, getState) => {
    dispatch(setLoadingTodo(true));
    dispatch(initTodos(await fetchTodos()))
    dispatch(setLoadingTodos(false));
}
// register reducer
interface iTodoStore {
    todos?: [],
    loading?: boolean,
}
const reducer = (state = {} as iTodoStore, action) => {
    switch (action.type) {
        case ADD_TODO:
            // notice each action almost always has one payload handle section
            return {
                ...state,
                todos: [].concat(state.todos ?? []).concat([action.payload.task]),
            }
        case LOADING_FLAG:
            return { ...state, loading: action.payload.state };
        case INIT_TODOS:
            return {
                ...state
                todos: action.payload.todos,
                loading: false
            }
        default:
            return state;
    }
}
```

Rather than repeating this same pattern, this store uses namespaced strings. This allows for one
to easily dispatch without having to dig around for the action makers. It also colocates your action
with your handler making it simpler to grok the feature and make refactors. The more reducers like above 
that you have the more this below pattern will provide code cruft saving. 

```typescript
interface iTodoStore {
    todos?: iTodo[],
    loading?: boolean,
}
type iTodo = any;
const { dispatch, ...store } = new Store('todos', {} as iTodoStore, {
    ':todos/add-todo': (state, [todo]: [todo: iTodo]) => ({ 
        ...state, 
        todos: [].concat(state.todos ?? [] as any).concat(todo) 
    }),
    ':todos/set-load': (state, [loading]: [loading: boolean]) => ({...state, loading }),
    ':todos/init-todos': (state, [todos]: [todos: iTodo[]]) => ({...state, todos }),
    ':todos/->load-todos': { thunk: async (getState) => {
        dispatch(':todos/set-load', true);
        dispatch(':todos/init-todos', await getTodos());
        dispatch(':todos/set-load', false);
    }}
});

```
using dispatch deduces all your actions and correct payloads and provides type safety 
![Dispatch actions ts helper](https://d39asnknou4mxp.cloudfront.net/redux-helper/dispatch-actions.png)
![Dispatch actions ts helper](https://d39asnknou4mxp.cloudfront.net/redux-helper/dispatch-action-vars.png)

# Getting started
### install
`npm install react-redux-simple-store`
### namepsacing convention
namespaces are conventions in the string like the following. They are enforced at runtime. Thunks have and arrow `->` that proceed the namespace.
```
:namespace/some-action
:namespace/->some-thunk
```

### building a store
you can combine multiple simple stores but namespacing may help you to not need to do that and only if your data is definitely isolated.
```typescript
import { createGlobalStore, Store } from 'react-redux-simple-store';

// this goes in your redux provider <Provider store={store}>
export const store = createGlobalStore([s], [], process.env.NODE_ENV === 'development');

interface iMyStore = {...}
const initState: iMyStore = {} as const;
const globalStoreProp = 'my-feature' as const;
const s = new Store(globalStoreProp, initState, 
// action map
{
    ':my-feature/some-action': (state, [n]: [n: number]) => {
        // must be a pure function
        // see clj-ports for useful typesafe immutable data helpers
        return {...new state}
    }
});

// see below for documentation
export const dispatch = s.dispatch;
export const dispatcher = s.dispatcher;
export const useSelector = s.useSelector;
export const multiDispatcher = s.multiDispatch;
```

### making an action map
action maps consist of the action name and a handler. The params you want to pass must be registered in an array. (note dispatch will be passed them spread)
It highly advised to use named params in typing your array. typescript ide helpers will be clearer.
```typescript
const s = new Store(globalStoreProp, initState, 
// action map
{
    // do this
    (state, [idx]: [idx: number]) =>
    // not this
    (state, [idx]: [number]) =>
});
```


That's it. The helper function know your data and typescript 
will help you with typesafe action dispatching on the fly.

# Helper functions 
## dispatch
dispatch takes action ...params, see this example for how to dispatch and action
```typescript
// from action map
{
    ':my-feature/register', (state, [id, name, email]: [id: number, name: string, email: string]) => {},
    ':my-feature/maybe-change-state', (state, [val]: [val: boolean]) => {
        // returning a new state is not required and will result in 
        // no state change happening.
        if (!val) return;

        // state change here
    }
}

// from component
import { dispatch } from '/path-to-store';

const Register = () => {
    const [id, setId] = useState('pretend');
    const [name, setName] = useState('pretend');
    const [email, setEmail] = useState('pretend');

    // notice the params are not passed as an array
    return <div>
        <button onClick={() => dispatch('my-feature', id, name, email)}>Register</button>
    </div>
}
```
## dispatcher
this is just a curried dispatch. Instead of you providing the anonomous function in your click handler you can just use a dispatcher. from the example bove you could instead do.
```typescript

return <button onClick={dispatcher('my-feature', id, name, email)}>
    Register
</button>
```

## useSelector
This is just a typed useSelector with your store slice. See react-redux docs for use selector

## multiDispatcher
Makes a function that when called will dispatch multiple actions. Same as dispatcher but takes a list of actions.
```typescript
return <button onClick={multiDispatcher([
    [':my-feature/hide-menu'], [':my-feature/remove-item', 123], [':my-feature/notify-removed', 123]
])}>
    Click Me
</button>
```

## queue
this is a special helper that shouldn't be exported and is used inside of action handlers to signal side effects. Rather than duplicating state changes that exist in other actions you can queue up an action to be handled after you've changed state. eg
```typescript
{
    ':menu/close': (state) => ({ ...state, menu: false }),
    ':mouse-actions/mouse-out': (state) => store.queue(':menu/close'),
    ':keyboard-events/esc': (state) => {
        store.queue(':menu/close');
        store.queue(':thing/discard-active');
        store.queue(':log/->log-event')
    };
}
```