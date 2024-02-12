// =================== PROPER WORK CODE ==========================================

import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "../../../utils/utils";
import Delete from "../../../components/commonUI/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getChatBotMessageData } from "../../../redux/slice/chatBot/chatBotSlice";
import EmojiPicker from 'emoji-picker-react';


const Messaging = ({
  chat,
  setMessage,
  messages,
  message,
  handleSendMessage,
  senderId,
  u,
  setHandleEmjoji,
  handleEmjoji
}) => {
  console.log("chat", messages);
  const messagesContainerRef = useRef(null);

  /**
   * Emoji state and logic here
   */

  const [emojiShowing,setEmojiShowing] = useState(false)

  const emojiPickerRef = useRef(null);

  // Function to close emoji picker when clicking outside
  const handleOutsideClick = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setEmojiShowing(false);
    }
  };




  const handleEmojiClick = (event) => {
    console.log(handleEmjoji);
    // setHandleEmjoji(handleEmjoji.emoji);
    // setMessage(prevMessage => prevMessage + handleEmjoji.emoji);  // Update the input box value
  };


















  // Attach event listener on component mount
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  // chat message
  /**
   * Selected Message Particular by ID
   */
  const selectedUserId = chat.userId; // Assuming chat object has an 'id' property

  const getData = useSelector((item) => item.getChatBot);
  const werty = getData.dataMesaage;
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch chat messages when the component mounts
    dispatch(
      getChatBotMessageData({ senderID: senderId, receiverID: selectedUserId })
    );
  }, [dispatch, senderId, selectedUserId]);

  // chat end me

  /**
   * Selected Message Particular by ID
   */
  const selectedUserMessages = messages.filter(
    (m) => m.senderId === selectedUserId || m.receiverId === selectedUserId
  );

  /**
   * Chat Message listing Dat
   */
  const senderIdToFilter = String(u.id);
  const receiverIdToFilter = String(selectedUserId);
  // console.log("senderIdToFilter",senderIdToFilter);
  // console.log("receiverIdToFilter",receiverIdToFilter);

  useEffect(() => {
    // Scroll to the bottom of the messages div
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [werty, message]);
  const [isOpen, setIsopen] = useState(false);
  const ToggleSidebar = () => {
    isOpen === true ? setIsopen(false) : setIsopen(true);
  };
  // .......Delete--------------
  const [showConfirm, setShowConfirm] = useState(false);
  // .......show-hide--------------
  const [divVisibility, setDivVisibility] = useState({
    div1: true,
    div2: false,
    div3: false,
    div4: false,
    div5: false,
    div6: false,
    div7: false,
    // Add more divs as needed
  });

  const showDiv = (divId) => {
    setDivVisibility((prevState) => {
      const updatedVisibility = {};
      // Hide all divs
      Object.keys(prevState).forEach((key) => {
        updatedVisibility[key] = false;
      });
      // Show the selected div
      updatedVisibility[divId] = true;
      return updatedVisibility;
    });
  };

  // .......show-hide--------------

  return (
    <>
      <div className="content">
        <div className="contact-profile">
          <div className="row">
            <div className="col-7">
              {/* <div className="users" onClick={ToggleSidebar}> */}
              <div className="users">
                <span
                  class={
                    chat?.online === true
                      ? "contact-status online"
                      : "contact-status busy"
                  }
                ></span>
                <img src={chat?.profileImage || "/icons-images/profile1.png"} />
                <h3>
                  {chat?.fname + "    " + chat?.lname}{" "}
                  {/* <i class="fa-solid fa-gear"></i> */}
                  <br />
                  <p className={chat?.online === true ? "online" : "offline"}>
                    {" "}
                    {chat?.online === true ? "Online" : "Offline"}
                  </p>
                </h3>
              </div>
            </div>
            <div className="col-5">
              <div className="social-media">
                <i class="fa-solid fa-magnifying-glass"></i>
                <i class="fa-regular fa-heart"></i>
                <i class="fa-regular fa-bell"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="messages" ref={messagesContainerRef}>
          <ul>
            {/* {werty.length > 0 ? <> */}
            {werty.map((m) => {
              {
                /* console.log("WERYDAT ",m.senderId) */
              }
              return (
                <>
                  <li className={u?.id == m?.senderId ? "sent" : "replies"}>
                    <img
                      src={
                        u?.id === m?.senderId
                          ? `${m.receiverImage}`
                          : `${m.senderImage}`
                      }
                      alt=""
                    />
                    <p>
                      {m.text}
                      <br />
                      <font class="we">
                        {formatRelativeDate(m?.timestamp)}{" "}
                        <i className="fa-solid fa-check-double"></i>
                      </font>
                    </p>
                  </li>
                </>
              );
            })}
            {/* </>:<><h1 className="textHighlighted">NO DATA FOUND</h1></>} */}
            {/* Display Receiver's messages */}
            {/* {receiverMessages.map((m) => (
              <li
                className={
                  selectedUserId === m?.receiverId ? " replies" : " sent"
                }
              >
                <img
                  src={
                    m?.id === m?.senderId
                      ? `${m.senderImage}`
                      : `${m.receiverImage}`
                  }
                  // src={`${process.env.PUBLIC_URL}/icons-images/profile4.png`}
                  alt=""
                />
                <p>
                  {m.text}
                  <br />
                  <font>
                    {formatRelativeDate(m?.timestamp)}{" "}
                    <i className="fa-solid fa-check-double"></i>
                  </font>
                </p>
              </li>
            ))} */}
            {/* Display API Call Messages */}
            {selectedUserMessages.map((m) => {
              console.log("LIVE SOCKET MESSAGE", m.senderId);
              console.log("LIVE SOCKET MESSAGE ?.id", u?.id);
              return (
                <>
                  <li className={u?.id === m?.senderId ? "sent" : "replies"}>
                    <img
                      src={`${m.image}`}
                      // src={
                      //   u?.id === m?.senderId
                      //     ? `${m.image}`
                      //     : `${m.image}`
                      // }
                      alt=""
                    />
                    <p>
                      {m.message}
                      <br />
                      <font class="we">
                        {formatRelativeDate(m?.timestamp)}{" "}
                        <i className="fa-solid fa-check-double"></i>
                      </font>
                    </p>
                  </li>
                </>
              );
            })}
          </ul>
        {emojiShowing ? <>
          <div className="emojiPicker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </>: null}
        </div>
        <form className="chat-box" onSubmit={handleSendMessage}>
          <div className="">
            <div className="icon">
              {/* <NavLink>
                <i class="fa-solid fa-plus"></i>
              </NavLink> */}
              <NavLink>
                {" "}
                <i class="fa-regular fa-image"></i>
              </NavLink>
              <NavLink>
                {" "}
                <i class="fa-regular fa-face-smile" onClick={()=>setEmojiShowing(!emojiShowing)}></i>
              </NavLink>

              <a>
                <label htmlFor="file-input4">
                  {/* <img
                            src={
                              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                            }
                            width={"10px"}
                            alt="Uploaded"
                          /> */}
                  <i class="fa-solid fa-paperclip"></i>
                </label>
                <input
                  id="file-input4"
                  type="file"
                  accept="image/*"
                  className="d-none"
                />
              </a>
            </div>
          </div>

          <div className="chatinputwidth">
            <div class="search">
              {/* <label for="">
                <i class="fa-regular fa-face-smile"></i>
              </label> */}

              <textarea
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message..."
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
          </div>
          <div className="">
            <button type="submit" className="icon sendBtn">
              {/* <NavLink> */}
              <i class="fa-solid fa-paper-plane"></i>
              {/* send */}
              {/* </NavLink> */}
            </button>
          </div>
        </form>
      </div>

      {/* right panal */}
      <div className={`rightsidebar ${isOpen == true ? "active" : ""}`}>
        {divVisibility.div1 && (
          <div className="white-bg">
            <div className="topBox">
              <div>
                <Link onClick={ToggleSidebar}>
                  <i class="fa-solid fa-xmark"></i>
                </Link>
              </div>
              <div>
                <h3>Airtel</h3>
              </div>
              <div></div>
            </div>

            <div className="tabs">
              <div>
                <Link>
                  <h2>
                    <img src="/icons-images/speaker-icon.png" />
                    <br />
                    Mute
                  </h2>
                </Link>
              </div>
              <div>
                <h2>
                  <Link onClick={() => showDiv("div2")}>
                    <img src="/icons-images/member-icon.png" />
                    <br />
                    Members
                  </Link>
                </h2>
              </div>
              <div>
                <h2>
                  <Link onClick={() => showDiv("div3")}>
                    <img src="/icons-images/invite-icon.png" />
                    <br />
                    Invite
                  </Link>
                </h2>
              </div>
              <div>
                <h2>
                  <Link onClick={() => setShowConfirm(true)}>
                    <img src="/icons-images/leave-icon.png" />
                    <br />
                    Leave
                  </Link>
                </h2>
              </div>
            </div>
            <hr className="mt-0" />
            <div className="scrollbar">
              <div className="navigation">
                <li>
                  {" "}
                  <img src="/icons-images/photo-icon.png" /> Photo & videos{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
              </div>

              <div className="photo">
                <h3>No Photos or videos found.</h3>
              </div>

              <div className="navigation mt-3">
                <li>
                  {" "}
                  <img src="/icons-images/album-icon.png" /> Album{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
              </div>

              <div className="photo">
                <h3>
                  Keep your best photos in albums and share them with the chat.
                </h3>
                <h2>Create album</h2>
              </div>
              <div className="navigation mt-3">
                <li>
                  {" "}
                  <img src="/icons-images/note-icon.png" /> Notes{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
                <li>
                  {" "}
                  <img src="/icons-images/events-icon.png" /> Events{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
                <li>
                  {" "}
                  <img src="/icons-images/links-icon.png" /> Links{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
                <li>
                  {" "}
                  <img src="/icons-images/files-icon.png" /> Files{" "}
                  <i class="fa-solid fa-chevron-right"></i>
                </li>
              </div>
            </div>
          </div>
        )}

        {/* .............2............ */}
        {divVisibility.div2 && (
          <div className="white-bg">
            <div className="topBox">
              <div>
                <Link onClick={() => showDiv("div1")}>
                  <i class="fa-solid fa-xmark"></i>
                </Link>
              </div>
              <div>
                <h3>Airtel 6</h3>
              </div>
              <div></div>
            </div>

            <div className="search">
              <label for="">
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
              <input
                type="text"
                className="gray-bg"
                placeholder="Search by name"
              />
            </div>

            <div className="scrollbar mar-top">
              <div className="chatGroup">
                <h2>Friends </h2>
                <div className="scroll-box">
                  <Link to="/chatuser">
                    <div className="chatGroupbox">
                      <div class="profile">
                        <div class="users">
                          <img src="/icons-images/profile1.png" />
                          <h3>
                            Naiyana <br />
                            <font>Hi, I m Available</font>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/chatuser">
                    <div className="chatGroupbox">
                      <div class="profile">
                        <div class="users">
                          <img src="/icons-images/profile3.png" />
                          <h3>
                            Rahul Narang <br />
                            <font>Hi, I m Available</font>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to="/chatuser">
                    <div className="chatGroupbox">
                      <div class="profile">
                        <div class="users">
                          <img src="/icons-images/profile4.png" />
                          <h3>
                            Anjali Sharma
                            <br />
                            <font>Hi, I m Available</font>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="chatGroupbox">
                    <div class="profile">
                      <div class="users">
                        <img src="/icons-images/profile5.png" />
                        <h3>
                          Asif Imam
                          <br />
                          <font>Hi, I m Available</font>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* .............2............ */}

        {divVisibility.div3 && (
          <div className="white-bg">
            <div className="topBox">
              <div>
                <Link onClick={() => showDiv("div1")}>
                  <i class="fa-solid fa-xmark"></i>
                </Link>
              </div>
              <div>
                <h3>Choose friend </h3>
              </div>
              <div>
                <Link onClick={() => showDiv("div4")}>
                  <p>Next</p>
                </Link>
              </div>
            </div>
            <div className="search">
              <label for="">
                <i className="fa fa-search" aria-hidden="true"></i>
              </label>
              <input
                type="text"
                className="gray-bg"
                placeholder="Search by name"
              />
            </div>

            <div className="scrollbar mar-top">
              <div className="chatGroup">
                <h2>Friends </h2>

                <div className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile1.png" />
                      <h3>
                        Naiyana
                        <br />
                        <font>Hi, I m Available</font>
                      </h3>
                    </div>
                    <div class="checkbox-friend checkbox-primary-small">
                      <input id="1" type="checkbox" />
                      <label for="1"></label>
                    </div>
                  </div>
                </div>
                <div className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile3.png" />
                      <h3>
                        Rahul Narang <br />
                        <font>Hi, I m Available</font>
                      </h3>
                    </div>
                    <div class="checkbox-friend checkbox-primary-small">
                      <input id="2" type="checkbox" />
                      <label for="2"></label>
                    </div>
                  </div>
                </div>

                <div className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile4.png" />
                      <h3>
                        Anjali Sharma
                        <br />
                        <font>Hi, I m Available</font>
                      </h3>
                    </div>
                    <div class="checkbox-friend checkbox-primary-small">
                      <input id="3" type="checkbox" />
                      <label for="3"></label>
                    </div>
                  </div>
                </div>

                <div className="chatGroupbox">
                  <div class="profile">
                    <div class="users">
                      <img src="/icons-images/profile5.png" />
                      <h3>
                        Asif Imam
                        <br />
                        <font>Hi, I m Available</font>
                      </h3>
                    </div>
                    <div class="checkbox-friend checkbox-primary-small">
                      <input id="4" type="checkbox" />
                      <label for="4"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* .............3............ */}

        {divVisibility.div4 && (
          <div className="white-bg">
            <div className="topBox">
              <div>
                <Link onClick={() => showDiv("div1")}>
                  <i class="fa-solid fa-xmark"></i>
                </Link>
              </div>
              <div>
                <h3>New Group</h3>
              </div>
              <div></div>
            </div>

            <div className="search">
              <label for="" className="l-mar">
                <img src="icons-images/group-create-icon.png" />
              </label>
              <input
                className="gray-bg g-search"
                type="text"
                placeholder="Group Name"
              />
            </div>

            <div className="search">
              <button className="btn-permissions" type="button">
                Group Permissions <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="scrollbar mar-top170 ">
              <div className="chatGroup">
                <h2>Friends </h2>
                <div className="scroll-box">
                  <div className="chatGroupbox">
                    <div class="profile">
                      <div class="users">
                        <img src="/icons-images/profile1.png" />
                        <h3>
                          Naiyana
                          <br />
                          <font>Hi, I m Available</font>
                        </h3>
                      </div>
                      <div class="checkbox-friend checkbox-primary-small">
                        <input id="1" type="checkbox" checked />
                        <label for="1"></label>
                      </div>
                    </div>
                  </div>
                  <div className="chatGroupbox">
                    <div class="profile">
                      <div class="users">
                        <img src="/icons-images/profile3.png" />
                        <h3>
                          Rahul Narang <br />
                          <font>Hi, I m Available</font>
                        </h3>
                      </div>
                      <div class="checkbox-friend checkbox-primary-small">
                        <input id="2" type="checkbox" checked />
                        <label for="2"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Delete isOpen={showConfirm} onClose={() => setShowConfirm(false)} />

      {/* right panal */}
    </>
  );
};

export default Messaging;

// === Dont touch the logic 1st  ===
// const selectedUserId = chat.userId; // Assuming chat object has an 'id' property
//   console.log("qqqqqqqqqqqqqqqssssssssssssss",selectedUserId);
// const selectedUserMessages = messages.filter(
//   (m) => m.senderId === selectedUserId || m.receiverId === selectedUserId
// );

// ==========================================================================================

// const allApiMessages = getData.dataMesaage;

// Get the dynamic sender and receiver IDs
//  const senderIdToFilter = u.id  // Assuming u object contains the current user details
//  const receiverIdToFilter = selectedUserId

// localStorage.setItem("senderID",u.id)
// localStorage.setItem("receiverId",selectedUserId)

// console.log(localStorage.getItem("ssenderID"));
// console.log(localStorage.getItem("receiverId"));

//    const senderIdToFilter = u.id  // Assuming u object contains the current user details
//    const receiverIdToFilter = selectedUserId

//    console.log("senderIdToFilter ",senderIdToFilter , " receiverIdToFilter",  receiverIdToFilter);;

//       const senderMessages1 = getData.dataMesaage.filter((message) => message.senderID === senderIdToFilter);
//    console.log( "senderMessages1",senderMessages1);

//    // Filter messages based on sender and receiver IDs
//   //  const senderMessages = getData.dataMesaage.filter(
//   //    (message) => message.senderId === senderIdToFilter && message.receiverId === receiverIdToFilter
//   //  );
//   //  const receiverMessages = getData.dataMesaage.filter(
//   //    (message) => message.senderId === receiverIdToFilter && message.receiverId === senderIdToFilter
//   //  );

//   //  console.log("Sender Messages:");
//   //  senderMessages.forEach((message) => console.log(`${message.text} - ${message.timestamp}`));

//   //  console.log("Receiver Messages:");
//   //  receiverMessages.forEach((message) => console.log(`${message.text} - ${message.timestamp}`));

// // Assuming senderIdToFilter and receiverIdToFilter are strings
// const senderMessages = getData.dataMesaage.filter(
//   (message) => message.senderId === senderIdToFilter
// );

// const receiverMessages = getData.dataMesaage.filter(
//   (message) => message.senderId === receiverIdToFilter
// );

// === Dont touch the logic 2st  ===

// // =================== PROPER WORK CODE ==========================================

// import React, { useEffect, useRef, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { formatRelativeDate } from "../../../utils/utils";
// import Delete from "../../../components/commonUI/Delete";
// import { useDispatch, useSelector } from "react-redux";
// import { getChatBotMessageData } from "../../../redux/slice/chatBot/chatBotSlice";

// const Messaging = ({
//   chat,
//   setMessage,
//   messages,
//   message,
//   handleSendMessage,
//   senderId,
//   u,
// }) => {
//   console.log("UUUUU", u);
//   // console.log("CHAT", messages);
//   // console.log("CHATNAME", chat);
//   // console.log("senderId", senderId);
//   const messagesContainerRef = useRef(null);

//   // chat message
//   /**
//    * Selected Message Particular by ID
//    */

//   const selectedUserId = chat.userId; // Assuming chat object has an 'id' property
//   // console.log("sssssss",selectedUserId);

//   const getData = useSelector((item) => item.getChatBot);
//   const dispatch = useDispatch();
//   // console.log("cbywecbghydddddddddddddddb",getData.dataMesaage);
//   useEffect(() => {
//     // Fetch chat messages when the component mounts
//     dispatch(
//       getChatBotMessageData({ senderID: senderId, receiverID: selectedUserId })
//     );
//   }, [dispatch, senderId, selectedUserId]);

//   // live tab panel hai filter hokar open honge
//   const selectedUserMessages = messages.filter(
//     (m) => m.senderId === selectedUserId || m.receiverId === selectedUserId
//   );
//   // console.log(selectedUserMessages);

//   // const senderMessages = getData.dataMesaage.filter((m) => m.senderId ===  u.id);

//   // const receiverMessages = getData.dataMesaage.filter((m) => m.receiverId === selectedUserId);

//   //   const senderMessages = getData.dataMesaage.filter((m) => m.senderId === u.id && m.receiverId === selectedUserId);

//   // const receiverMessages = getData.dataMesaage.filter((m) => m.senderId === selectedUserId && m.receiverId === u.id);

//   // console.log("senderMessages",senderMessages);
//   // console.log("receiverMessages",receiverMessages);

//   // console.log("u.id:", u.id);
//   // console.log("selectedUserId:", selectedUserId);
//   // console.log("All Message IDs:", getData.dataMesaage.map(m => m.senderId + " -> " + m.receiverId));

//   // const senderMessages = getData.dataMesaage.filter((m) => m.senderId == u.id && m.receiverId == selectedUserId);
//   // const receiverMessages = getData.dataMesaage.filter((m) => m.senderId == selectedUserId && m.receiverId == u.id);

//   // console.log("senderMessages", senderMessages);
//   // console.log("receiverMessages", receiverMessages);

//   // chat end me

//   /**
//    * Selected Message Particular by ID
//    */

//   useEffect(() => {
//     // Scroll to the bottom of the messages div
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTop =
//         messagesContainerRef.current.scrollHeight;
//     }
//   }, [messages]);
//   const [isOpen, setIsopen] = useState(false);
//   const ToggleSidebar = () => {
//     isOpen === true ? setIsopen(false) : setIsopen(true);
//   };
//   // .......Delete--------------
//   const [showConfirm, setShowConfirm] = useState(false);
//   // .......show-hide--------------
//   const [divVisibility, setDivVisibility] = useState({
//     div1: true,
//     div2: false,
//     div3: false,
//     div4: false,
//     div5: false,
//     div6: false,
//     div7: false,
//     // Add more divs as needed
//   });

//   const showDiv = (divId) => {
//     setDivVisibility((prevState) => {
//       const updatedVisibility = {};
//       // Hide all divs
//       Object.keys(prevState).forEach((key) => {
//         updatedVisibility[key] = false;
//       });
//       // Show the selected div
//       updatedVisibility[divId] = true;
//       return updatedVisibility;
//     });
//   };

//   // .......show-hide--------------

//   const senderIdToFilter = String(u.id);
//   const receiverIdToFilter = String(selectedUserId);
//   const werty = getData.dataMesaage;
//   // console.log("getD",werty);
//   // const senderMessages = werty.filter(message => message.senderId === senderIdToFilter && message.receiverId === receiverIdToFilter);
//   // const receiverMessages =werty.filter(message => message.senderId === receiverIdToFilter && message.receiverId === senderIdToFilter);

//   // console.log("Sender Messages:");
//   // senderMessages.forEach(message => console.log(`${message.text} - ${message.timestamp}`));

//   // console.log("Receiver Messages:");
//   // receiverMessages.forEach(message => console.log(`${message.text} - ${message.timestamp}`));

//   const senderMessages = getData.dataMesaage
//     .filter(
//       (m) =>
//         m.senderId === senderIdToFilter && m.receiverId === receiverIdToFilter
//     )
//     .sort(
//       (a, b) =>
//         new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//     );

//   const receiverMessages = getData.dataMesaage
//     .filter(
//       (m) =>
//         m.senderId === receiverIdToFilter && m.receiverId === senderIdToFilter
//     )
//     .sort(
//       (a, b) =>
//         new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//     );

//   console.log("senderMessages", senderMessages);
//   console.log("receiverMessages", receiverMessages);

//   return (
//     <>
//       <div className="content">
//         <div className="contact-profile">
//           <div className="row">
//             <div className="col-7">
//               <div className="users" onClick={ToggleSidebar}>
//                 <span
//                   class={
//                     chat?.online
//                       ? "contact-status online"
//                       : "contact-status busy"
//                   }
//                 ></span>
//                 <img src={chat?.profileImage || "/icons-images/profile1.png"} />
//                 <h3>
//                   {chat?.fname + "    " + chat?.lname}{" "}
//                   <i class="fa-solid fa-gear"></i>
//                   <br />
//                   <font>Hi, I m Available</font>
//                 </h3>
//               </div>
//             </div>
//             <div className="col-5">
//               <div className="social-media">
//                 <i class="fa-solid fa-magnifying-glass"></i>
//                 <i class="fa-regular fa-heart"></i>
//                 <i class="fa-regular fa-bell"></i>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="messages" ref={messagesContainerRef}>
//           <ul>
//             {/* Display Sender's messages */}
//             {senderMessages.map((m) => (
//               <li className={u?.id === m?.senderId ? "sent" : "replies"}>
//                 <img
//                   src={
//                     u?.id === m?.senderId
//                       ? `${m.senderImage}`
//                       : `${m.receiverImage}`
//                   }
//                   alt=""
//                 />
//                 <p>
//                   {m.text}
//                   <br />
//                   <font>
//                     {formatRelativeDate(m?.timestamp)}{" "}
//                     <i className="fa-solid fa-check-double"></i>
//                   </font>
//                 </p>
//               </li>
//             ))}
//             {/* Display Receiver's messages */}
//             {receiverMessages.map((m) => (
//               <li
//                 className={
//                   selectedUserId === m?.receiverId ? " replies" : " sent"
//                 }
//               >
//                 <img
//                   src={
//                     m?.id === m?.senderId
//                       ? `${m.senderImage}`
//                       : `${m.receiverImage}`
//                   }
//                   // src={`${process.env.PUBLIC_URL}/icons-images/profile4.png`}
//                   alt=""
//                 />
//                 <p>
//                   {m.text}
//                   <br />
//                   <font>
//                     {formatRelativeDate(m?.timestamp)}{" "}
//                     <i className="fa-solid fa-check-double"></i>
//                   </font>
//                 </p>
//               </li>
//             ))}
//             {/* Display API Call Messages */}
//             {selectedUserMessages.map((m) => (
//               <li className={u?.id === m?.senderId ? "sent" : "replies"}>
//                 <img
//                   src={`${process.env.PUBLIC_URL}/icons-images/profile4.png`}
//                   alt=""
//                 />
//                 <p>
//                   {m.message}
//                   <br />
//                   <font>
//                     {formatRelativeDate(m?.timestamp)}{" "}
//                     <i className="fa-solid fa-check-double"></i>
//                   </font>
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <form className="chat-box" onSubmit={handleSendMessage}>
//           <div className="">
//             <div className="icon">
//               <NavLink>
//                 <i class="fa-solid fa-plus"></i>
//               </NavLink>
//               <NavLink>
//                 {" "}
//                 <i class="fa-regular fa-image"></i>
//               </NavLink>
//               <NavLink>
//                 <i class="fa-solid fa-paperclip"></i>
//               </NavLink>
//             </div>
//           </div>
//           <div className="chatinputwidth">
//             <div class="search">
//               <label for="">
//                 <i class="fa-regular fa-face-smile"></i>
//               </label>

//               <textarea
//                 type="text"
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Message..."
//                 value={message}
//                 //         onKeyDown={(e) => {
//                 //   if (e.key === "Enter" && !e.shiftKey) {
//                 //     e.preventDefault();
//                 //     handleSendMessage(e);
//                 //   }
//                 // }}
//               />
//             </div>
//           </div>
//           <div className="">
//             {/* <div className="icon">
//             <NavLink>
//             <i class="fa-solid fa-microphone"></i>
//             </NavLink>
//           </div> */}

//             <button type="submit" className="icon sendBtn">
//               {/* <NavLink> */}
//               <i class="fa-solid fa-paper-plane"></i>
//               {/* send */}
//               {/* </NavLink> */}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* right panal */}
//       <div className={`rightsidebar ${isOpen == true ? "active" : ""}`}>
//         {divVisibility.div1 && (
//           <div className="white-bg">
//             <div className="topBox">
//               <div>
//                 <Link onClick={ToggleSidebar}>
//                   <i class="fa-solid fa-xmark"></i>
//                 </Link>
//               </div>
//               <div>
//                 <h3>Airtel</h3>
//               </div>
//               <div></div>
//             </div>

//             <div className="tabs">
//               <div>
//                 <Link>
//                   <h2>
//                     <img src="/icons-images/speaker-icon.png" />
//                     <br />
//                     Mute
//                   </h2>
//                 </Link>
//               </div>
//               <div>
//                 <h2>
//                   <Link onClick={() => showDiv("div2")}>
//                     <img src="/icons-images/member-icon.png" />
//                     <br />
//                     Members
//                   </Link>
//                 </h2>
//               </div>
//               <div>
//                 <h2>
//                   <Link onClick={() => showDiv("div3")}>
//                     <img src="/icons-images/invite-icon.png" />
//                     <br />
//                     Invite
//                   </Link>
//                 </h2>
//               </div>
//               <div>
//                 <h2>
//                   <Link onClick={() => setShowConfirm(true)}>
//                     <img src="/icons-images/leave-icon.png" />
//                     <br />
//                     Leave
//                   </Link>
//                 </h2>
//               </div>
//             </div>
//             <hr className="mt-0" />
//             <div className="scrollbar">
//               <div className="navigation">
//                 <li>
//                   {" "}
//                   <img src="/icons-images/photo-icon.png" /> Photo & videos{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//               </div>

//               <div className="photo">
//                 <h3>No Photos or videos found.</h3>
//               </div>

//               <div className="navigation mt-3">
//                 <li>
//                   {" "}
//                   <img src="/icons-images/album-icon.png" /> Album{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//               </div>

//               <div className="photo">
//                 <h3>
//                   Keep your best photos in albums and share them with the chat.
//                 </h3>
//                 <h2>Create album</h2>
//               </div>
//               <div className="navigation mt-3">
//                 <li>
//                   {" "}
//                   <img src="/icons-images/note-icon.png" /> Notes{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//                 <li>
//                   {" "}
//                   <img src="/icons-images/events-icon.png" /> Events{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//                 <li>
//                   {" "}
//                   <img src="/icons-images/links-icon.png" /> Links{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//                 <li>
//                   {" "}
//                   <img src="/icons-images/files-icon.png" /> Files{" "}
//                   <i class="fa-solid fa-chevron-right"></i>
//                 </li>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* .............2............ */}
//         {divVisibility.div2 && (
//           <div className="white-bg">
//             <div className="topBox">
//               <div>
//                 <Link onClick={() => showDiv("div1")}>
//                   <i class="fa-solid fa-xmark"></i>
//                 </Link>
//               </div>
//               <div>
//                 <h3>Airtel 6</h3>
//               </div>
//               <div></div>
//             </div>

//             <div className="search">
//               <label for="">
//                 <i className="fa fa-search" aria-hidden="true"></i>
//               </label>
//               <input
//                 type="text"
//                 className="gray-bg"
//                 placeholder="Search by name"
//               />
//             </div>

//             <div className="scrollbar mar-top">
//               <div className="chatGroup">
//                 <h2>Friends </h2>
//                 <div className="scroll-box">
//                   <Link to="/chatuser">
//                     <div className="chatGroupbox">
//                       <div class="profile">
//                         <div class="users">
//                           <img src="/icons-images/profile1.png" />
//                           <h3>
//                             Naiyana <br />
//                             <font>Hi, I m Available</font>
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                   <Link to="/chatuser">
//                     <div className="chatGroupbox">
//                       <div class="profile">
//                         <div class="users">
//                           <img src="/icons-images/profile3.png" />
//                           <h3>
//                             Rahul Narang <br />
//                             <font>Hi, I m Available</font>
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                   <Link to="/chatuser">
//                     <div className="chatGroupbox">
//                       <div class="profile">
//                         <div class="users">
//                           <img src="/icons-images/profile4.png" />
//                           <h3>
//                             Anjali Sharma
//                             <br />
//                             <font>Hi, I m Available</font>
//                           </h3>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                   <div className="chatGroupbox">
//                     <div class="profile">
//                       <div class="users">
//                         <img src="/icons-images/profile5.png" />
//                         <h3>
//                           Asif Imam
//                           <br />
//                           <font>Hi, I m Available</font>
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* .............2............ */}

//         {divVisibility.div3 && (
//           <div className="white-bg">
//             <div className="topBox">
//               <div>
//                 <Link onClick={() => showDiv("div1")}>
//                   <i class="fa-solid fa-xmark"></i>
//                 </Link>
//               </div>
//               <div>
//                 <h3>Choose friend </h3>
//               </div>
//               <div>
//                 <Link onClick={() => showDiv("div4")}>
//                   <p>Next</p>
//                 </Link>
//               </div>
//             </div>
//             <div className="search">
//               <label for="">
//                 <i className="fa fa-search" aria-hidden="true"></i>
//               </label>
//               <input
//                 type="text"
//                 className="gray-bg"
//                 placeholder="Search by name"
//               />
//             </div>

//             <div className="scrollbar mar-top">
//               <div className="chatGroup">
//                 <h2>Friends </h2>

//                 <div className="chatGroupbox">
//                   <div class="profile">
//                     <div class="users">
//                       <img src="/icons-images/profile1.png" />
//                       <h3>
//                         Naiyana
//                         <br />
//                         <font>Hi, I m Available</font>
//                       </h3>
//                     </div>
//                     <div class="checkbox-friend checkbox-primary-small">
//                       <input id="1" type="checkbox" />
//                       <label for="1"></label>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="chatGroupbox">
//                   <div class="profile">
//                     <div class="users">
//                       <img src="/icons-images/profile3.png" />
//                       <h3>
//                         Rahul Narang <br />
//                         <font>Hi, I m Available</font>
//                       </h3>
//                     </div>
//                     <div class="checkbox-friend checkbox-primary-small">
//                       <input id="2" type="checkbox" />
//                       <label for="2"></label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="chatGroupbox">
//                   <div class="profile">
//                     <div class="users">
//                       <img src="/icons-images/profile4.png" />
//                       <h3>
//                         Anjali Sharma
//                         <br />
//                         <font>Hi, I m Available</font>
//                       </h3>
//                     </div>
//                     <div class="checkbox-friend checkbox-primary-small">
//                       <input id="3" type="checkbox" />
//                       <label for="3"></label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="chatGroupbox">
//                   <div class="profile">
//                     <div class="users">
//                       <img src="/icons-images/profile5.png" />
//                       <h3>
//                         Asif Imam
//                         <br />
//                         <font>Hi, I m Available</font>
//                       </h3>
//                     </div>
//                     <div class="checkbox-friend checkbox-primary-small">
//                       <input id="4" type="checkbox" />
//                       <label for="4"></label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* .............3............ */}

//         {divVisibility.div4 && (
//           <div className="white-bg">
//             <div className="topBox">
//               <div>
//                 <Link onClick={() => showDiv("div1")}>
//                   <i class="fa-solid fa-xmark"></i>
//                 </Link>
//               </div>
//               <div>
//                 <h3>New Group</h3>
//               </div>
//               <div></div>
//             </div>

//             <div className="search">
//               <label for="" className="l-mar">
//                 <img src="icons-images/group-create-icon.png" />
//               </label>
//               <input
//                 className="gray-bg g-search"
//                 type="text"
//                 placeholder="Group Name"
//               />
//             </div>

//             <div className="search">
//               <button className="btn-permissions" type="button">
//                 Group Permissions <i class="fa-solid fa-chevron-right"></i>
//               </button>
//             </div>

//             <div className="scrollbar mar-top170 ">
//               <div className="chatGroup">
//                 <h2>Friends </h2>
//                 <div className="scroll-box">
//                   <div className="chatGroupbox">
//                     <div class="profile">
//                       <div class="users">
//                         <img src="/icons-images/profile1.png" />
//                         <h3>
//                           Naiyana
//                           <br />
//                           <font>Hi, I m Available</font>
//                         </h3>
//                       </div>
//                       <div class="checkbox-friend checkbox-primary-small">
//                         <input id="1" type="checkbox" checked />
//                         <label for="1"></label>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="chatGroupbox">
//                     <div class="profile">
//                       <div class="users">
//                         <img src="/icons-images/profile3.png" />
//                         <h3>
//                           Rahul Narang <br />
//                           <font>Hi, I m Available</font>
//                         </h3>
//                       </div>
//                       <div class="checkbox-friend checkbox-primary-small">
//                         <input id="2" type="checkbox" checked />
//                         <label for="2"></label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Delete isOpen={showConfirm} onClose={() => setShowConfirm(false)} />

//       {/* right panal */}
//     </>
//   );
// };

// export default Messaging;

// const senderMessages = getData.dataMesaage
//   .filter(
//     (m) =>
//       m.senderId === senderIdToFilter && m.receiverId === receiverIdToFilter
//   )
//   .sort(
//     (a, b) =>
//       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

// const receiverMessages = getData.dataMesaage
//   .filter(
//     (m) =>
//       m.senderId === receiverIdToFilter && m.receiverId === senderIdToFilter
//   )
//   .sort(
//     (a, b) =>
//       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

// console.log("senderMessages", senderMessages);
// console.log("receiverMessages", receiverMessages);
