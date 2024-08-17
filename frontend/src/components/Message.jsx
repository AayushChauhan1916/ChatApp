import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import Avatar from "./Avatar";
import { MdOutlineAttachFile } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoadingSpinner from "./loadingSpinner";
import uploadImage from "../helpers/uploadFile";
import ShowImageVideo from "./ShowImageVideo";
import backgroundimage from "../assets/wallapaper.jpeg";
import { IoSendSharp } from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";
import sendingSound2 from "../assets/sounds/sendingSound2.mp3";
import sound from "../assets/sounds/sound.mp3";

// import toast from "react-hot-toast";

const Message = () => {
  const params = useParams();
  const navigate = useNavigate();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const [currUserData, setCurrUserData] = useState({});
  const onlineUser = useSelector((state) => state.user?.onlineUser);
  const authUser = useSelector((state) => state.user?.user);

  const [loading, setLoading] = useState(false);

  const isOnline = onlineUser.includes(params?.userId);

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  // message
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const userIdParams = params?.userId;
  const isValidUserId = /^[a-fA-F0-9]{24}$/.test(userIdParams);

  if (!isValidUserId) {
    navigate("/wrong");
  }

  const [allMessage, setAllMessage] = useState([]);

  const scrollMessage = useRef();

  useEffect(() => {
    if (scrollMessage.current) {
      scrollMessage.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, [allMessage]);

  useEffect(() => {
    if (authUser && socketConnection) {
      const userIdParams = params?.userId;
      const isValidUserId = /^[a-fA-F0-9]{24}$/.test(userIdParams);

      if (!isValidUserId) {
        toast.error("Invalid Action");
        navigate("/");
      } else {
        socketConnection.emit("message-page", {
          receiver: params?.userId,
          sender: authUser._id,
        });

        socketConnection.on("message-user", (data) => {
          setCurrUserData(data);
        });

        socketConnection.emit("seen", params?.userId);

        socketConnection.on("invalid-User", (data) => {
          toast.error("Invalid Action");
          navigate("/");
        });

        socketConnection.on("previousMessage", (data) => {
          setAllMessage(data);
        });
      }
    }
  }, [socketConnection, params?.userId, authUser]);

  // Handle Upload image and video

  const handleUploadImage = async (e) => {
    setLoading(true);
    setOpenImageVideoUpload(false);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = await uploadImage(file);
      setMessage((pre) => {
        return {
          ...pre,
          imageUrl: data.url,
        };
      });
      setLoading(false);
    }
  };

  const handleUploadVideo = async (e) => {
    setLoading(true);
    setOpenImageVideoUpload(false);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = await uploadImage(file);
      setMessage((pre) => {
        return {
          ...pre,
          videoUrl: data.url,
        };
      });
      setLoading(false);
    }
  };

  const handleVideoAudioDisplayClose = () => {
    setMessage((pre) => {
      return {
        ...pre,
        imageUrl: "",
        videoUrl: "",
      };
    });
  };

  const handleTextChange = (e) => {
    setMessage((prev) => {
      return {
        ...prev,
        text: e.target.value,
      };
    });
  };

  // console.log(message)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (socketConnection) {
      if (message.text || message.imageUrl || message.videoUrl) {
        socketConnection.emit("send-message", {
          sender: authUser?._id,
          receiver: params?.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
        });
      }

      setMessage({
        text: "",
        imageUrl: "",
        videoUrl: "",
      });

      socketConnection.on("messages", (data) => {
        if (data.message.sender === authUser._id) {
          const sendingSound = new Audio(sendingSound2);
          sendingSound.play();
        } else {
          const receivingSound = new Audio(sound);
          receivingSound.play();
        }
        setAllMessage(data.conversation);
      });
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundimage})` }}
      className="bg-cover bg-no-repeat"
    >
      <header className="bg-white h-17 top-0 sticky">
        <div className="flex items-center">
          <Link
            to="/"
            className="lg:hidden mt-2 hover:text-primary cursor-pointer"
          >
            <IoMdArrowBack size={30}></IoMdArrowBack>
          </Link>
          <div className="mt-2 ml-2">
            <Avatar
              name={currUserData?.name}
              email={currUserData?.email}
              imageUrl={currUserData?.profile?.url}
              userId={currUserData?._id}
              height={50}
              width={50}
            />
          </div>
          <div>
            {
              <div className="pt-2 ml-4 flex">
                <div>
                  <h1 className="font-semibold lg:text-lg sm:text-sm md:text-sm text-ellipsis text-clamp ">
                    {currUserData?.name}
                  </h1>
                  <p
                    className={`-mt-1 ${
                      isOnline === true ? "text-primary" : "text-slate-400"
                    }`}
                  >
                    {isOnline === true ? "online" : "offline"}
                  </p>
                </div>
              </div>
            }
          </div>
          <div className="mt-2 cursor-pointer ml-auto  mr-4 hover:text-primary">
            <IoEllipsisVerticalOutline size={30}></IoEllipsisVerticalOutline>
          </div>
        </div>
      </header>

      {/* all messages here */}
      <section className="h-[calc(100vh-136px)] relative overflow-x-hidden overflow-y-auto scrollbar bg-slate-200 bg-opacity-50">
        {/* show all messages */}

        <div className="flex flex-col gap-2 mt-1" ref={scrollMessage}>
          {allMessage.map((msg, idx) => {
            return (
              <div
                className={`w-fit p-1 py-1 max-w-[230px] md:max-w-[400px] lg:max-w-sm  rounded ${
                  msg.sender == authUser._id
                    ? "ml-auto bg-teal-100  mr-4 mb-1"
                    : "ml-1 mb-1 bg-white "
                }`}
                key={idx}
              >
                <div className="w-full">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}

                  {msg.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      controls
                      className="w-full h-full object-scale-down"
                    ></video>
                  )}
                </div>
                <p className="px-2 text-black">{msg.text}</p>
                <p className="text-xs ml-auto w-fit text-gray-500">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/* display upload image and video */}
        <ShowImageVideo
          message={message}
          handleVideoAudioDisplayClose={handleVideoAudioDisplayClose}
        />
        <div
          className={`w-full h-full flex justify-center items-center sticky bottom-0 bg-transparent ${
            !loading && "hidden"
          }`}
        >
          {loading && <LoadingSpinner size={20} />}
        </div>
      </section>

      {/* send Message */}
      <section className="bg-white h-17 flex items-center ">
        <div className="relative">
          <button
            onClick={() =>
              setOpenImageVideoUpload(
                openImageVideoUpload === true ? false : true
              )
            }
            className="flex justify-center items-center hover:bg-primary hover:text-white rounded-full w-14 h-14"
          >
            <MdOutlineAttachFile size={27}></MdOutlineAttachFile>
          </button>

          {/* pop up for audi and video */}
          {openImageVideoUpload && (
            <div className="bg-white shadow absolute bottom-16 w-36 left-3">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex justify-center items-center p-2 gap-3 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div>
                    <FaImage className="text-primary" size={18}></FaImage>
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex justify-center items-center p-2 gap-3 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div>
                    <IoVideocam
                      className="text-purple-500"
                      size={18}
                    ></IoVideocam>
                  </div>
                  <p>video</p>
                </label>
                <input
                  type="file"
                  className="hidden"
                  name="uploadImage"
                  id="uploadImage"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  name="uploadVideo"
                  className="hidden"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>

        <form className="w-full h-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 w-full h-full outline-none"
            value={message.text}
            onChange={handleTextChange}
          />
          <button className="mr-7 text-primary hover:text-secondary">
            <IoSendSharp size={25}></IoSendSharp>
          </button>
        </form>
      </section>
    </div>
  );
};

export default Message;
