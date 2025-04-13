import React from "react";

const Navbar = (props) => {
  return (
    <div className="flex justify-between w-full mx-auto items-center py-4 px-12 text-white font-semibold ">
      <div className="logo text-xl">
        <span className="text-green-500">&lt;</span>Pass
        <span className="text-green-500">OP/&gt;</span>
      </div>
      <div className="flex justify-center items-center gap-1 p-1 cursor-pointer rounded-full shadow-sm shadow-green-200 bg-green-500">
        <img src={props.src} alt="" className="invert" />

        <a href={props.href} target={props.target}>
          {props.title}
        </a>
      </div>
    </div>
  );
};

export default Navbar;
