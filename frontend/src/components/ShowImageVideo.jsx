import React from "react";
import { IoMdClose } from "react-icons/io";

const ShowImageVideo = ({message,handleVideoAudioDisplayClose}) => {
  return (
    <>
      {message.imageUrl && (
        <div className="w-full sticky bottom-0 z-10 h-full bg-opacity-70 bg-slate-300  flex justify-center items-center overflow-hidden ">
          <div
            className="top-1 right-3 absolute cursor-pointer hover:text-red-500"
            onClick={handleVideoAudioDisplayClose}
          >
            <IoMdClose size={30}></IoMdClose>
          </div>
          <div className="bg-white p-3">
            <img
              src={message.imageUrl}
              className="aspect-video w-full h-full max-w-sm m-2"
              alt="uploadedImage"
            />
          </div>
        </div>
      )}

      {/* video display */}

      {message.videoUrl && (
        <div className="w-full z-10 sticky bottom-0 h-full bg-slate-300 bg-opacity-70  flex justify-center items-center overflow-hidden ">
          <div
            className="top-1 right-3 absolute cursor-pointer hover:text-red-500"
            onClick={handleVideoAudioDisplayClose}
          >
            <IoMdClose size={30}></IoMdClose>
          </div>
          <div className="bg-white p-3">
            <video
              src={message.videoUrl}
              className="aspect-video w-full h-full max-w-sm m-2"
              controls
              muted
              autoPlay
            ></video>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowImageVideo;
