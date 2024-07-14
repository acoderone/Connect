import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-black h-10 ">
      <div className="px-10 ">
        <div className="flex justify-between items-center">
          <div className="text-2xl  font-bold text-blue-600 right-3/4">Connect</div>
          <div className=" left-3/4 space-x-4 text-blue-600  font-medium">
            <Link to="/login">Signup</Link>
            <Link to="/">Logout</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
