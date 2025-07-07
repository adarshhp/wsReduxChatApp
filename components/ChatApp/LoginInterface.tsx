import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS
import { setLogin } from "../../src/features/LoginSlice";
import { useDispatch } from "react-redux";

const BASE_URL=import.meta.env.VITE_BASE_URL;

const LoginInterface = () => {
  const { register, watch, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [login, setlogin] = useState(true);
  const dispatch=useDispatch();
 


  const onSubmit = () => {
    if (login) {


      // const data = {
      //   email_id: watch("emailId"),
      //   password: watch("password"),
      // };


      // axios
      //   .post(`${BASE_URL}/loginapi`, data)
      //   .then(async (response) => {
      //     if (response?.data?.statuscode === 200) {
      //       const userId=response?.data?.userId
      //       const userResponse = await axios.post(`${BASE_URL}/getuserbyId`, [userId]);
      //       const data={
      //         name:userResponse?.data[0].username,
      //         userId:response?.data?.userId
      //       }
      //       dispatch(setLogin(data));
      //       navigate("/grouppage");
      //       toast.success("Successfully logged in!"); // Success toast
      //     } else {
      //       toast.error("Login failed. Please check your credentials."); // Error toast
      //     }
      //   })
      //   .catch(() => {
      //     toast.error("Something went wrong. Please try again later."); // Error toast for API failure
      //   });
const data3={
   email: watch("emailId"),
  password: watch("password")
}
   axios
        .post(`http://localhost:8090/login`, data3)
        .then(async (response) => {
          if (response?.data?.statusCode === 200) {
            localStorage.setItem("jwt",response?.data?.jwt)
            //const userId=response?.data?.userId
            //const userResponse = await axios.post(`${BASE_URL}/getuserbyId`, [userId]);
            // const data={
            //   name:userResponse?.data[0].username,
            //   userId:response?.data?.userId
            // }
            // dispatch(setLogin(data));
            navigate("/grouppage");
            toast.success("Successfully logged in!"); // Success toast
          } else {
            toast.error("Login failed. Please check your credentials."); // Error toast
          }
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again later."); // Error toast for API failure
        });


    } else {
      // const data = {
      //   name: watch("name"),
      //   password: watch("password"),
      //   email_id:watch("emailId")
      // };
const data_spring = {
  email: watch("emailId"),
  name: watch("name"),
  password: watch("password")
}

      // axios
      //   .post(`${BASE_URL}/signinapi`, data)
      //   .then((response) => {
      //     if (response?.data?.statuscode === 200) {
      //       setValue("name", "");
      //       setValue("password", "");
      //       setlogin(true);
      //       toast.success("Account created successfully!"); // Success toast for sign up
      //     } else {
      //       toast.error("Sign up failed. Please try again."); // Error toast
      //     }
      //   })
      //   .catch(() => {
      //     toast.error("Something went wrong. Please try again later."); // Error toast for API failure
      //   });
 axios
        .post(`http://localhost:8090/signup`, data_spring)
        .then((response) => {
          if (response?.data?.statusCode === 200) {
            setValue("name", "");
            setValue("password", "");
            setlogin(true);
            toast.success("Account created successfully!"); // Success toast for sign up
          } else {
            toast.error("Sign up failed. Please try again."); // Error toast
          }
        })
        .catch(() => {
          toast.error("Something went wrong. Please try again later."); // Error toast for API failure
        });


    }
  };

  return (
    <div 
    className="flex justify-center items-center min-h-screen bg-gradient-to-r"
    >
      <div 
      className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 
       className="text-3xl font-semibold text-center text-gray-800 mb-8"
        >
          {login ? "Log In" : "Sign Up"}
        </h2>

        <div
        className="text-center mb-6"
         >
          <button
            onClick={() => setlogin(!login)}
           className="text-sm text-blue-600 font-semibold hover:underline"
          >
            {login ? "Create an Account" : "Already have an account? Log In"}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div 
         className="flex flex-col gap-4"
          >
            {/* Conditionally Render Fields Based on the Form */}
            {!login&&(

            <input
             className="w-full h-14 bg-gray-100 text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              {...register("name")}
              placeholder="Enter Full Name"
              autoFocus
            />
            )}
             <input
             className="w-full h-14 bg-gray-100 text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              {...register("emailId")}
              placeholder="Enter Email Id"
            />
            <input
             className="w-full h-14 bg-gray-100 text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              {...register("password")}
              placeholder="Enter Password"
              type="password"
            />
            

          </div>

          <button
            type="submit"
           className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transform transition duration-300 ease-in-out hover:scale-105"
          >
            {login ? "Log In" : "Sign Up"}
          </button>

          {login && (
            <div className="mt-4 text-center">
              <span
              className="text-sm text-gray-600"
               >
                Forgot your password?{" "}
                <a href="#" 
               className="text-blue-600 hover:underline"
                >
                  Reset here
                </a>
              </span>
            </div>
          )}
        </form>
      </div>

      {/* ToastContainer to render the toasts */}
      <ToastContainer />
    </div>
  );
};

export default LoginInterface;
