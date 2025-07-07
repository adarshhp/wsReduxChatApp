import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import { RootState } from "../../src/store";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const Base_URL = import.meta.env.VITE_BASE_URL;

interface REsp {
  learn_id: string;
  name?: string;
  message?: string;
}

const ChatApp = () => {
  const [resp, setresp] = useState<REsp[]>([]);
  const [load, reload] = useState(false);
  const [edit, seteditId] = useState("");
  const [name, seteditName] = useState("");
  const [friend, setfriend] = useState(false);
  const { register, watch, handleSubmit, setValue } = useForm();
  const socketRef = useRef<WebSocket | null>(null);

  const { id } = useParams<{ id?: string }>();
  const parsedId = id ? parseInt(id) : null;

  const username = useSelector((state: RootState) => state.login.name);

  useEffect(() => {
    if (parsedId !== null) {
      axios
        .get(`${Base_URL}/GetLearnings?groupid=${parsedId}`)
        .then((response) => {
          setresp(response?.data);
        });

      socketRef.current = new WebSocket("ws://localhost:7160/ws");

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data.data)) {
          setresp(data.data); // overwrite existing messages
        } else {
          setresp((prev) => [...prev, data.data]);
        }
      };

      socketRef.current.onclose = () => {
        console.log("❌ WebSocket disconnected");
      };

      return () => {
        socketRef.current?.close();
      };
    }
  }, [parsedId]);

  const onSubmit = () => {
    const message = watch("message");
    if (!message?.trim()) return;
    const payload = {
      name: username,
      message,
      group_id: parsedId,
      is_deleted: 0,
    };

   const Orgdata = {
      type: 1,
      data: payload
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(Orgdata));
    }
    setValue("message", "");
  };

  const onEdit = () => {
    const data = {
      learn_id: edit,
      name: name,
      message: watch("editmessage"),
      group_id: parsedId,
    };
    axios.post(`${Base_URL}/EditLearning`, data).then(() => {
      reload(!load);
      seteditId("");
    });
    setValue("editname", "");
    setValue("editmessage", "");
  };

  const handleDelete = (e: string) => {
    axios.post(`${Base_URL}/deleteLearing?id=${e}`).then(() => {
      reload(!load);
    });
  };

  const handleEdit = (e: REsp) => {
    if (e.name) seteditName(e.name);

    setValue("editmessage", e.message);
    seteditId(e.learn_id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleAddFriend = () => {
    setfriend(false);
    const data = {
      emailId: watch("friendemail"),
      group_id: parsedId,
    };
    axios.post(`${Base_URL}/grandaccessbyemailId`, data).then((response) => {
      console.log(response);
      if (response?.data?.statuscode == 200)
        toast.success("Successfully Added your friend"); // Success toast
    });
  };

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center py-10 px-[15vw]">
      <ToastContainer />

      {/* Invite Friend */}
      <div className="fixed top-4 left-4 bg-blue-500 text-white text-center py-3 px-6 rounded-md shadow-md">
        <p
          className="text-sm font-semibold cursor-pointer"
          onClick={() => setfriend(true)}
        >
          Invite a Friend
        </p>
        {friend && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex flex-col justify-center items-center z-50">
            <p className="text-black">Add guest by emailId</p>
            <span className="flex flex-row gap-3">
              <input
                {...register("friendemail")}
                className="w-full p-4 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[25vw] text-black"
                placeholder="Enter Email Address"
                autoFocus
              />
              <button onClick={() => handleAddFriend()}>Add</button>
            </span>
          </div>
        )}
      </div>

      {/* Welcome */}
      <div className="fixed top-4 right-4 bg-blue-500 text-white text-center py-3 px-6 rounded-md shadow-md">
        <p className="text-sm font-semibold">Welcome, {username || "Guest"}!</p>
      </div>

      {/* Edit Modal */}
      {edit && (
        <div className="w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 z-10 flex justify-center items-center">
          <div className="w-full max-w-[800px] h-[50vh] bg-white rounded-lg shadow-xl p-6 flex flex-col items-center z-50">
            <h2 className="text-xl font-semibold mb-4">Edit Message</h2>
            <form
              onSubmit={handleSubmit(onEdit)}
              className="flex flex-col items-center w-full space-y-4"
            >
              <textarea
                className="w-full h-24 bg-blue-100 text-black rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("editmessage")}
                placeholder="Enter Message"
              />
              <button
                type="submit"
                className="w-full h-12 bg-blue-500 text-white rounded-md text-lg transition duration-300 hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Messages */}
      <div className="w-full max-w-full space-y-4 mt-6">
        {resp?.map((item) => (
          <div
            key={item.learn_id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-50"
          >
            <div className="flex flex-row gap-4">
              <p className="font-semibold text-lg text-blue-500">{item.name}</p>
              <p className="text-gray-600">{item.message}</p>
            </div>
            <div className="flex items-center space-x-4">
              {username === item.name && (
                <>
                  <span
                    className="cursor-pointer text-red-500 text-xl transition duration-300 transform hover:scale-110"
                    onClick={() => handleDelete(item.learn_id)}
                  >
                    &#10006;
                  </span>
                  <span
                    className="cursor-pointer text-blue-500 text-xl transition duration-300 transform hover:scale-110"
                    onClick={() => handleEdit(item)}
                  >
                    &#9998;
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send Message */}
      <div className="flex flex-col items-center w-full max-w-full bg-white p-6 rounded-lg shadow-xl mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <textarea
            className="w-full h-24 bg-blue-100 text-black rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("message")}
            placeholder="Enter Message"
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="w-full h-12 bg-blue-500 text-white rounded-md text-lg transition duration-300 hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
