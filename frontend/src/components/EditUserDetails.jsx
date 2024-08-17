import React, { useEffect } from "react";
import Avatar from "../components/Avatar";
import { useState, useRef } from "react";
import Divider from "./Divider";
import { IoClose } from "react-icons/io5";
import uploadImage from "../helpers/uploadFile";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [image, setImage] = useState("");
  const [removeImage, setremoveImage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(user);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage("");
  };

  const [data, setData] = useState({
    name: user?.name,
    _id: user?._id,
    imageUrl: user.profile?.url,
    public_id: user.profile?.public_id,
  });

  // console.log(data);

  const handleChange = (e) => {
    let { name, value } = e.target;

    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
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

      if (removeImage == true) {
        registerData.removeImage = true;
      }

      const response = await fetch(`/api/auth/editprofile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        credentials: "include",
      });

      const api_Result = await response.json();
      // console.log(api_Result);
      if (api_Result.success == true) {
        toast.dismiss(toastLoading);
        toast.success("Profile Update Successfully");
        onClose();
        dispatch(setUser(api_Result.message));
        setData({
          name: "",
          imageUrl: "",
        });
        setImage("");
        setremoveImage(false);
        navigate("/");
      } else {
        toast.dismiss(toastLoading);
        toast.error(api_Result.message);
      }
    } catch (err) {
      // console.log(err);
      toast.error(err.message);
    }
  };

  const handleRemoveExistImage = (e) => {
    e.preventDefault();
    setremoveImage(true);
    toast.success("click on save to see changes");
  };

  const handleUploadPhoto = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="top-0 bottom-0 right-0 left-0 fixed bg-gray-700 bg-opacity-40 flex justify-center z-10 items-center">
      <div className="bg-white p-4 py-5 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit Profile Details</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label htmlFor="name">Name:</label>
            <br></br>
            <input
              type="text"
              id="name"
              name="name"
              className="border py-1 px-2 border-slate-300 focus:outline-primary w-full"
              onChange={handleChange}
              value={data.name}
              required
            />
          </div>
          {/* <div>Image:</div> */}
          <div className="mt-2 flex gap-4">
            <div
              className="my-2 flex gap-4 cursor-pointer"
              onClick={handleClick}
            >
              <Avatar
                width={40}
                height={40}
                name={data.name}
                imageUrl={data.imageUrl}
                userId={user?._id}
              />
              <button type="button" className="font-semibold">
                {image == "" ? "Change Image" : image.name}
              </button>
              {image && (
                <button
                  className="text-lg ml-2 mt-1 text-red-600"
                  onClick={handleRemoveImage}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type="file"
              name="imageUrl"
              id="Image"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUploadPhoto}
            />
            {user.profile.url && (
              <button
                className="font-semibold"
                onClick={handleRemoveExistImage}
              >
                Remove Image
              </button>
            )}
          </div>
          <Divider />
          <div className="mt-2 flex gap-2 w-fit ml-auto">
            <button
              className="border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="border border-primary px-4 py-1 text-white bg-primary hover:bg-secondary rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
