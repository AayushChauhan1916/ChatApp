import React, { useEffect } from "react";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import LoadingSpinner from "./loadingSpinner";
import SearchUserCard from "./SearchUserCard";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setloading] = useState(false);
  const [search, setSearch] = useState("");
  const onlineUser = useSelector((state) => state.user.onlineUser);
  // console.log(searchUser)

  const handleSearch = async () => {
    setloading(true);
    try {
      const url = `/api/auth/searchuser`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });

      const api_Result = await response.json();

      if (api_Result.success == true) {
        // console.log(api_Result);
        setloading(false);
        setSearchUser(api_Result.data);
      }
    } catch (err) {
      toast.error(err.message || err);
    }
  };

  useEffect(() => {
    if (search) {
      handleSearch();
    }
  }, [search]);

  return (
    <div className="bottom-0 top-0 left-0 right-0 fixed items-center bg-gray-700 bg-opacity-40 p-2 z-50">
      <div className="w-full max-w-md mx-auto mt-5 ">
        <div className="bg-white h-14 rounded-l overflow-hidden flex">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search user by name,email..."
            className="w-full outline-none py-1 px-4 h-full"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="flex justify-center items-center h-14 w-14 bg-slate-400 hover:bg-slate-500">
            <GoSearch size={20}></GoSearch>
          </div>
        </div>

        {/* Display User  */}
        <div className="bg-white mt-3 rounded w-full max-h-[calc(100vh-200px)] p-4 overflow-y-auto overflow-x-hidden scrollbar">
          {searchUser.length == 0 && !loading && (
            <p className="text-center text-slate-500">No User Found !</p>
          )}
          {loading && (
            <div>
              <LoadingSpinner></LoadingSpinner>
            </div>
          )}
          {searchUser.length != 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <SearchUserCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div
        className="absolute top-0 right-0 text-slate-700 hover:text-white px-2 py-1 text-2xl lg:text-4xl cursor-pointer "
        onClick={onClose}
      >
        <IoMdClose />
      </div>
    </div>
  );
};

export default SearchUser;
