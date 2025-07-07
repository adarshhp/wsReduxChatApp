import React from 'react';
import useStore from '../../src/ZustandStore/useStore';

const Counter = () => {
  const { count, increase, decrease } = useStore();  // Access state and actions

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  );
};

export default Counter;
