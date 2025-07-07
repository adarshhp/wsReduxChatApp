import React from "react";
import { useReducer } from "react";

// Reducer function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const counterReducer = (state: any, action: any) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    case "incrementByAmount": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ppConcatenated =
        action.array?.map((item: { pp: unknown }) => item.pp).join("") || "";
      return {
        count:
          ((state.count as number) + (action.payload || 0)).toString() +
          (action.number || "") +
          ppConcatenated,
      };
    }

    default:
      return state;
  }
};

const CounterApp = () => {
  // Initial state
  const initialState = { count: 0 };

  // Use useReducer hook
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <h1>Counter: {state.count}</h1>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button
        onClick={() =>
          dispatch({
            type: "incrementByAmount",
            payload: 6,
            number: "hello",
            array: [{ pp: 24 }, { pp: 23 }],
          })
        }
      >
        Increment by 6
      </button>
    </div>
  );
};

export default CounterApp;
