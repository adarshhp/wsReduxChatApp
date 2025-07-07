// src/App.tsx
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../src/features/CounterSlice';
import { RootState } from '../src/store'; // Import RootState to type the state
import { decrease, increase,add } from '../src/features/Numberslice';
import React from 'react';

function App() {
  // Get the counter value from the Redux store
  const count = useSelector((state: RootState) => state.counter.value);
  const count2=useSelector((state:RootState)=>state.number.value);

  const dispatch = useDispatch();
//check reduc operations and funcitonality in conmponents/chatapp/groups
  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <h2>Counter 2:{count2}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button> 
      <button onClick={() => dispatch(increase())}>increase</button>
      <button onClick={() => dispatch(decrease())}>decrease</button>
      <button onClick={() => dispatch(add())}>Add</button>
    </div>
  );
}

export default App;
