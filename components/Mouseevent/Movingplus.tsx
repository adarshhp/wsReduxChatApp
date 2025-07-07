import React, { useState } from "react";

const Movingplus = () => {
  const [hover, setHover] = useState(false);
  const [mouseX, setMouseX] = useState(0);

 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Type assertion to ensure e.target is treated as an HTMLDivElement
    const lineRect = (e.target as HTMLDivElement).getBoundingClientRect();
    const xPosition = e.clientX - lineRect.left; // Get the X coordinate relative to the line
    setMouseX(xPosition);
  };

  return (
    <div className="flex justify-center items-center h-full">
        
      <div
        className="h-[1px] w-full bg-red-500 text-2xl font-bold text-black relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMouseMove}
      >
        {hover && (
          <span
            style={{
              position: "absolute",
              left: mouseX  + "px", // Adjust the position to center the "+" sign
              transform: "translateX(-50%)",
            }}
          >
            +
          </span>
        )}
      </div>

    </div>
  );
};

export default Movingplus;
