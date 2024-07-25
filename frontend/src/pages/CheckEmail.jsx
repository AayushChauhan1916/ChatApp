import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PiUserCircleLight } from "react-icons/pi";

const CheckEmail = () => {
  const navigate = useNavigate();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    try {
      e.preventDefault();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/auth/email`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const api_Result = await response.json();
      if (api_Result.success) {
        toast.success(api_Result.message);
        navigate("/checkpassword",{
          state:api_Result
        });
      } else {
        toast.error(api_Result.message);
      }

      reset();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="my-3">
      <div className="bg-white p-4 max-w-sm w-full mx-auto">
        <div className="w-fit mx-auto mt-2 mb-3">
        <PiUserCircleLight size={70} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Email: </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("email", {
                required: "Email Required",
                // pattern: {
                //   value:
                //     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                //   message: "Enter a valid email",
                // },
              })}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <button className="bg-primary text-lg mt-5 w-full py-2 hover:bg-secondary font-bold text-white">
            Verify
          </button>
        </form>
        <p className="flex justify-center items-center mt-2">
          New User?&nbsp;
          <Link
            to="/register"
            className="hover:text-primary underline font-semibold"
          >
            {" "}
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmail;
