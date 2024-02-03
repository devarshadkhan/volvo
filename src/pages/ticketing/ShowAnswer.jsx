import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Success from "../../components/commonUI/Success";
import { getRole, showError,truncateHTML } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { replySchema } from "../../utils/schema";
import { answerTicketAction } from "../../redux/slice/tickets/answerTaskSlice";
import TextEditor from "./TextEditor";
import Select from "react-select";

const ShowAnswer = ({ onClose, disable, type }) => {
  const [success, setSuccess] = useState(false);
  const [routeFlag, setRouteFlag] = useState(false);
  const [StatusVal,setStatus] = useState(false);
  const [taskAnswerError, setTaskAnswerError] = useState("");

  const isDisabled = type === "view" || type === "update" || type === "reply";

  const initialValues = {
    ticketId: "",
    taskAnswer: "",
    status:""
  };
  const [userValues, setUserValues] = useState(initialValues);

  const dispatch = useDispatch();
  const userById = useSelector((state) => state.ticketsById);
  const answerTicket = useSelector((state) => state.answerTicket);

  useEffect(() => {
    if (answerTicket.success && routeFlag) {
      onClose();
    }
  }, [answerTicket.success, routeFlag]);

  useEffect(() => {
    if (userById.success) {
      if (type === "add") {
        setUserValues(initialValues);
      } else {
        setUserValues({
          ...userById.user,
          teamId: {
            value: userById.user?.teamId,
            label: userById.user?.teamName,
          },
          managerId: {
            value: userById.user?.managerId,
            label: userById.user?.managerName,
          },
          tlId: {
            value: userById.user?.tlId,
            label: userById.user?.tlName,
          },
        });
      }
    }
  }, [userById.success]);

  useEffect(() => {
    if (answerTicket.success && routeFlag) {
      setSuccess(true);
    }
  }, [answerTicket.success, routeFlag]);

  const { handleChange, handleBlur,setFieldValue,setFieldTouched, values, errors, touched, handleSubmit } =
    useFormik({
      initialValues: userValues,
      enableReinitialize: true,
      onSubmit: (values) => {
        if (typeof values.taskAnswer === "undefined") {
          const errorMessage = "Task answer is required.";
          setTaskAnswerError(errorMessage);
        }
        const strippedTaskAnswer = values.taskAnswer.replace(/<[^>]*>/g, '');
        if (!strippedTaskAnswer.trim()) {
          const errorMessage = "Task answer is required.";
          setTaskAnswerError(errorMessage);
          return;
        }
        setTaskAnswerError(""); 
        let answerType = "";
        const role = getRole();
        if (role === "ROLE_MANAGER") {
          answerType = "manager";
        } else if (role === "ROLE_TEAM LEAD") {
          answerType = "team Lead";
        } else if (role === "ROLE_ASSOCIATE") {
          answerType = "associate";
        }
        let status = '';
  
        if(StatusVal){
          status = StatusVal;
        }else{
          status = values?.status;
        }
        
        dispatch(
          answerTicketAction({taskAnswer: values.taskAnswer,ticketId: values.ticketNo,answerType,status:status})
        );
        setRouteFlag(true);
      },
    });

  const canAnswer = ["ROLE_MANAGER", "ROLE_TEAM LEAD", "ROLE_ASSOCIATE"].includes(
    getRole()
  );

  function getInitials(fullName) {
    if (!fullName) return "";
    const namesArray = fullName.split(" ");
    const initials = namesArray.map((name) => name.charAt(0).toUpperCase()).join("");
    return initials;
  }

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    setFieldValue("status", selectedStatus); // Use setFieldValue from useFormik
    setFieldTouched("status", true);
   
  };

  const renderRole = (role, value) => {
    const roleStyle = {
      fontWeight: "bold",
    };

    return value ? (
      <span>
        {role && `${role} - `}
        <strong style={roleStyle}>{value}</strong>
      </span>
    ) : null;
  };
  const status = ["Pending", "Open", "Close"];
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mar-20 scroll">
          {/* taskQuestion lname */}
          <div className="Add-form-group">
            <div className="row">
              <div className=" col-md-12 mb-1 ">
                <label>Question <span>*</span><font> Ticket Number: <strong>{values?.ticketNo}</strong></font></label>
                <textarea type="text" className="input-control textAreahight"
                  placeholder="Lorem Ipsum is simply dummy text of the printing and type setting industry." name="taskQuestion"
                  value={values?.taskQuestion} disabled={true} >
                </textarea>
              </div>
              <div className=" col-md-6 mb-2 ">
                <label> Team<span>*</span></label>
                 <Select name="teamId" isDisabled={true} value={{value: values?.teamName || "",label:values?.teamName || "Select Team"}} placeholder={"Select a Team"}/>
              </div>

              <div className=" col-md-6 mb-2 ">
                <label> Manager<span>*</span></label>
                 <Select name="managerId" isDisabled={true} value={{value: values?.managerName || "",label:values?.managerName || "Select Manager"}} placeholder={"Select a Manager"}/>
              </div>

             
              <div className=" col-md-6 mb-2 ">
                <label> Team Lead<span>*</span></label>
                 <Select name="teamLeadId" isDisabled={true} value={{value: values?.tlName || "",label:values?.tlName || "Select Team Lead"}} placeholder={"Select a Team Lead"}/>
              </div>

              <div className=" col-md-6 mb-2 ">
                <label> Agent<span>*</span></label>
                 <Select name="agentId" isDisabled={true} value={{value: values?.agentName || "",label:values?.agentName || "Select Agent Name"}} placeholder={"Select Agent Name"}/>
              </div>


              <div className=" col-md-12 mt-3 ">
                <div className="popupText">
                  <div class="row">
                   <div class=" col-lg-1">
                   Status: 
                    </div>
                    <div class=" col-lg-2">
                      <div class="radio">
                        <input id="radio1" name="status"  type="radio" value="0"
                        checked={values?.status === '0'} onChange={handleStatusChange} disabled={type === 'view' ||  getRole() == "ROLE_ADMIN" ||
                        getRole() == "ROLE_SUPPORT" ||
                        getRole() == "ROLE_USER" ||
                        getRole() == "ROLE_QA"}/>
                        <label for="radio1">Pending</label>
                      </div>
                    </div>
                    <div class=" col-lg-2">
                      <div class="radio">
                        <input id="radio2" name="status" type="radio" value="2"
                        checked={values?.status === '2'} onChange={handleStatusChange} disabled={type === 'view' ||  getRole() == "ROLE_ADMIN" ||
                        getRole() == "ROLE_SUPPORT" ||
                        getRole() == "ROLE_USER" ||
                        getRole() == "ROLE_QA"}/>
                        <label for="radio2">Close</label>
                      </div>
                    </div>
                    <div class=" col-lg-2">
                      <div class="radio">
                        <input id="radio3" name="status" type="radio" value="1"
                        checked={values?.status === '1'} onChange={handleStatusChange} disabled={type === 'view' ||  getRole() == "ROLE_ADMIN" ||
                        getRole() == "ROLE_SUPPORT" ||
                        getRole() == "ROLE_USER" ||
                        getRole() == "ROLE_QA"}/>
                        <label for="radio3">Open</label>
                      </div>
                    </div>
                    </div>
                  </div>
              </div>
           
              {userById.user?.answer?.length > 0 ? 
              (<div className=" col-md-12 mt-4 ">
                <div className="popupText">Comments:  </div>
              </div>) :  (<div className=" col-md-12 mt-4 ">
                <div className="popupText"></div>
              </div>)
              }

              {userById.user?.answer?.length === 0 ? (
                    <div className=" col-md-12 mt-2 ">
                  </div>
                ):( userById.user?.answer?.map((a, i) => {
                  return (
                    <>
                      <div className=" col-md-12 mt-2 ">
                        <div className="popupComment">
                          <h4 className="bluebg">
                            {a.answerType === "associate"
                              ? getInitials(values?.agentName)
                              : a?.answerType === "team Lead"
                              ? getInitials(values?.tlName)
                              : a?.answerType === "manager"
                              ? getInitials(values?.managerName)
                              : ""}
                            <font className="online"></font></h4>
                            <h3> {a.answerType === "associate"
                            ? values?.agentName
                            : a?.answerType === "team Lead"
                            ? values?.tlName
                            : a?.answerType === "manager"
                            ? values?.managerName
                            : ""}</h3> 
                        </div>
                      </div>

                      <div className=" col-md-12 mt-2 ">
                        <div className="popupCommentdec">
                        <p dangerouslySetInnerHTML={{ __html: truncateHTML(a?.taskAnswer) }}></p>
                        </div>
                      </div>
                    </>
              );
            })
          )}
              {type === 'reply' && canAnswer ? 
              <div className=" col-md-12 mt-2 ">
                <div className="">
                    <TextEditor
                    name="taskAnswer"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.taskAnswer}
                    setFieldValue={setFieldValue} />
                  {taskAnswerError && <div className="error-msg">{taskAnswerError}</div>}
                </div>
              </div>
              : ''}
            </div>
          </div>
          {/* submit */}
          <div className="form-group aling-center-btn">
            {!disable && canAnswer && (<button type="submit" className="btn btn-primary-big big-btn-padd">
                Reply
              </button>
            )}
          </div>
        </div>
      </form>
      <Success
        isOpen={success}
        onClose={() => setSuccess(false)}
        message={
          type === "profile"
            ? "Profile updated successfully!"
            : "Added Successfully"
        }
        descMessage={"Your informations has been updated successfully!"}
        closePreviousModal={onClose}
      />
    </>
  );
};
export default ShowAnswer;
