import React from "react";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";

const SearchUserCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-3 p-2 border-b border-slate-200 hover:border-primary hover:bg-slate-100 cursor-pointer"
    >
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          imageUrl={user?.profile?.url}
          userId={user?._id}
        ></Avatar>
      </div>
      <div>
        <div className="text-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
};

export default SearchUserCard;
