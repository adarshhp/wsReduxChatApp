import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Ele {
  x: number;
  y: number;
  count: number;
}
interface EleMap {
  x: number;
  y: number;
}

const FortessGame = () => {
  const [defencedata, setdefencedata] = useState<Ele[]>([]);
  const [defencedatatomap, setdefencedatatomap] = useState<EleMap[]>([]);
  const [hitcount, sethitcount] = useState(0);

  const handlePlus = (x: number, y: number) => {
    const index = defencedata.findIndex((item) => item.x === x && item.y === y);

    if (index !== -1) {
      if (defencedata[index].count >= 3) return;

      // Element exists, update count
      const updated = [...defencedata];
      updated[index] = {
        ...updated[index],
        count: updated[index].count + 1,
      };
      setdefencedata(updated);
    } else {
      // Element does not exist, add new one
      setdefencedata([...defencedata, { x, y, count: 1 }]);
    }
  };

  useEffect(() => {
    // Rebuild the map based on latest defence data
    const newMappedData: EleMap[] = [];

    defencedata.forEach((item) => {
      if (item.count < 1 || item.count > 3) return;

      // Top-left (1,1)
      if (item.x === 1 && item.y === 1 && item.count === 1) {
        newMappedData.push({ x: 4, y: 4 });
      } else if (item.x === 1 && item.y === 1 && item.count === 2) {
        newMappedData.push({ x: 3, y: 3 });
        newMappedData.push({ x: 4, y: 4 });
      } else if (item.x === 1 && item.y === 1 && item.count === 3) {
        newMappedData.push({ x: 2, y: 2 });
        newMappedData.push({ x: 3, y: 3 });
        newMappedData.push({ x: 4, y: 4 });
      }

      // Top (5,1)
      if (item.x === 5 && item.y === 1 && item.count === 1) {
        newMappedData.push({ x: 5, y: 4 });
      } else if (item.x === 5 && item.y === 1 && item.count === 2) {
        newMappedData.push({ x: 5, y: 3 });
        newMappedData.push({ x: 5, y: 4 });
      } else if (item.x === 5 && item.y === 1 && item.count === 3) {
        newMappedData.push({ x: 5, y: 2 });
        newMappedData.push({ x: 5, y: 3 });
        newMappedData.push({ x: 5, y: 4 });
      }

      // Top-right (9,1)
      if (item.x === 9 && item.y === 1 && item.count === 1) {
        newMappedData.push({ x: 6, y: 4 });
      } else if (item.x === 9 && item.y === 1 && item.count === 2) {
        newMappedData.push({ x: 6, y: 4 });
        newMappedData.push({ x: 7, y: 3 });
      } else if (item.x === 9 && item.y === 1 && item.count === 3) {
        newMappedData.push({ x: 6, y: 4 });
        newMappedData.push({ x: 7, y: 3 });
        newMappedData.push({ x: 8, y: 2 });
      }

      // Left (1,5)
      if (item.x === 1 && item.y === 5 && item.count === 1) {
        newMappedData.push({ x: 4, y: 5 });
      } else if (item.x === 1 && item.y === 5 && item.count === 2) {
        newMappedData.push({ x: 3, y: 5 });
        newMappedData.push({ x: 4, y: 5 });
      } else if (item.x === 1 && item.y === 5 && item.count === 3) {
        newMappedData.push({ x: 2, y: 5 });
        newMappedData.push({ x: 3, y: 5 });
        newMappedData.push({ x: 4, y: 5 });
      }

      // Right (9,5)
      if (item.x === 9 && item.y === 5 && item.count === 1) {
        newMappedData.push({ x: 6, y: 5 });
      } else if (item.x === 9 && item.y === 5 && item.count === 2) {
        newMappedData.push({ x: 6, y: 5 });
        newMappedData.push({ x: 7, y: 5 });
      } else if (item.x === 9 && item.y === 5 && item.count === 3) {
        newMappedData.push({ x: 6, y: 5 });
        newMappedData.push({ x: 7, y: 5 });
        newMappedData.push({ x: 8, y: 5 });
      }

      // Bottom-left (1,9)
      if (item.x === 1 && item.y === 9 && item.count === 1) {
        newMappedData.push({ x: 4, y: 6 });
      } else if (item.x === 1 && item.y === 9 && item.count === 2) {
        newMappedData.push({ x: 3, y: 7 });
        newMappedData.push({ x: 4, y: 6 });
      } else if (item.x === 1 && item.y === 9 && item.count === 3) {
        newMappedData.push({ x: 2, y: 8 });
        newMappedData.push({ x: 3, y: 7 });
        newMappedData.push({ x: 4, y: 6 });
      }

      // Bottom (5,9)
      if (item.x === 5 && item.y === 9 && item.count === 1) {
        newMappedData.push({ x: 5, y: 6 });
      } else if (item.x === 5 && item.y === 9 && item.count === 2) {
        newMappedData.push({ x: 5, y: 7 });
        newMappedData.push({ x: 5, y: 6 });
      } else if (item.x === 5 && item.y === 9 && item.count === 3) {
        newMappedData.push({ x: 5, y: 8 });
        newMappedData.push({ x: 5, y: 7 });
        newMappedData.push({ x: 5, y: 6 });
      }

      // Bottom-right (9,9)
      if (item.x === 9 && item.y === 9 && item.count === 1) {
        newMappedData.push({ x: 6, y: 6 });
      } else if (item.x === 9 && item.y === 9 && item.count === 2) {
        newMappedData.push({ x: 6, y: 6 });
        newMappedData.push({ x: 7, y: 7 });
      } else if (item.x === 9 && item.y === 9 && item.count === 3) {
        newMappedData.push({ x: 6, y: 6 });
        newMappedData.push({ x: 7, y: 7 });
        newMappedData.push({ x: 8, y: 8 });
      }
    });

    setdefencedatatomap(newMappedData);
  }, [defencedata]);
  useEffect(() => {
    if (hitcount == 2) {
      toast.success("You Won!!");
      setdefencedata([]);
      setdefencedatatomap([]);
      sethitcount(0);
    }
  }, [hitcount]);

  const handleArrowClick = (x: number, y: number) => {
    const ff = defencedata.some((item: Ele) => item.x == x && item.y == y);
    if (!ff) {
      toast.success("Hit successfully");
      sethitcount(hitcount + 1);
    }

    defencedata.map((item) => {
      if (item.x == x && item.y == y) {
        if (item.count > 1) {
          const Elp: Ele = {
            x: item.x,
            y: item.y,
            count: item.count - 1,
          };
          const selectedData = defencedata.filter((pp) => pp != item);
          const orgData = [...selectedData, Elp];
          setdefencedata(orgData);
          // toast.success("Ohh Nooo! wall");
        } else if (item.count == 1) {
          const selectedData = defencedata.filter((pp) => pp != item);
          setdefencedata(selectedData);
          //     toast.success("Ohh Nooo! wall");
        }
      }
    });
  };
  const HandleSaveGird=()=>{
    console.log(defencedata,"adarshhh")
  }

  return (
<div>
  <ToastContainer />
  <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-100 to-green-100 py-12">
    <div className="flex flex-col md:flex-row gap-12 items-center">
      {/* Your Grid */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Your Grid</h2>
        <div className="w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] grid grid-cols-9 grid-rows-9 border-1 border-green-600 shadow-xl rounded-lg bg-white">
          {/* Central marker */}
          <div className="col-start-5 row-start-5 flex items-center justify-center font-semibold text-yellow-500 text-xl border rounded-md bg-white">
            A
          </div>

          {/* "+" buttons */}
          {[1, 5, 9].map((x) =>
            [1, 5, 9].map((y) => (
              <div
                key={`plus-${x}-${y}`}
                className={`col-start-${x} row-start-${y} flex items-center justify-center border-2cursor-pointer hover:bg-indigo-300 text-xl font-bold text-indigo-700 rounded-md transition-all duration-200 ease-in-out`}
                onClick={() => handlePlus(x, y)}
              >
                +
              </div>
            ))
          )}

          {/* Defense indicators */}
          {defencedatatomap.map((item, index) => (
            <div
              key={`map-${index}`}
              style={{
                gridColumnStart: item.x,
                gridRowStart: item.y,
              }}
              className="flex items-center justify-center text-black font-bold rounded-md w-full h-full transition-all duration-200 ease-in-out"
            >
              O
            </div>
          ))}
        </div>
        <button onClick={()=>HandleSaveGird()} className="bg-black text-white mt-2">Save</button>
      </div>

      {/* Opponent Grid */}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Opponent Grid</h2>
        <div className="w-[40vw] h-[40vw] md:w-[30vw] md:h-[30vw] grid grid-cols-9 grid-rows-9 border-1 border- shadow-xl rounded-lg bg-white">
          {/* Central marker */}
          <div className="col-start-5 row-start-5 flex items-center justify-center font-semibold text-yellow-500 text-xl border rounded-md bg-white">
            B
          </div>

          {/* Arrow attack controls */}
          {[
            { x: 1, y: 1, symbol: "↘" },
            { x: 9, y: 1, symbol: "↙" },
            { x: 9, y: 9, symbol: "↖" },
            { x: 1, y: 9, symbol: "↗" },
            { x: 5, y: 1, symbol: "↓" },
            { x: 9, y: 5, symbol: "←" },
            { x: 5, y: 9, symbol: "↑" },
            { x: 1, y: 5, symbol: "→" },
          ].map((arrow, i) => (
            <div
              key={`arrow-${i}`}
              className={`col-start-${arrow.x} row-start-${arrow.y} flex items-center justify-center border-2  cursor-pointer hover:bg-red-300 text-xl rounded-md transition-all duration-200 ease-in-out`}
              onClick={() => handleArrowClick(arrow.x, arrow.y)}
            >
              {arrow.symbol}
            </div>
          ))}
        </div>
      <button className="bg-black text-white mt-2">Req New Game</button>

      </div>
    </div>
  </div>
</div>

  );
};

export default FortessGame;
