import { React, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";
import { data } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [isVisible, setIsVisible] = useState(false);

  const showPassword = () => {
    setIsVisible(!isVisible);
    setValue("password", getValues("password"));
  };

  const [Registered, setRegistered] = useState(false);
  const [Exists, setExists] = useState(false);

  const fullTitle = "Pass";
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullTitle.length) {
      const timer = setTimeout(() => {
        setDisplayedTitle((prev) => prev + fullTitle[index]);
        setIndex(index + 1);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [index]);

  const postData = async (username_, password_) => {
    try {
      let res = await fetch("https://pass-op-back-end.vercel.app/users", {
        method: "POST",
        body: JSON.stringify({
          username: username_,
          password: password_,
          userID: uuidv4(),
        }),
        headers: { "Content-Type": "application/json" },
      });

      let responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (data) => {
    const hash = bcrypt.hashSync(data.password, 10);
    try {
      let response = await postData(data.username, hash);
      console.log("Success:", response.message);
      setRegistered(true);
      setExists(false);
    } catch (error) {
      console.error("Error:", error.message);
      setExists(true);
    }
    setRegistered(false);
  };

  return (
    <div>
      <div className="fixed inset-0 -z-10 min-h-screen w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#bbf7d0_100%)]"></div>
      <Navbar
        href="https://github.com/muhammad-faizan087"
        title="Github"
        target="_blank"
        src="/github.svg"
      />
      <div className="flex flex-col gap-4 md:flex-row justify-center items-center min-h-[80vh] min-w-screen overflow-hidden mx-auto">
        <div className="min-w-[40%] flex justify-center items-center flex-col">
          <h1 className="text-4xl font-bold ">
            <span className="text-green-500">&lt;</span>
            <span className="text-white">{displayedTitle}</span>
            <span className="text-green-500">OP/&gt;</span>
          </h1>
          <div className="text-white">Your Own Password Manager</div>
        </div>
        <div className="min-w-[50%] flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center gap-2 bg-green-200 p-4 w-full lg:w-[65%] h-[300px] rounded-lg"
          >
            <h1 className="mb-5 text-3xl font-bold">Signup</h1>
            <input
              {...register("username", { required: true })}
              placeholder="Enter Username"
              className="bg-white rounded-lg p-1"
            />
            {errors.username && (
              <span className="text-red-600">Username can't be empty</span>
            )}
            <div className="flex justify-between items-center relative">
              <input
                {...register("password", { required: true })}
                placeholder="Enter Password"
                className="bg-white rounded-lg p-1"
                type={isVisible ? "text" : "password"}
              />
              <img
                src={isVisible ? "/hide.svg" : "/show.svg"}
                alt=""
                className="absolute right-[4px] top-[4px] cursor-pointer"
                onClick={showPassword}
              />
            </div>
            {errors.password && (
              <span className="text-red-600">Password can't be empty</span>
            )}
            <input
              type="submit"
              className="text-white mt-2 bg-green-500 py-1 px-3 rounded-lg cursor-pointer"
            />
            {Registered && (
              <div className="text-green-500">
                Registered Successfully, login to continue.
              </div>
            )}
            {Exists && (
              <div className="text-red-600">
                User with this username already exists.
              </div>
            )}
            <div>
              Already Have An Account?<span> </span>
              <a
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="cursor-pointer text-blue-700 underline"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
