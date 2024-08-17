import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadImage from "../helpers/uploadFile";
import toast from "react-hot-toast";

const RegisterUser = () => {
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const [imageInfo, setImageInfo] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const toastLoading = toast.loading("loading...");
    try {
      let profileInfo;
      let imageInfo;
      if (image) {
        imageInfo = await uploadImage(image);
        profileInfo = {
          public_id: imageInfo.public_id,
          url: imageInfo.secure_url,
        };
      }

      const registerData = {
        ...data,
        profile: profileInfo,
      };

      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const api_Result = await response.json();
      if (api_Result.success == true) {
        toast.dismiss(toastLoading);
        toast.success("Register Successfully");
        navigate("/checkemail");
      } else {
        toast.dismiss(toastLoading);
        toast.error(api_Result.message);
      }
      reset();
      setImage("");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage("");
  };

  return (
    <div className="my-3">
      <div className="bg-white p-4 max-w-sm w-full mx-auto">
        Welcome to Chat App
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Name: </label>
            <input
              placeholder="Enter Your Name"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("name", { required: "name must required" })}
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Email: </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("email", {
                required: "Email Required",
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Password: </label>
            <input
              type="password"
              placeholder="Enter Your password"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("password", {
                required: "password Required",
                // pattern: {
                //   value:
                //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                //   message: `at least 8 characters\n
                //   - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
                //   - Can contain special characters`,
                // },
              })}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {/* register your input into the hook by invoking the "register" function */}
            <label htmlFor="name">Confirm Password </label>
            <input
              type="password"
              placeholder="Enter password again"
              className="bg-slate-200 px-2 py-1 focus:outline-primary"
              {...register("confirmPassword", {
                validate: (value, formValues) =>
                  value === formValues.password || "password does not matched",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="profilepic">
              Profile Pic
              <div className=" h-14 bg-slate-200 flex flex-row justify-center items-center border cursor-pointer hover:border-primary">
                <p className="text-sm">
                  {image == "" ? "upload profile photo" : image.name}
                </p>
                {image && (
                  <button
                    className="text-lg ml-2 mt-1 text-red-600"
                    onClick={handleRemoveImage}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              name="profilepic"
              id="profilepic"
              className="hidden"
              onChange={(e) => handleImage(e)}
            />
          </div>
          <button className="bg-primary text-lg mt-5 w-full py-2 hover:bg-secondary font-bold text-white">
            Register
          </button>
        </form>
        <p className="flex justify-center items-center mt-2">
          Already have an account?&nbsp;
          <Link
            to="/checkemail"
            className="hover:text-primary underline font-semibold"
          >
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
