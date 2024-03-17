import React, { useEffect, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { RiMessengerLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
// import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";

const Account = ({ logInUser }) => {
  const navigate = useNavigate();
  // const logInUser = {
  //   username: "ali",
  //   _id: "65c44c79ac67152520d0897b",
  // };
  // const logInUserId = "65c44c79ac67152520d0897b";
  const [loggedInUser, setLoggedInUser] = useState(logInUser);
  // const userId = loggedInUser._id;
  const params = useParams();
  const [userName, setUserName] = useState(params.userName);
  // console.log("userName", userName);
  const [user, setUser] = useState();
  // console.log("user", user);
  // const [followed, setFollowed] = useState();
  const [isFollowersPageOpen, setIsFollowersPageOpen] = useState(false);
  const [isFollowingPageOpen, setIsFollowingPageOpen] = useState(false);
  // loggedInUser &&
  // user &&
  // loggedInUser.following.some((item) => item._id === user._id)
  // console.log("user", user);
  const [posts, setPosts] = useState();
  // console.log("posts", posts);

  useEffect(() => {
    if (loggedInUser) {
      if (userName === loggedInUser?.username) {
        navigate("/profile");
      }
      const fetchData = async () => {
        const response = await fetch(`/user/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // console.log("data", data);
        setUser(data);
        setPosts(data.posts);
      };
      fetchData();
    }

    // console.log("use effect running");

    // const fetchLogInUser = async () => {
    //   const response = await fetch(`/user/${logInUserId}/userId`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = await response.json();
    //   //   console.log("data", data);
    //   setLoggedInUser(data);
    // };

    // fetchLogInUser();
  }, [userName, navigate, loggedInUser]);

  const handleFollow = async (item) => {
    // console.log("user", user);
    // console.log("loggedInUser", loggedInUser);
    // console.log("loggedInUser._id", loggedInUser._id);
    const response = await fetch(`/user/${loggedInUser?._id}/follow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeFollowed: `${item._id}` }),
    });
    const data = await response.json();
    // console.log("follow data", data);
    if (response.status === 200) {
      if (item._id !== user._id) {
        await fetch(`/user/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setUser(data));
      } else {
        setUser(data.followedUser);
      }

      setLoggedInUser(data.followingUser);
      // setFollowed(true);
    }
  };

  const handleUnfollow = async (item) => {
    // console.log("user", user);
    // console.log("loggedInUser", loggedInUser);
    // console.log("loggedInUser._id", loggedInUser._id);
    const response = await fetch(`/user/${loggedInUser?._id}/unfollow`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToBeUnfollowed: `${item._id}` }),
    });
    const data = await response.json();
    // console.log("unfollow data", data);
    if (response.status === 200) {
      // setFollowed(false);
      // console.log("data.unFollowedUser", data.unFollowedUser);
      // console.log("data.unFollowingUser", data.unFollowingUser);
      if (item._id !== user._id) {
        await fetch(`/user/${userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => setUser(data));
      } else {
        setUser(data.unFollowedUser);
      }
      setLoggedInUser(data.unFollowingUser);
      // setFollowed(false);
    }
  };

  return (
    <div className="relative flex items-center flex-col w-full mb-20">
      {user ? (
        <>
          <div className="flex sm:h-64 py-10 gap-3">
            <div className=" sm:w-64 h-full flex justify-center items-center">
              <div className="rounded-full overflow-hidden border">
                <img
                  src={user.profilePicture}
                  alt="img"
                  className="h-20 w-20 sm:w-36 sm:h-36"
                />
              </div>
            </div>
            <div className="h-full flex flex-col justify-center ">
              <div className="flex justify-between py-3">
                <h1 className="text-lg font-semibold mr-2">{user.username}</h1>
                <div className="flex gap-2">
                  {loggedInUser?.following?.some(
                    (item) => item._id === user._id
                  ) ? (
                    <button
                      className="bg-gray-100  hover:bg-gray-200 font-semibold text-xs rounded-md py-[6px] px-3"
                      onClick={() => handleUnfollow(user)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="bg-[#0095F6] text-[#fff] hover:bg-[#0073f6] font-semibold text-xs rounded-md py-[6px] px-3"
                      onClick={() => handleFollow(user)}
                    >
                      Follow
                    </button>
                  )}

                  <Link
                    className="bg-gray-100 hover:bg-gray-200 font-semibold text-xs rounded-md py-[6px] px-3"
                    to={"/messenger"}
                  >
                    <RiMessengerLine size={20} />
                  </Link>
                </div>
              </div>
              <div className="flex gap-8 ">
                <div className="sm:flex gap-1 items-center text-center">
                  <p className="font-semibold">{user.posts.length}</p>
                  <span className="text-sm">posts</span>
                </div>
                <div className="sm:flex gap-1 items-center text-center">
                  <p className="font-semibold">{user.followers.length}</p>
                  <button
                    className="text-sm"
                    onClick={() => setIsFollowersPageOpen(true)}
                  >
                    followers
                  </button>
                </div>
                <div className="sm:flex gap-1 items-center text-center">
                  <p className="font-semibold">{user.following.length}</p>
                  <button
                    className="text-sm"
                    onClick={() => setIsFollowingPageOpen(true)}
                  >
                    following
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold mt-2">{user.name}</div>
              <div className="text-sm">{user.bio}</div>
            </div>
          </div>
          <div className="border-t w-full border-t-500 flex flex-col items-center">
            <div className="border-t border-t-black text-center text-xs uppercase w-max flex gap-2 items-center py-3">
              <BsGrid size={14} />
              <p>posts</p>
            </div>
            <div
              className={`${
                posts.length > 0
                  ? "grid grid-cols-3 gap-[2px]"
                  : "w-full flex justify-center items-center"
              } `}
            >
              {posts ? (
                posts.map((item, index) => {
                  return (
                    <Link
                      className="cursor-pointer overflow-hidden aspect-square sm:w-60 sm:h-60 "
                      key={index}
                      to={`/post/${item._id}`}
                    >
                      <img
                        src={item.image}
                        alt="img"
                        className="w-full h-full hover:scale-105 transition-all duration-300"
                      />
                    </Link>
                  );
                })
              ) : (
                <div className="w-full h-screen flex justify-center items-center">
                  loading...
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          loading...
        </div>
      )}

      <div
        className={`absolute h-screen w-full backdrop-blur-md bg-opacity-5 transition-all duration-300 bg-black ${
          isFollowersPageOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex relative py-6 px-2 justify-center items-center h-full">
          <div
            className="absolute right-4 top-4 cursor-pointer hover:font-bold hover:scale-110 transition-all duration-300"
            onClick={() => setIsFollowersPageOpen(!isFollowersPageOpen)}
          >
            <RxCross2 size={25} />
          </div>
          <div className="flex justify-center items-center bg-[#fff] w-64 rounded-md shadow-xl flex-col  p-2">
            <h1 className="py-1 border-b w-full text-center">followers</h1>
            <div className="h-72 w-full overflow-y-auto ">
              {user && user.followers.length > 0 ? (
                user.followers.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center w-full "
                    >
                      <div className="flex gap-2 items-center my-1">
                        <div className="w-11 h-11 object-contain rounded-full overflow-hidden border">
                          <img src={item.profilePicture} alt="img" />
                        </div>
                        <Link
                          className="font-semibold"
                          to={
                            loggedInUser &&
                            item.username === loggedInUser.username
                              ? `/profile`
                              : `/account/${item.username}`
                          }
                        >
                          <button
                            onClick={() => {
                              setUserName(item.username);
                              setIsFollowersPageOpen(!isFollowersPageOpen);
                            }}
                          >
                            {item.username}
                          </button>
                        </Link>
                      </div>
                      {loggedInUser._id !== item._id &&
                        (loggedInUser?.following?.some(
                          (user) => user._id === item._id
                        ) ? (
                          <button
                            className="bg-gray-100  hover:bg-gray-200 font-semibold text-xs rounded-md py-[6px] px-3"
                            onClick={() => handleUnfollow(item)}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className="bg-[#0095F6] text-[#fff] hover:bg-[#0073f6] font-semibold text-xs rounded-md py-[6px] px-3"
                            onClick={() => handleFollow(item)}
                          >
                            Follow
                          </button>
                        ))}
                    </div>
                    // <div key={index}>{item.username}</div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  no follower
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute h-screen w-full backdrop-blur-md bg-opacity-5 transition-all duration-300 bg-black ${
          isFollowingPageOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex relative py-6 px-2 justify-center items-center h-full">
          <div
            className="absolute right-4 top-4 cursor-pointer hover:font-bold hover:scale-110 transition-all duration-300"
            onClick={() => setIsFollowingPageOpen(!isFollowingPageOpen)}
          >
            <RxCross2 size={25} />
          </div>
          <div className="flex justify-center items-center bg-[#fff] w-64 rounded-md shadow-xl flex-col  p-2">
            <h1 className="py-1 border-b w-full text-center">following</h1>

            <div className="h-72 w-full overflow-y-auto ">
              {user && user.following.length > 0 ? (
                user.following.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center w-full "
                    >
                      <div className="flex gap-2 items-center my-1">
                        <div className="w-11 h-11 object-contain rounded-full overflow-hidden border">
                          <img src={item.profilePicture} alt="img" />
                        </div>
                        <Link
                          className="font-semibold"
                          to={
                            loggedInUser &&
                            item.username === loggedInUser.username
                              ? `/profile`
                              : `/account/${item.username}`
                          }
                        >
                          <button
                            onClick={() => {
                              setUserName(item.username);
                              setIsFollowingPageOpen(!isFollowingPageOpen);
                            }}
                          >
                            {item.username}
                          </button>
                        </Link>
                      </div>

                      {loggedInUser._id !== item._id &&
                        (loggedInUser?.following?.some(
                          (user) => user._id === item._id
                        ) ? (
                          <button
                            className="bg-gray-100  hover:bg-gray-200 font-semibold text-xs rounded-md py-[6px] px-3"
                            onClick={() => handleUnfollow(item)}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className="bg-[#0095F6] text-[#fff] hover:bg-[#0073f6] font-semibold text-xs rounded-md py-[6px] px-3"
                            onClick={() => handleFollow(item)}
                          >
                            Follow
                          </button>
                        ))}
                    </div>
                    // <div key={index}>{item.username}</div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full">
                  no following
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>account {userName}</div>
  );
};

export default Account;
