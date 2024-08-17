import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  setUser,
  userDetails,
  setOnlineUser,
  setSocketConnection,
} from "../redux/authSlice";
import SideBar from "../components/SideBar";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import io from "socket.io-client";
// import EditUserDetails from "../components/EditUserDetails";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const basePath = location.pathname === "/";

  // const user = useSelector(userDetails);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/auth/fetchuser`, {
        method: "POST",
        credentials: "include",
      });

      const api_Result = await response.json();
      // console.log(api_Result);

      if (api_Result.data.logout == true) {
        toast.error("session expired,Please Login Again");
        localStorage.clear();
        dispatch(logout());
      } else {
        dispatch(setUser(api_Result.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const socketConnection = io("/api", {
      auth: {
        token: localStorage.getItem("token"),
      },
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    // trasfer socketConnection to messagePage
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <div className="grid lg:grid-cols-[340px,1fr] h-screen max-h-screen ">
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
          <SideBar></SideBar>
        </section>
        <section className={`${basePath && "hidden"}`}>
          <Outlet></Outlet>
        </section>
        <div
          className={`lg:flex flex-col justify-center items-center gap-2 hidden ${
            !basePath && "lg:hidden"
          }`}
        >
          <div>
            <img src={logo} alt="logo" width={250} />
          </div>
          <p className="text-lg mt-2 text-slate-500">
            Select User To Send Message
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
