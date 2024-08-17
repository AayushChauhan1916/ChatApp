import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
// import { PiUserCircleLight } from "react-icons/pi";

const checkPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location.state) {
      navigate("/checkemail");
    }
  }, []);

  let userInfo;
  if (location.state) {
    userInfo = location.state.data;
    // console.log(userInfo)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    try {
      e.preventDefault();

      const userData = {
        id: userInfo._id,
        password: data.password,
      };

      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const api_Result = await response.json();
      if (api_Result.success) {
        // console.log(api_Result);
        dispatch(setToken(api_Result.token));
        localStorage.setItem("token", api_Result.token);
        toast.success(api_Result.message);
        navigate("/");
      } else {
        toast.error(api_Result.message);
        console.log(api_Result);
      }
      reset();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="my-3">
      <div className="bg-white p-4 max-w-sm w-full mx-auto">
        <div className="mx-auto mt-2 mb-3 flex justify-center items-center flex-col">
          {/* <PiUserCircleLight size={70} /> */}
          {userInfo && (
            <Avatar
              name={userInfo.name}
              imageUrl={userInfo.profile.url}
              height={70}
              width={70}
            ></Avatar>
          )}
          {userInfo && (
            <h2 className="font-semibold text-lg mt-1 text-slate-800">
              {userInfo.name}
            </h2>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Password: </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("password", {
                required: "password Required",
              })}
            />
            {errors.email && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <button className="bg-primary text-lg mt-5 w-full py-2 hover:bg-secondary font-bold text-white">
            Login
          </button>
        </form>
        <p className="flex justify-center items-center mt-2">
          Not You?&nbsp;
          <Link
            to="/checkEmail"
            className="hover:text-primary underline font-semibold"
          >
            {" "}
            Click Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default checkPassword;
