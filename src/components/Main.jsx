import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar";

const Main = () => {
  const eyeButtonRef = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);

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

  const getData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not logged in.");
      return;
    }
    let res = await fetch("https://pass-op-back-end.vercel.app/passwords", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let passwords = await res.json();
    if (passwords) {
      console.log(passwords);
      setpasswordArray(passwords);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const savePassword = async () => {
    if (
      form.site.length > 4 &&
      form.username.length > 4 &&
      form.password.length > 4
    ) {
      const token = localStorage.getItem("token");

      let res = await fetch("https://pass-op-back-end.vercel.app/passwords", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form }),
      });

      let newPassword = await res.json();
      console.log(newPassword);
      setpasswordArray([...passwordArray, newPassword]);
      setform({ site: "", username: "", password: "" });
    } else {
      toast("Credentials length should be greater than 4", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const deletePassword = async (id) => {
    console.log("Attempting to delete ID:", id);

    setpasswordArray(passwordArray.filter((item) => item._id !== id));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://pass-op-back-end.vercel.app/passwords", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (res.status !== 200) {
        console.error("Failed to delete:", data);
      }
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  };

  const showPassword = () => {
    passwordRef.current.type =
      passwordRef.current.type === "password" ? "text" : "password";
    eyeButtonRef.current.src = eyeButtonRef.current.src.includes("show.svg")
      ? "/hide.svg"
      : "/show.svg";
  };

  const editPassword = (id) => {
    const selectedItem = passwordArray.find((item) => item._id === id);
    console.log("Editing password:", selectedItem);

    if (!selectedItem) {
      console.error("Error: Selected password is undefined.");
      return;
    }

    deletePassword(id);
    const { _id, ...passwordWithoutId } = selectedItem;
    setform(passwordWithoutId);
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!!!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div>
      <div className="fixed inset-0 -z-10 min-h-screen w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#bbf7d0_100%)]"></div>
      <Navbar href="/login" title="Logout" target="_self" src="/profile.svg" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-[90vw] md:w-[80vw] mx-auto p-8 flex flex-col">
        <div className="mb-5 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold ">
            <span className="text-green-500">&lt;</span>
            <span className="text-white">{displayedTitle}</span>
            <span className="text-green-500">OP/&gt;</span>
          </h1>
          <div className="text-white">Your Own Password Manager</div>
        </div>
        <div className="w-full mx-auto flex flex-col gap-2 justify-center items-center">
          <input
            type="text"
            placeholder="Enter Website URL"
            value={form.site}
            name="site"
            onChange={handleChange}
            className="w-full rounded-2xl py-0.5 px-2 border-green-200 border-2 bg-white"
          />
          <div className="flex flex-col md:flex-row justify-between items-center w-full mx-auto gap-2">
            <input
              type="text"
              placeholder="Enter Username"
              value={form.username}
              name="username"
              onChange={handleChange}
              className="w-full md:w-1/2 rounded-2xl py-0.5 px-2 border-green-200 border-2 bg-white"
            />
            <div className="relative w-full md:w-1/2">
              <input
                type="password"
                ref={passwordRef}
                placeholder="Enter Password"
                value={form.password}
                name="password"
                onChange={handleChange}
                className="w-full rounded-2xl py-0.5 px-2 border-green-200 border-2 bg-white"
              />
              <img
                src="/show.svg"
                alt=""
                className=" absolute right-[4px] top-[4px] cursor-pointer"
                onClick={showPassword}
                ref={eyeButtonRef}
              />
            </div>
          </div>
          <div
            className="cursor-pointer border border-green-300 flex justify-center items-center my-4 gap-2 bg-green-500 py-1 px-3 rounded-3xl"
            onClick={savePassword}
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            <button className=" text-white cursor-pointer">Add Password</button>
          </div>
        </div>
        <div className="details mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-4 text-green-50 w-full">
            Your Passwords
          </h1>
          {passwordArray.length === 0 && <div>No Passwords to show</div>}
          {passwordArray.length > 0 && (
            <table className=" w-full overflow-hidden rounded-md ">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="text-xs md:text-sm w-[23%] p-1">Website</th>
                  <th className="text-xs md:text-sm w-[23%] p-1">Username</th>
                  <th className="text-xs md:text-sm w-[23%] p-1">Password</th>
                  <th className="text-xs md:text-sm w-[23%] p-1">Actions</th>
                </tr>
              </thead>
              <tbody className=" text-center bg-green-200">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index} className="border border-green-50">
                      <td className="p-1 break-all">
                        <div className="flex flex-col md:flex-row items-center justify-center">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            className="cursor-pointer"
                            onClick={() => copyToClipboard(item.site)}
                            style={{ height: "23px" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-1 break-all">
                        <div className="flex flex-col md:flex-row items-center justify-center">
                          <span>{item.username}</span>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            className="cursor-pointer"
                            onClick={() => copyToClipboard(item.username)}
                            style={{ height: "23px" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-1 break-all">
                        <div className="flex flex-col md:flex-row items-center justify-center">
                          <span>{"*".repeat(item.password.length)}</span>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            className="cursor-pointer"
                            onClick={() => copyToClipboard(item.password)}
                            style={{ height: "23px" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-1 break-all">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-1">
                          <img
                            src="/edit.svg"
                            alt=""
                            className="cursor-pointer"
                            onClick={() => editPassword(item._id)}
                          />
                          <img
                            src="/delete.svg"
                            alt=""
                            className="cursor-pointer"
                            onClick={() => deletePassword(item._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
