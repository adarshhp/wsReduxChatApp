import React, { useEffect, useReducer, useRef, useState } from "react";

const Task1 = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [add, setAdd] = useState("");

  const todoReducer = (state, action) => {
    switch (action.type) {
      case "Add":
        return { values: [...state.values, add] };
      case "Remove":
        return {
          values: state.values.filter((value) => value !== action.val),
        };
        case "Reset":
          return{
            values:[]
          }

      default:
        return state;
    }
  };

  const initialState = { values: ["uhuu"] };

  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state.values.length]);

  console.log(state.values);

  return (
    <div className="w-full h-full bg-white">

      <div className="w-full flex gap-0.5 justify-center">
        <input
          className="w-[50vw] bg-amber-100 text-black"
          ref={inputRef}
          onChange={(e) => setAdd(e.target.value)}
        />
        <button
          className="w-f"
          onClick={() => {
            dispatch({ type: "Add" });
          }}
        >
          Add Item
        </button>
        <button onClick={()=>{dispatch({type:"Reset"})}}>
          Reset
        </button>
      </div>
      <div>
        {state.values.length > 0 ? (
          state.values.map((item, index) => (
            <div key={index} className="bg-red-100 p-2 m-1 text-black">
              {item}
              <button
                className="w-4 h-4 bg-neutral-500 flex justify-center items-center"
                onClick={() => dispatch({ type: "Remove", val: item })}
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p>No items added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Task1;
