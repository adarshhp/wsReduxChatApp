import React from "react";
import Tao from "./To";
import Fromm from "./FromContext";

const From = () => {
  const numbers = { pp: 2 };
  return (
    <div>
      <Fromm.Provider value={numbers}>
        Hello from From
        <Tao />
      </Fromm.Provider>
    </div>
  );
};

export default From;
