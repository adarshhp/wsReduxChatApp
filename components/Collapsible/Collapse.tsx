import React, { ReactNode, useState } from "react";

const Collapse = () => {
  const [open, setopen] = useState(false);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <button
        onClick={() => setopen(!open)}
        className="h-8 bg-amber-100 flex justify-center items-center rounded-md w-[90vw] mt-20"
      >
        open collapse
      </button>
      <Collapser open={open}>
        <div>hello dude</div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </Collapser>
    </div>
  );
};

export default Collapse;

interface Collapserprop {
  children: ReactNode;
  open: boolean;
}
const Collapser: React.FC<Collapserprop> = ({ children, open }) => {
  return (
    <div className="h-10 w-full mx-9  flex items-center justify-center mt-10 rounded-2xl">
      <div className="grid grid-cols-3 bg-amber-100 w-[90vw] rounded-md">
        {open && children}
      </div>
    </div>
  );
};
