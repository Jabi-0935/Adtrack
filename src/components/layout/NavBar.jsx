import React from "react";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between text-xl text-white h-18 bg-[#14213D]">
      <div className="px-4 font-bold">ADTrack</div>
      <div className="flex">
        <ul className="px-4 flex justify-around gap-10 list-none">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </div>
  );
};
export default NavBar;
