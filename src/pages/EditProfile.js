import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const logInUserId = "65c44c79ac67152520d0897b";
  const navigate = useNavigate();
  const [loggedInUser, setloggedInUser] = useState({});
  const [newUserName, setNewUserName] = useState("");
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  //   console.log("newUserName", newUserName);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/user/${logInUserId}/userId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      //   console.log(data);
      setloggedInUser(data);
      setNewUserName(data.username);
      setNewBio(data.bio);
      setNewName(data.name);
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    // console.log(newUserName, newName, newBio);
    const user = {
      username: newUserName,
      name: newName,
      bio: newBio,
    };
    const res = await fetch(`/user/${loggedInUser?._id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.status === 201) {
      console.log("updated");
      navigate("/profile");
    }
  };

  return (
    <div className=" w-full flex justify-center">
      <div className=" my-10 flex flex-col items-center gap-6 px-5 py-10 rounded-2xl shadow-2xl">
        <div className="w-40 h-40 overflow-hidden rounded-full ">
          <img
            src={loggedInUser.profilePicture}
            alt="img"
            className="w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Username:
          </label>
          <input
            type="text"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="username"
            required
            defaultValue={loggedInUser.username}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Name:
          </label>
          <input
            type="name"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="name"
            defaultValue={loggedInUser.name || ""}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-80">
          <label htmlFor="username" className="text-sm px-3">
            Bio:
          </label>
          <input
            type="name"
            className="px-3 py-2 rounded-full outline-none border focus:border-blue-500 bg-gray-100 border-[#fff]"
            placeholder="bio"
            defaultValue={loggedInUser.bio || ""}
            onChange={(e) => setNewBio(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button
            className={`w-full py-3 text-sm bg-blue-600 rounded-full hover:bg-blue-500 transition-all duration-200 text-[#fff] `}
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
