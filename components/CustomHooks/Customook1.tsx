import React, { useState, useEffect } from 'react';

// Custom Hook: useLocalStorage
// This hook will allow us to easily get and set values from localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useLocalStorage(key:any, initialValue:any) {
  // Get from localStorage or use the initial value
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState(storedValue ? JSON.parse(storedValue) : initialValue);

  useEffect(() => {
    // Update localStorage whenever the value changes
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

function App() {
  // Use the custom hook in your component
  const [name, setName] = useLocalStorage('name', 'John Doe');

  const handleChange = (e) => {
    setName(e.target.value); // This will update both the state and localStorage
  };

  return (
    <div>
      <h1>Custom Hook Example</h1>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Enter your name"
      />
      <p>Your name is: {name}</p>
    </div>
  );
}

export default App;
