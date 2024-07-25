import React from "react";

import { PiUserCircleLight } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ name, imageUrl, width, height, userId }) => {
  const onlineUser = useSelector((state) => state.user.onlineUser);
  // console.log(onlineUser)
  let avatarName;
  if (name) {
    let splitName = name.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const isOnline = onlineUser.includes(userId);
  // console.log(isOnline)

  const bgColor = [
    "bg-gray-300",
    "bg-orange-300",
    "bg-orange-400",
    "bg-amber-300",
    "bg-yellow-300",
    "bg-cyan-300",
    "bg-fuchsia-300",
    "bg-blue-300"
  ];

  const bgRandom = Math.floor(Math.random() * 9);

  return (
    <div className="relative">
      <div className="text-slate-800" height={height} width={width}>
        {imageUrl ? (
          <div className="flex justify-center items-center rounded-full">
            <img
              style={{ height: `${height}px`, width: `${width}px` }}
              src={imageUrl}
              alt="user_image"
              className="overflow-hidden rounded-full"
            ></img>
          </div>
        ) : name ? (
          <div
            className={`rounded-full mx-auto flex justify-center items-center text-lg font-bold ${bgColor[bgRandom]}`}
            style={{ height: `${height}px`, width: `${width}px` }}
          >
            {avatarName}
          </div>
        ) : (
          <div className="w-fit mx-auto mt-2 mb-3">
            <PiUserCircleLight size={width} />
          </div>
        )}
      </div>
      {isOnline && (
        <div className="bg-green-600 p-1 bottom-0.5 right-0.5 rounded-full absolute"></div>
      )}
    </div>
  );
};

export default Avatar;
