import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { RootState } from "../../src/store";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface BoxResponse {
  xo_id: number;
  box_no: string;
  box_value: string;
}

const XOgame = () => {
  const [chance, setchance] = useState<"X" | "O" | "">("");
  const [refetch, setrefetch] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [nextgame, setnextgame] = useState(false);

  const ref00 = useRef<HTMLInputElement>(null);
  const ref01 = useRef<HTMLInputElement>(null);
  const ref02 = useRef<HTMLInputElement>(null);
  const ref10 = useRef<HTMLInputElement>(null);
  const ref11 = useRef<HTMLInputElement>(null);
  const ref12 = useRef<HTMLInputElement>(null);
  const ref20 = useRef<HTMLInputElement>(null);
  const ref21 = useRef<HTMLInputElement>(null);
  const ref22 = useRef<HTMLInputElement>(null);
  const crearedBY = useSelector((state: RootState) => state.login.userId);

  const refMap: Record<string, React.RefObject<HTMLInputElement | null>> = {
    ref00,
    ref01,
    ref02,
    ref10,
    ref11,
    ref12,
    ref20,
    ref21,
    ref22,
  };

  const handleClick = async (refKey: string) => {
    try {
      const ref = refMap[refKey];
      const pp = refKey.replace("ref", "");

      const orgbox_no =
        pp == "00"
          ? "0"
          : pp == "01"
          ? "1"
          : pp == "02"
          ? "2"
          : pp == "10"
          ? "3"
          : pp == "11"
          ? "4"
          : pp == "12"
          ? "5"
          : pp == "20"
          ? "6"
          : pp == "21"
          ? "7"
          : pp == "22"
          ? "8"
          : pp;

      if (ref?.current) {
        const data = {
          box_no: orgbox_no,
          box_value: chance,
          userid: crearedBY,
        };
        const Orgdata = {
          type: 2,
          data: data,
        };

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(JSON.stringify(Orgdata));
        }
        // const response = await axios.post(`${BASE_URL}/PutXO`, data);
        // const status = response?.data?.statuscode;

        // if (status === 200 || status === 209 || status === 201) {
        //   setrefetch((prev) => !prev);
        // }

        // toast.success(response?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socketRef.current = new WebSocket("ws://192.168.2.84:7160/ws");
    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    axios.get(`${BASE_URL}/GetXO`).then((response) => {
      if (
        response?.data?.statuscode == 101 ||
        response?.data?.statuscode == 201 ||
        response?.data?.statuscode == 301
      ) {
        toast.success(response?.data?.message);
      }

      const Xnumber = response?.data?.data.filter(
        (item: BoxResponse) => item.box_value == "X"
      ).length;
      const Onumber = response?.data?.data?.filter(
        (item: BoxResponse) => item.box_value == "O"
      ).length;

      if (Xnumber > Onumber) {
        setchance("O");
      } else if (Xnumber < Onumber) {
        setchance("X");
      } else {
        setchance((prev) => (prev === "X" ? "O" : "X"));
      }
      console.log(response?.data?.data.length, "lengthy");
      if (response?.data?.data.length == 0) {
        if (ref00.current) ref00.current.value = "";
        if (ref01.current) ref01.current.value = "";
        if (ref02.current) ref02.current.value = "";
        if (ref10.current) ref10.current.value = "";
        if (ref11.current) ref11.current.value = "";
        if (ref12.current) ref12.current.value = "";
        if (ref20.current) ref20.current.value = "";
        if (ref21.current) ref21.current.value = "";
        if (ref22.current) ref22.current.value = "";
      }

      // Update the board values based on the response
      response?.data?.data.forEach((item: BoxResponse) => {
        switch (item.box_no) {
          case "0":
            if (ref00.current) ref00.current.value = item.box_value;
            break;
          case "1":
            if (ref01.current) ref01.current.value = item.box_value;
            break;
          case "2":
            if (ref02.current) ref02.current.value = item.box_value;
            break;
          case "3":
            if (ref10.current) ref10.current.value = item.box_value;
            break;
          case "4":
            if (ref11.current) ref11.current.value = item.box_value;
            break;
          case "5":
            if (ref12.current) ref12.current.value = item.box_value;
            break;
          case "6":
            if (ref20.current) ref20.current.value = item.box_value;
            break;
          case "7":
            if (ref21.current) ref21.current.value = item.box_value;
            break;
          case "8":
            if (ref22.current) ref22.current.value = item.box_value;
            break;
        }
      });

      // Check for a winner
      const winner = checkWinner(response?.data?.data);
      if (winner) {
        toast.success(`${winner} wins!`);
        setchance(""); // Reset the game or disable further moves
      }
    });

    socketRef.current.onmessage = (event) => {
      const response = JSON.parse(event?.data).data;

      if (
        response?.data?.statuscode == 101 ||
        response?.data?.statuscode == 201 ||
        response?.data?.statuscode == 301
      ) {
        toast.success(response?.data?.message);
      }

      const Xnumber = response?.data?.filter(
        (item: BoxResponse) => item.box_value == "X"
      ).length;
      const Onumber = response?.data?.filter(
        (item: BoxResponse) => item.box_value == "O"
      ).length;

      if (Xnumber > Onumber) {
        setchance("O");
      } else if (Xnumber < Onumber) {
        setchance("X");
      } else {
        setchance((prev) => (prev === "X" ? "O" : "X"));
      }

      // Update the board values based on the response
      response?.data?.forEach((item: BoxResponse) => {
        switch (item.box_no) {
          case "0":
            if (ref00.current) ref00.current.value = item.box_value;
            break;
          case "1":
            if (ref01.current) ref01.current.value = item.box_value;
            break;
          case "2":
            if (ref02.current) ref02.current.value = item.box_value;
            break;
          case "3":
            if (ref10.current) ref10.current.value = item.box_value;
            break;
          case "4":
            if (ref11.current) ref11.current.value = item.box_value;
            break;
          case "5":
            if (ref12.current) ref12.current.value = item.box_value;
            break;
          case "6":
            if (ref20.current) ref20.current.value = item.box_value;
            break;
          case "7":
            if (ref21.current) ref21.current.value = item.box_value;
            break;
          case "8":
            if (ref22.current) ref22.current.value = item.box_value;
            break;
        }
      });

      // Check for a winner
      const winner = checkWinner(response?.data);
      console.log(winner, "adarsh");
      if (winner) {
        setnextgame(true);
        toast.success(`${winner} wins!`);
        setchance(""); // Reset the game or disable further moves
      }
      if (response?.data?.length == 9 && !winner) {
        setnextgame(true);
        toast.success(`Its a Draw`);
        setchance(""); // Reset the
      }
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [refetch]);

  //region SSE

  useEffect(() => {
    const eventSource = new EventSource("http://192.168.2.84:7160/sse");

    eventSource.onmessage = (event) => {
      console.log("New message:", event.data);
    };

    return () => {
      eventSource.close(); // Terminate connection on component unmount
      console.log("SSE connection closed.");
    };
  }, []);

  //endregion

  const checkWinner = (data: BoxResponse[]) => {
    // Sort the data by box_no to ensure it's in a predictable order
    const sortedData = data.sort(
      (a, b) => parseInt(a.box_no) - parseInt(b.box_no)
    );

    // Convert sortedData into a 3x3 array (row by row)
    const board = [
      sortedData.slice(0, 3), // First row: positions 0, 1, 2
      sortedData.slice(3, 6), // Second row: positions 3, 4, 5
      sortedData.slice(6, 9), // Third row: positions 6, 7, 8
    ];

    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0]?.box_value &&
        board[row][0]?.box_value === board[row][1]?.box_value &&
        board[row][0]?.box_value === board[row][2]?.box_value
      ) {
        return board[row][0]?.box_value; // Return winner if found
      }
    }

    for (let col = 0; col < 3; col++) {
      if (
        board[0][col]?.box_value &&
        board[0][col]?.box_value === board[1][col]?.box_value &&
        board[0][col]?.box_value === board[2][col]?.box_value
      ) {
        return board[0][col]?.box_value;
      }
    }
    // Check diagonals
    if (
      board[0][0]?.box_value &&
      board[0][0]?.box_value === board[1][1]?.box_value &&
      board[0][0]?.box_value === board[2][2]?.box_value
    ) {
      return board[0][0]?.box_value;
    }
    if (
      board[0][2]?.box_value &&
      board[0][2]?.box_value === board[1][1]?.box_value &&
      board[0][2]?.box_value === board[2][0]?.box_value
    ) {
      return board[0][2]?.box_value;
    }

    return null; // No winner yet
  };

  const handleRequest = () => {
    axios.get(`${BASE_URL}/clearXo`).then((response) => {
      if (response?.data?.statuscode == 200) {
        setnextgame(false);
        setrefetch(!refetch);
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="fixed top-2 left-2 text-white">
        <button onClick={() => handleRequest()}>REset game</button>
      </div>
      {nextgame && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-sm">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full transition"
              onClick={() => handleRequest()}
            >
              Next Game
            </button>
          </div>
        </div>
      )}
      <ToastContainer />

      <div className="h-[27vh] w-[27vh] grid grid-cols-3 grid-rows-3">
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref00}
          onClick={() => handleClick("ref00")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref01}
          onClick={() => handleClick("ref01")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref02}
          onClick={() => handleClick("ref02")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref10}
          onClick={() => handleClick("ref10")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref11}
          onClick={() => handleClick("ref11")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref12}
          onClick={() => handleClick("ref12")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref20}
          onClick={() => handleClick("ref20")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref21}
          onClick={() => handleClick("ref21")}
          disabled={chance === ""}
        />
        <input
          className="border-[0.5px] border-gray-600 text-center cursor-pointer disabled readOnly"
          type="button"
          ref={ref22}
          onClick={() => handleClick("ref22")}
          disabled={chance === ""}
        />
      </div>
    </div>
  );
};

export default XOgame;
