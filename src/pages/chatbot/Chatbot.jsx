import React, { useEffect, useRef, useState } from "react";
import "../../styles/chat.css";
import { NavLink, Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getCurrentUserLT,
  getFirstLetterName,
  getToken,
  notify,
} from "../../utils/utils";
import Messaging from "./Components/Messaging";
import NoChatSelected from "./Components/NoChatSelected";
import { useSelector } from "react-redux";

const Chatbot = () => {
  const [friendbox, setTab] = useState(true);
  const friendShow = () => setTab(!friendbox);
  const [Groupbox, setShow] = useState(true);
  const u = useSelector((state) => state.userByToken.user);
  // console.log("adedsd",u);
  let socket = useRef();
  const senderId = getCurrentUserLT()?.id;
  console.log("ccccccccccccccccccccccccccccccccc",senderId);
  // console.log("wqsd",u.id);
  const [userList, setUserList] = useState([]);
  // console.log(userList);
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("sele",selectedUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const GroupShow = () => setShow(!Groupbox);

  useEffect(() => {
    const res = io(process.env.REACT_APP_BASE_URL, {
      auth: { token: getToken() },
    });
    socket.current = res;
    socket.current.emit("addUser", senderId);
    socket.current.on("getUsers", (userList) => {
      setUserList(userList);
    });

    // this is a clean-up function for disconnected chat
    return () => {
      socket.current.disconnect();
    };
  }, [senderId]);

  useEffect(() => {
    if (socket) {
      socket.current.on("getMessage", (message) => {
        // console.log(message);
        setMessages((existingMessages) => [...existingMessages, message]);
      });
    }
  }, []);


  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim() === "") return;
  //   socket.current.emit("sendMessage", {
  //     senderId: senderId,
  //     receiverId: selectedUser.userId,
  //     message: newMessage,
  //   });
  //   alert("please enter the message ")
  //   if (senderId === u.id) {
  //     setMessages((existingMessages) => [
  //       ...existingMessages,
  //       {
  //         message: newMessage,
  //         receiverId: selectedUser.userId,
  //         senderId: senderId,
  //         timestamp: new Date().toISOString(),
  //       },
  //     ]);
  //   }
  //   setNewMessage("");
  // };

  /**
   *
   * @param {this me new function send the chat messages} e
   * @returns
   */
  const handleSendMessage = async (e) => {
    // e.preventDefault();
    // if (newMessage.trim() === "") {
    //   notify("Please enter a message before sending.", "error");
    //   return; // Don't proceed if the message is empty
    // }

    // socket.current.emit("sendMessage", {
    //   senderId: senderId,
    //   receiverId: selectedUser.userId,
    //   message: newMessage,
    //   image: selectedUser.profileImage,
    // });

    // if (senderId == u.id) {
    //   setMessages((existingMessages) => [
    //     ...existingMessages,
    //     {
    //       message: newMessage,
    //       receiverId: selectedUser.userId,
    //       senderId: senderId,
    //       timestamp: new Date().toISOString(),
    //       image: selectedUser.profileImage,
    //     },
    //   ]);
    // }
    // setNewMessage("");
    e.preventDefault();
    if (newMessage.trim() === "") {
      notify("Please enter a message before sending.", "error");
      return;
    }
  
    const messageData = {
      senderId: senderId,
      receiverId: selectedUser.userId,
      message: newMessage,
      image: selectedUser.profileImage, // Assuming this is the image URL for the selected user
    };
  
    socket.current.emit("sendMessage", messageData);
  
    if (senderId === u.id) {
      setMessages((existingMessages) => [
        ...existingMessages,
        {
          ...messageData,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  
    setNewMessage("");
  };
  const fullName =
    u?.fname || u?.lname ? u?.fname + " " + u?.lname : "Loading...";
  const profileImage = u.profileImage ? u.profileImage : "";
  const roleType = u.role ? u.role : "";

  return (
    <div className="frame">
      <div className="sidepanel">
        <div class="top-profile">
          <div class="users">
            <img src="/icons-images/profile1.png" />
            <h3>
              Naiyana <i class="fa-solid fa-pen edit-icon "></i>
              <br />
              <font>Senior Developer</font>
            </h3>
          </div>
        </div>
        <div className="search">
          <label for="">
            <i className="fa fa-search" aria-hidden="true"></i>
          </label>
          <input type="text" placeholder="Search Here..." />
        </div>
        <hr />

        <div className="scrollbar">
          <div className="chatGroup">
            <h2>
              Group 3
              <span onClick={GroupShow}>
                <i class="fa-solid fa-chevron-down"></i>
              </span>
            </h2>
            {Groupbox && (
              <div className="scroll-box">
                <NavLink to={`/chatbot/34`} className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile1.png" />
                      <h3>
                        Naiyana <br />
                        <font>Hi, I m Available</font>
                      </h3>
                    </div>
                  </div>
                </NavLink>

                <NavLink to={`/chatbot/22`} className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile3.png" />
                      <h3>Recordified (4)</h3>
                    </div>
                  </div>
                </NavLink>

                <NavLink to={`/chatbot/55`} className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile7.png" />
                      <h3>Airtel (10)</h3>
                    </div>
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          <div className="chatGroup">
            <h2>
              Friends {userList?.length}
              <span onClick={friendShow}>
                <i class="fa-solid fa-chevron-down"></i>
              </span>
            </h2>
            {friendbox && (
              <div className="contacts">
                <ul>
                  {userList.map((u) => {
                    return (
                      <li
                        className={
                          u.userId === selectedUser?.userId
                            ? "contact active"
                            : "contact"
                        }
                        onClick={() => setSelectedUser(u)}
                      >
                        <div className="wrap">
                          <span
                            className={
                              u.online
                                ? "contact-status online"
                                : "contact-status busy"
                            }
                          ></span>
                          {u.profileImage ? (
                            <>
                              {" "}
                              <img
                                src={
                                  u.profileImage ||
                                  `${process.env.PUBLIC_URL}/icons-images/profile1.png`
                                }
                              />
                            </>
                          ) : (
                            <>
                              {" "}
                              <div className="firstLetter">
                                <p>
                                  {getFirstLetterName(u.fname + " " + u.lname)}
                                </p>
                              </div>
                            </>
                          )}
                          <div className="meta">
                            <h4 className="name">
                              {u.fname + " " + u.lname}
                              {/* <p className={u?.online === true ? "online":"offline"}> {u?.online === true ? "Online":"Offline"}</p> */}
                              {/* <p className="preview">
                                {u.online ? "Hi, I m Available" : "I'm busy"}
                              </p> */}
                            </h4>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="bottom-bar">
              <div className="row">
                <div className="col-6">
                  <NavLink to="/dashboard">
                    <button className="addcontact">
                      <i class="fa-solid fa-house"></i> <br />
                      <span>Dashboard</span>
                    </button>
                  </NavLink>
                </div>
                <div className="col-6">
                  <NavLink to="/chatuser">
                    <button className="settings">
                      <i class="fa-regular fa-comment-dots"></i>
                      <br />
                      <span>Chats</span>
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* messaging */}
      {selectedUser ? (
        <Messaging
          setMessage={setNewMessage}
          message={newMessage}
          senderId={senderId}
          chat={selectedUser}
          {...{ u, handleSendMessage, messages }}
        />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default Chatbot;
