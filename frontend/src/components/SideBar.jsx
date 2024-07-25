import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { FaArrowLeft } from "react-icons/fa6";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import { logout } from "../redux/authSlice";
// import { userDetails } from "../redux/authSlice";

const SideBar = () => {
  const user = useSelector((state) => state.user.user);
  const [editUser, setEditUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("sidebarConversation", (data) => {
        const conversation = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id == conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });
        setAllUser(conversation);
      });
    }
  }, [socketConnection, user]);

  let userName;
  let userProfile;
  if (user) {
    userName = user.name;
    if (user.profile.url) {
      userProfile = user.profile.url;
    }
  } else {
    userName = "Guest";
  }

  const handleLogOut = ()=>{
    dispatch(logout());
    navigate("/checkemail");
    localStorage.clear();
  }
  // console.log(user)
  return (
    <div className="w-full bg-white h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-100 w-12 h-full rounded-tr-xl rounded-br-xl py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={(isActive) =>
              `h-12 w-12 flex justify-center items-center hover:bg-slate-200 cursor-pointer ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={25}></IoChatbubbleEllipsesSharp>
          </NavLink>
          <div
            className="h-12 w-12 flex justify-center items-center hover:bg-slate-200 cursor-pointer"
            title="Add User"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={25}></FaUserPlus>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="flex justify-center items-center hover:bg-slate-200 cursor-pointer"
            title={userName}
            onClick={() => setEditUser(true)}
          >
            <span>
              <Avatar
                width={40}
                height={40}
                name={userName}
                imageUrl={userProfile}
                userId={user?._id}
              ></Avatar>
            </span>
          </button>
          <button
            className="h-12 w-12 flex justify-center items-center hover:bg-slate-200 cursor-pointer"
            title="Logout"
            onClick={handleLogOut}
          >
            <span className="-ml-2">
              <BiLogOut size={25}></BiLogOut>
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="h-19 mt-2 flex justify-center items-center">
          <h2 className=" text-xl font-bold p-4 text-slate-800 ">Message</h2>
          {/* <div className="p-[0.4px] bg-slate-200"></div> */}
        </div>
        <Divider />
        <div className="h-[calc(100vh-69px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length == 0 && (
            <div>
              <div className="flex justify-center items-center text-slate-500 mt-2">
                <FaArrowLeft size={40} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation
              </p>
            </div>
          )}

          {allUser.map((conv) => {
            return (
              <Link
                to={`${conv?.userDetails?._id}`}
                key={conv._id}
                className="flex items-center gap-1 px-2 py-2 border-b cursor-pointer hover:bg-slate-100 border-slate-200 hover:border-primary "
              >
                <div>
                  <Avatar
                    name={conv?.userDetails.name}
                    userId={conv?.userDetails.name}
                    imageUrl={conv?.userDetails?.profile?.url}
                    height={40}
                    width={40}
                  ></Avatar>
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-sm lg:text-base">
                    {conv?.userDetails.name}
                  </h3>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <div>
                      {conv?.lstMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lstMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lstMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <IoVideocam />
                          </span>
                          {!conv?.lstMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lstMsg?.text}
                    </p>
                  </div>
                </div>
                {conv?.unSeen >= 1 ? (
                  <p className="ml-auto p-1 h-6 w-6 flex justify-center items-center text-white bg-primary rounded-full text-sm">
                    {conv?.unSeen}
                  </p>
                ) : (
                  <></>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Edit User Details */}
      {editUser && user && (
        <EditUserDetails user={user} onClose={() => setEditUser(false)} />
      )}

      {/* Search User */}

      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default SideBar;
