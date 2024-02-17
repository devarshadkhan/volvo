import React, { useEffect, useRef, useState } from "react";
import "../../styles/chat.css";
import { NavLink, Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import {
  formateTimeWithChatEnd,
  getCurrentUserLT,
  getFirstLetterName,
  getToken,
  handleFullName,
  notify,
} from "../../utils/utils";
import Messaging from "./Components/Messaging";
import NoChatSelected from "./Components/NoChatSelected";
import { useDispatch, useSelector } from "react-redux";
import { getChatBotMessageData } from "../../redux/slice/chatBot/chatBotSlice";

const Chatbot = () => {
  const dispatch = useDispatch();
  let socket = useRef();
  const [friendbox, setTab] = useState(true);
  const friendShow = () => setTab(!friendbox);
  const [Groupbox, setShow] = useState(true);
  const senderId = getCurrentUserLT()?.id;
  const [userList, setUserList] = useState([]);
  console.log(userList);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [emoji, setEmoji] = useState();
  const [documentRef, setDocumentRef] = useState([]);
  const [viewImage, setViewImage] = useState("");
  // console.log(documentRef.name);
  // console.log(emoji?.emoji);
  const u = useSelector((state) => state.userByToken.user);
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx",u.id);
  // console.log(u.id);
  // const handleClickedEmoji = (e)=>{
  //   setEmoji(e)
  //   // // if (getEmoji) {
  //   //   console.log(getEmoji?.emoji);
  //   //   setMessage((prev) => prev + getEmoji?.emoji);
  //   setNewMessage((prev) => {
  //       // console.log(getEmoji?.emoji);
  //       return prev + (emoji?.emojiemoji || ''); // Use empty string if getEmoji?.emoji is undefined
  //     });
  // }
  const GroupShow = () => setShow(!Groupbox);
  // const [u, setU] = useState({});
  // useEffect(() => {
  //   if (userByToken.success) setU(userByToken.user);
  // }, [userByToken.success]);

  // socket.io code
  // useEffect(() => {
  //   // Get token from storage
  //   const token = getToken();

  //   // Retrieve socket connection details from storage
  //   const storedSocketId = localStorage.getItem("socketId");

  //   const res = io(process.env.REACT_APP_BASE_URL, {
  //     auth: { token, storedSocketId },
  //   });

  //   socket.current = res;

  //   // Save the socket id in storage
  //   localStorage.setItem("socketId",senderId);

  //   socket.current.emit("addUser", senderId);

  //   socket.current.on("getUsers", (userList) => {
  //     setUserList(userList);
  //   });

  //   // Clean-up function for disconnected chat
  //   return () => {
  //     socket.current.disconnect();
  //     localStorage.removeItem("socketId");
  //   };
  // }, [senderId]);

  // // ... (existing code)

  // useEffect(() => {
  //   if (socket) {
  //     socket.current.on("getMessage", (message) => {
  //       setMessages((existingMessages) => [...existingMessages, message]);
  //     });
  //   }
  // }, []);
  // useEffect(() => {
  //   const storedUserId = localStorage.getItem("userId");

  //   const initializeSocket = () => {
  //     const socketInstance = io(process.env.REACT_APP_BASE_URL, {
  //       auth: { token: getToken(), userId: storedUserId },
  //     });

  //     socketInstance.on("connect", () => {
  //       socketInstance.emit("addUser", senderId);
  //     });

  //     socketInstance.on("getUsers", (userList) => {
  //       setUserList(userList);
  //     });

  //     socketInstance.on("getMessage", (message) => {
  //       setMessages((existingMessages) => [...existingMessages, message]);
  //     });

  //     socketInstance.on("disconnect", () => {
  //       // Handle disconnection logic, if needed
  //     });

  //     return socketInstance;
  //   };

  //   socket.current = initializeSocket();

  //   return () => {
  //     socket.current.disconnect();
  //   };
  // }, [senderId]);
  // // this is code is proper working ==========================================================================================

  /**
   *
   * file upload res
   *
   **/
  // useEffect(() => {
  //   socket?.current?.on("fileUploadResponse", (image) => {
  //     setViewImage(`data:image/jpg;base64,${image}`);
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   const token = getToken();
  //   const userId = getCurrentUserLT()?.id;
  //   console.log(userId);
  
  //   if (token && userId) {
  //     const socketInstance = io(process.env.REACT_APP_BASE_URL, {
  //       auth: { token, userId },
  //     });
  
  //     socketInstance.emit("addUser", userId);
  
  //     socketInstance.on("getUsers", (userList) => {
  //       // Filter out the current user from the list
  //       const filteredUserList = userList.filter(user => user.userId !== userId);
  //       setUserList(filteredUserList);
  //     });
  
  //     socketInstance.on("getMessage", (message) => {
  //       setMessages((existingMessages) => [...existingMessages, message]);
  //     });
  
  //     socket.current = socketInstance;
  
  //     // Cleanup function for disconnected chat
  //     return () => {
  //       socketInstance.disconnect();
  //     };
  //   }
  // }, [selectedUser]);
  
  
  // ==== proper work  code
  useEffect(() => {
    const res = io(process.env.REACT_APP_BASE_URL, {
      auth: { token: getToken() },
    });
    socket.current = res;
    socket.current.emit("addUser", senderId);
    socket.current.on("getUsers", (userList) => {
      // const filteruser = userList.filter((es)=> es.id !== u.id)
      // const filteredUserList = userList.filter((user) => user.userId !== u?.id);
      // console.log("u?.idu?.idu?.idu?.idu?.idu?.id",u?.id);
      // setUserList(filteredUserList);
      // if (u && u.id) {
      //   const currentUserIndex = userList.findIndex(user => user.userId === u.id);
  
      //   if (currentUserIndex !== -1) {
      //     // Exclude the current user from the list
      //     userList.splice(currentUserIndex, 1);
      //   }
      // }
  
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

    // return ()=>{
    //   socket.current.off("getMessage")
    //   socket.current.disconnect();
    // }
  }, []);
 

  /**
   *
   * @param {this me new function send the chat messages}
   * @returns
   */
  // const formData = new FormData();
  // formData.append("document", documentRef);
  // console.log(formData);
  const handleSendMessage = async (e) => {
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
      // image: selectedUser.profileImage || "/icons-images/userblckicon.png", // Assuming this is the image URL for the selected user
      // emojiSet: emoji,
      // docRef:documentRef?.map((doc) => doc.name)
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

  // last index message show
  const selectedUserId = localStorage.getItem("receiverId");
  // console.log(selectedUserId);
  const getData = useSelector((item) => item.getChatBot.dataMesaage);
  // console.log("qqqqqqqqqqqqqqq", getData);
  useEffect(() => {
    // Fetch chat messages when the component mounts
    dispatch(
      getChatBotMessageData({ senderID: senderId, receiverID: selectedUserId })
    );
  }, [dispatch, senderId, selectedUserId]);

  return (
    <div className="frame">
      <div className="sidepanel">
        <div class="top-profile">
          <div class="users">
            <img src={u.profileImage || "/icons-images/Profileimage.png"} />
            <h3>
              {handleFullName({ fullName, fname: u?.fname, lname: u?.lname }) ||
                "Loading..."}{" "}
              {/* <i class="fa-solid fa-pen edit-icon "></i> */}
              <br />
              {/* <font>{u.role}</font> */}
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
          {/* <div className="chatGroup">
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
            </div> */}

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
                  {/* {userList.filter(e => console.log("wwwwwwwwwwwwwwwwwwwwwwwww",e.userId !== u.id )) */}
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
                          <div className="meta w-100 ">
                            <h4 className="name">
                              {/* {u.fname && u.lname && `${u.fname.substring(0, 10)}...${u.lname.substring(0, 10)}...`} */}
                              {u.fname &&
                              u.lname &&
                              (u.fname.length > 10 || u.lname.length > 10)
                                ? `${u.fname.substring(
                                    0,
                                    10
                                  )}...${u.lname.substring(0, 10)}...`
                                : `${u.fname} ${u.lname}`}

                              {/* {u.fname && u.lname && (u.fname + u.lname.length > 10 ? `${u.fname + " " + u.lname.substring(0, 10)}...` : u.fname + " " + u.lname)} */}
                              {/* {u.fname + " " + u.lname && u.fname+u.lname.length > 10 ? `${u.fname + " " + u.lname.substring(0,10)}...`:u.fname + " " + u.lname } */}
                              {/* {item.taskQuestion && item.taskQuestion.length > 15
                            ? `${item.taskQuestion.substring(0, 15)}...`
                            : item.taskQuestion} */}
                              {/* <p className={u?.online === true ? "online":"offline"}> {u?.online === true ? "Online":"Offline"}</p> */}
                              {/* <p className="preview">
                                  {u.online ? "Hi, I m Available" : "I'm busy"}
                                </p> */}
                              
                            </h4>  <div className="d-flex gap-4 justify-content-between">
                            <p className="m-0">   {u?.lastMessage?.message
    ? `${u?.lastMessage?.message?.substring(0, 10)}...`
    : ""}</p>
                            {/* <p>{formateTimeWithChatEnd(u?.lastMessage?.timestamp)}</p> */}
                            <p className="m-0">{u.lastMessage ? formateTimeWithChatEnd(u?.lastMessage?.timestamp) :""}</p>
                          </div>
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
                  <NavLink to="/chatbot">
                    {/* <NavLink to="/chatuser"> */}
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
          handleEmoji={setEmoji}
          getEmoji={emoji}
          documentRef={documentRef}
          setDocumentRef={setDocumentRef}
          viewImage={viewImage}
          userList={userList}
          // handleClickedEmoji={handleClickedEmoji}
          {...{ u, handleSendMessage, messages }}
        />
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default Chatbot;
