import { React, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  const showPassword = () => {
    setIsVisible(!isVisible);
    setValue("password", getValues("password"));
  };

  const [Invalid, setInvalid] = useState(false);

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

  const onSubmit = async (data) => {
    try {
      let res = await fetch("https://pass-op-back-end.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (!res.ok) {
        setInvalid(true);
        throw new Error("Login failed");
      }

      let result = await res.json();

      localStorage.setItem("token", result.token);

      window.location.href = "/user";
    } catch (error) {
      console.error("Login error:", error.message);
    }
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
            <h1 className="mb-5 text-3xl font-bold">Login</h1>
            <input
              {...register("username", { required: true })}
              placeholder="Enter Username"
              className="bg-white rounded-full px-2 py-1"
            />
            {errors.username && (
              <span className="text-red-600">Username can't be empty</span>
            )}
            <div className="flex justify-between items-center relative">
              <input
                {...register("password", { required: true })}
                placeholder="Enter Password"
                className="bg-white rounded-full px-2 py-1"
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
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="text-white font-semibold mt-2 bg-green-500 py-1 px-4 rounded-full cursor-pointer"
            >
              Login
            </button>
            {Invalid && <div className="text-red-600">Invalid Credentials</div>}
            <div>
              Don't Have An Account?<span> </span>
              <a
                onClick={() => {
                  window.location.href = "/";
                }}
                className="cursor-pointer text-blue-700 underline"
              >
                Signup
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
