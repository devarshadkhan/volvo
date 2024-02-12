import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Success from "../../components/commonUI/Success";
import {
  canAssign,
  convertDateFormat,
  getId,
  getRole,
  reverseDateFormat,
  showError,
  showTicketFields,
} from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { addTicketAction } from "../../redux/slice/tickets/addTicketSlice";
import { addTicketSchema } from "../../utils/schema";
import Select from "react-select";
import { getAllTLAction } from "../../redux/slice/forForms/getAllTLSlice";
import { getAllTeamsAction } from "../../redux/slice/forForms/getAllTeamsFormSlice";
import { getAllManagersAction } from "../../redux/slice/forForms/getAllManagersSlice";
import { updateTicketAction } from "../../redux/slice/tickets/updateTicketSlice";
import { answerTicketAction } from "../../redux/slice/tickets/answerTaskSlice";
import { getAllAgentsAction } from "../../redux/slice/forForms/getAllAgentsSlice";
import { getAnalysisByTypePurposeAPI } from "../../redux/slice/analysis/getAnalysisbyTypePurposeSlice";
import { getAnalysisByTypeResolutionAPI } from "../../redux/slice/analysis/getAnalysisbyTypeResolutionSlice";

const hourData = [
  {
    id: 1,
    name: "1 hour",
  },
  {
    id: 2,
    name: "2 hour",
  },
  {
    id: 3,
    name: "3 hour",
  },
  {
    id: 4,
    name: "4 hour",
  },
  {
    id: 5,
    name: "5 hour",
  },
  {
    id: 6,
    name: "6 hour",
  },
  {
    id: 7,
    name: "7 hour",
  },
  {
    id: 8,
    name: "8 hour",
  },
  {
    id: 9,
    name: "9 hour",
  },
  {
    id: 10,
    name: "10 hour",
  },
  {
    id: 11,
    name: "11 hour",
  },
  {
    id: 12,
    name: "12 hour",
  },
];
const AddUserForm = ({ onClose, disable, type }) => {
  const [success, setSuccess] = useState(false);
  const [routeFlag, setRouteFlag] = useState(false);
  const isDisabled = type === "view" || type === "update";
  //   const { teamIdVal, managerIdVal, associateIdVal } = showTicketFields();
  const { agentCan, teamCan, managerCan, tlCan } = canAssign();

  const initialValues = {
    taskQuestion: "",
    teamId: "",
    managerId: "",
    tlId: "",
    agentId: "" || getId("ROLE_AGENT"),
    status: type === "add" ? "0" : "",
    roleType: "",
    analysisType: "",
    analysisValue: "",
    noOfDay: "",
  };
  const [userValues, setUserValues] = useState(initialValues);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (dateInputRef.current) {
      const today = new Date().toISOString().split("T")[0];
      dateInputRef.current.min = today;
    }
  }, []);

  const dispatch = useDispatch();
  const addUser = useSelector((state) => state.addTicket);
  const userById = useSelector((state) => state.ticketsById);
  const updateProfile = useSelector((state) => state.updateProfile);
  const updateUser = useSelector((state) => state.updateTicket);
  const allTeams = useSelector((state) => state.allTeams);
  const allManagers = useSelector((state) => state.allManagers);
  const TLs = useSelector((state) => state.TLs);
  const allAgents = useSelector((state) => state.allAgents);
  const userByToken = useSelector((state) => state.userByToken);

  // Analysis state in write code Arshad Pathaan
  const getAnalysisByTypePurpose = useSelector(
    (state) =>
      state.getAnalysisByTypePurpose.getAnalysisByTypePurposeData
        .analysisPurpose
  );
  const getAnalysisByTypeResolution = useSelector(
    (state) =>
      state.getAnalysisByTypeResolution.getAnalysisByTypeResolutionData
        .analysisResolution
  );
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [resolutionOptions, setResolutionOptions] = useState([]);
  useEffect(() => {
    dispatch(getAnalysisByTypePurposeAPI());
    dispatch(getAnalysisByTypeResolutionAPI());
  }, []);

  useEffect(() => {
    setPurposeOptions(
      getAnalysisByTypePurpose?.map((item) => {
        return {
          value: item?.name,
          label: item?.name,
        }
      }))
    
  }, [getAnalysisByTypePurpose]);

  useEffect(() => {
    setResolutionOptions(
      getAnalysisByTypeResolution?.map((item) => {
        return {
          value: item?.name,
          label: item?.name,
        }
      }))
    
  }, [getAnalysisByTypeResolution]);

  useEffect(() => {
    if (userById.success) {
      if (type === "add") {
        setUserValues(initialValues);
      } else {
        setUserValues({
          ...userById.user,
          teamId: userById.user?.teamId,
          managerId: userById.user?.managerId,
          tlId: userById.user?.tlId,
          analysisType: userById?.user?.analysisType,
          analysisValue: userById?.user?.analysisValue,
          noOfDay: userById.user.noOfDay,
        });
      }
    }
  }, [userById?.success]);

  useEffect(() => {
    if (addUser.success && routeFlag) {
      setSuccess(true);
    }
  }, [addUser.success]);

  useEffect(() => {
    if (updateProfile.success && routeFlag) {
      setSuccess(true);
    }
  }, [updateProfile.success]);

  useEffect(() => {
    if (updateUser.success && routeFlag) {
      setSuccess(true);
    }
  }, [updateUser.success]);

  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: userValues,
    validationSchema: addTicketSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("VVV", values);
      const formData = new FormData();
      // const convertedDate = values.noOfDay ? convertDateFormat(values.noOfDay) : "";

      // newValues.noOfDay = convertedDate;

      const newValues = {
        ...values,
        teamId: values.teamId || "",
        managerId: values.managerId || "",
        agentId: values.agentId || "",
        tlId: values.tlId || "",
        status: values.status,
        analysisType: values.analysisType || "",
        analysisValue: values.analysisValue || "",
        noOfDay: values.noOfDay || "",
        // noOfDay: convertDateFormat(values.noOfDay) || "",
      };

      if (type === "add") {
        dispatch(addTicketAction(newValues));
      } else if (type === "update") {
        dispatch(updateTicketAction({ id: values.ticketNo, data: newValues }));
      } else if (type === "answer") {
        dispatch(answerTicketAction(newValues));
      }

      setRouteFlag(true);
    },
  });

  useEffect(() => {
    dispatch(getAllTeamsAction());

    if (getRole() === "ROLE_ASSOCIATE") {
      if (userByToken.user.teamId.length === 1) {
        const userTeamId = userByToken.user.teamId[0]; // Assuming an associate is assigned to only one team
        const userTealId = userByToken.user.tlId;
        const userManagerId = userByToken.user.managerId;
        setFieldValue("teamId", userTeamId);
        setFieldValue("tlId", userTealId);
        setFieldValue("managerId", userManagerId);
      }
    }

    if (getRole() === "ROLE_TEAM LEAD") {
      if (userByToken.user.teamId.length === 1) {
        const userTeamId = userByToken.user.teamId[0];
        const userManagerId = userByToken.user.managerId;
        setFieldValue("teamId", userTeamId);
        setFieldValue("managerId", userManagerId);
      }
    }

    if (getRole() === "ROLE_MANAGER") {
      if (userByToken.user.teamId.length >= 1) {
        const userTeamId = userByToken.user.teamId[0];
        const userManagerId = getId("ROLE_MANAGER");
        if (values.teamId) {
          setFieldValue("teamId", values.teamId);
        } else {
          setFieldValue("teamId", userTeamId);
        }
        setFieldValue("managerId", userManagerId);
      }
    }

    if (values.teamId) {
      dispatch(getAllManagersAction(values.teamId));
    }

    if (values.managerId) {
      dispatch(
        getAllTLAction({
          teamId: values.teamId,
          managerId: values.managerId,
        })
      );
    }
    if (values.tlId) {
      dispatch(
        getAllAgentsAction({
          teamId: values.teamId,
          managerId: values.managerId,
          tlId: values.tlId,
        })
      );
    }
  }, [values.teamId, values.managerId, values.tlId]);

  const style = {
    control: (provided) => ({
      ...provided,
      height: "44px",
    }),
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mar-20 scroll">
          {/* taskQuestion lname */}
          <div className="Add-form-group">
            <div className="row">
              <div className=" col-md-12 mb-2 ">
                <label>
                  Question<span>*</span>{" "}
                  {type === "update" && (
                    <font>
                      Ticket Number: <strong>{values?.ticketNo}</strong>
                    </font>
                  )}
                </label>
                <textarea
                  type="text"
                  className="input-control textAreahight"
                  placeholder="Enter question here.."
                  name="taskQuestion"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.taskQuestion}
                  disabled={isDisabled}
                ></textarea>
                {showError(errors.taskQuestion, touched.taskQuestion)}
              </div>
              {/* Team */}
              <div className=" col-md-6 mb-2">
                <label>
                  Team<span>*</span>
                </label>
                <Select
                  name="teamId"
                  isDisabled={
                    getRole() === "ROLE_ASSOCIATE" ||
                    getRole() === "ROLE_TEAM LEAD"
                  }
                  onChange={(selectedOptions) => {
                    setFieldValue("teamId", selectedOptions.value);
                    if (getRole() == "ROLE_ASSOCIATE") {
                      setFieldValue("managerId", "");
                      setFieldValue("tlId", "");
                      setFieldValue("agentId", "");
                    } else if (getRole() == "ROLE_TEAM LEAD") {
                      setFieldValue("managerId", "");
                      setFieldValue("agentId", "");
                      setFieldValue("tlId", "");
                    } else if (getRole() == "ROLE_MANAGER") {
                      setFieldValue("tlId", "");
                      setFieldValue("agentId", "");
                    } else if (
                      getRole() == "ROLE_ADMIN" ||
                      getRole() == "ROLE_SUPPORT" ||
                      getRole() == "ROLE_USER" ||
                      getRole() == "ROLE_QA"
                    ) {
                      setFieldValue("managerId", "");
                      setFieldValue("agentId", "");
                      setFieldValue("tlId", "");
                    }
                  }}
                  options={
                    userByToken.user.teamId.length > 0
                      ? allTeams.teams
                          ?.filter((team) =>
                            userByToken.user.teamId.includes(team.id)
                          ) // Filter teams based on userByToken.user.teamId
                          .map((s) => ({
                            label: s.teamName,
                            value: s.id,
                          }))
                      : allTeams.teams?.map((s) => ({
                          // Show all teams if userByToken.user.teamId has no values
                          label: s.teamName,
                          value: s.id,
                        }))
                  }
                  value={{
                    value: values.teamId || "",
                    label:
                      allTeams.teams?.find((t) => t.id === values.teamId)
                        ?.teamName || "Select Team",
                  }}
                  styles={style}
                  placeholder={"Select a Team"}
                />
                {showError(errors.teamId, touched.teamId)}
              </div>

              {/* Manager */}
              <div className=" col-md-6 mb-2">
                <label>
                  Manager<span>*</span>
                </label>
                <Select
                  name="managerId"
                  isDisabled={
                    getRole() === "ROLE_ASSOCIATE" ||
                    getRole() === "ROLE_TEAM LEAD" ||
                    getRole() === "ROLE_MANAGER"
                  }
                  onChange={(selectedOptions) => {
                    setFieldValue("managerId", selectedOptions.value);
                    if (getRole() == "ROLE_ASSOCIATE") {
                      setFieldValue("tlId", "");
                      setFieldValue("agentId", "");
                    } else if (getRole() == "ROLE_TEAM LEAD") {
                      setFieldValue("agentId", "");
                      setFieldValue("tlId", "");
                    } else if (
                      getRole() == "ROLE_ADMIN" ||
                      getRole() == "ROLE_SUPPORT" ||
                      getRole() == "ROLE_USER" ||
                      getRole() == "ROLE_QA"
                    ) {
                      setFieldValue("tlId", "");
                      setFieldValue("agentId", "");
                    } else if (getRole() == "ROLE_MANAGER") {
                      setFieldValue("tlId", "");
                    }
                  }}
                  options={allManagers.managers?.map((s) => ({
                    label: s.managerName,
                    value: s.id,
                  }))}
                  value={{
                    value: values.managerId || "",
                    label:
                      allManagers.managers?.find(
                        (m) => m.id == values.managerId
                      )?.managerName || "Select Manager",
                  }}
                  styles={style}
                  placeholder={"Select a manager"}
                />
                {showError(errors.managerId, touched.managerId)}
              </div>

              {/* TeamLead */}
              <div className=" col-md-6 mb-2">
                <label>
                  Team lead
                  {getRole() === "ROLE_ASSOCIATE" && <span>*</span>}
                  {getRole() === "ROLE_MANAGER" && <span>*</span>}
                  {getRole() === "ROLE_TEAM LEAD" && <span>*</span>}
                </label>
                <Select
                  name="tlId"
                  isDisabled={getRole() === "ROLE_ASSOCIATE"}
                  onChange={(selectedOptions) => {
                    setFieldValue("tlId", selectedOptions.value);
                    if (getRole() === "ROLE_ASSOCIATE") {
                      setFieldValue("agentId", "");
                    } else if (
                      getRole() == "ROLE_ADMIN" ||
                      getRole() == "ROLE_SUPPORT" ||
                      getRole() == "ROLE_USER" ||
                      getRole() == "ROLE_QA"
                    ) {
                      setFieldValue("agentId", "");
                    } else if (getRole() === "ROLE_TEAM LEAD") {
                      setFieldValue("agentId", "");
                    }
                  }}
                  options={TLs.TLs?.map((s) => ({
                    label: s.tlName,
                    value: s.id,
                  }))}
                  value={{
                    value: values.tlId || "",
                    label:
                      TLs.TLs?.find((tl) => tl.id === values.tlId)?.tlName ||
                      "Select Team Lead",
                  }}
                  styles={style}
                  placeholder={"Select a team lead"}
                />
                {showError(errors.tlId, touched.tlId)}
              </div>

              {/* Agent */}
              <div className=" col-md-6 mb-2">
                <label>
                  {" "}
                  Agent
                  {getRole() === "ROLE_ASSOCIATE" && <span>*</span>}
                  {getRole() === "ROLE_TEAM LEAD" && <span>*</span>}
                </label>
                <Select
                  name="agentId"
                  // isDisabled={agentCan && type === "update"}
                  onChange={(selectedOptions) => {
                    setFieldValue("agentId", selectedOptions.value);
                  }}
                  options={allAgents.agents?.map((s) => ({
                    label: s.agentName,
                    value: s.id,
                  }))}
                  value={{
                    value: values.agentId || "",
                    label:
                      allAgents.agents?.find((a) => a.id === values.agentId)
                        ?.agentName || "Select Agent",
                  }}
                  styles={style}
                  placeholder={"Select a manager"}
                />
                {showError(errors.agentId, touched.agentId)}
              </div>

              {type === "update" && (
                <div className=" col-md-12 mb-2 ">
                  <label>
                    {" "}
                    Status<span>*</span>
                  </label>
                  <select
                    name="status"
                    class="input-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.status}
                  >
                    <option value="">Select Status</option>
                    <option value="2">Close</option>
                    <option value="1">Open</option>
                    <option value="0">Pending</option>
                  </select>
                </div>
              )}

              <div className="col-md-6 mb-2">
                <label>
                  Analysis Type<span>*</span>
                </label>
                <select
                  className="input-control"
                  name="analysisType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.analysisType}
                >
                  <option value="">Select Analysis Type</option>

                  <option value="1">Resolution</option>
                  <option value="2">Purpose</option>
                </select>
                {showError(errors.analysisType, touched.analysisType)}
              </div>

              {values.analysisType === "2" && (
                <>
                  <div className="col-md-6 mb-2">
                    <label>
                      Purpose Type<span>*</span>
                    </label>

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="analysisValue"
                      options={purposeOptions}
                      // onChange={handleChange}
                      onChange={(selectedOption) => setFieldValue('analysisValue', selectedOption?.value)}

                      // onChange={(selectedOption) => setFieldValue('analysisValue', selectedOption?.value)}

                      onBlur={handleBlur}
                      // value={values?.analysisValue}
                      value={purposeOptions.find(option => option.value === values.analysisValue)}
                    />
                    {/* <select
                      className="input-control"
                      name="analysisValue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.analysisValue}
                      // disabled={type === "view" || disable}
                    >
                      <option value="" defaultValue>
                        Select Purpose Value
                      </option>
                      {getAnalysisByTypePurpose?.map((item) => {
                        return (
                          <>
                            <option value={item.name}>{item.name}</option>
                          </>
                        );
                      })}
                    </select> */}
                    {showError(errors.analysisValue, touched.analysisValue)}
                  </div>
                  {/* choose a data */}
                  <div className=" col-md-6 ">
                    <div className="form-group ">
                      <label htmlFor="noOfDay">
                        Date<span>*</span>
                      </label>
                      <input
                        type="date"
                        className="input-control"
                        name="noOfDay"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.noOfDay}
                        // disabled={disable}
                        // ref={dateInputRef}
                        id="noOfDay"
                        min={today}
                      />
                    </div>
                    {showError(errors.noOfDay, touched.noOfDay)}
                  </div>
                  {/* choose a time */}
                  <div className="col-md-6">
                    <label>
                      No. of hours<span>*</span>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      // defaultValue={colourOptions[0]}
                      // isDisabled={isDisabled}
                      // isLoading={isLoading}
                      // isClearable={isClearable}
                      // isRtl={isRtl}
                      // isSearchable={isSearchable}
                      name="color"
                      options={hourData.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.noOfDay}
                    />
                    {/* <select
                      className="input-control"
                      name="noOfDay"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.noOfDay}
                    >
                      <option value="" defaultValue>
                        Select No. of hours
                      </option>
                      <>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hour">2 hour</option>
                        <option value="3 hour">3 hour</option>
                        <option value="4 hour">4 hour</option>
                        <option value="5 hour">5 hour</option>
                        <option value="6 hour">6 hour</option>
                        <option value="7 hour">7 hour</option>
                        <option value="8 hour">8 hour</option>
                        <option value="9 hour">9 hour</option>
                        <option value="10 hour">10 hour</option>
                        <option value="12 hour">12 hour</option>
                      </>
                      {showError(errors.noOfDay, touched.noOfDay)}
                    </select> */}
                  </div>
                </>
              )}
              {values.analysisType === "1" && (
                <>
                  <div className="col-md-6 mb-2">
                    <label>
                      Resolution Type<span>*</span>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      // defaultValue={colourOptions[0]}
                      // isDisabled={isDisabled}
                      // isLoading={isLoading}
                      // isClearable={isClearable}
                      // isRtl={isRtl}
                      // isSearchable={isSearchable}
                      name="color"
                      options={resolutionOptions}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.analysisValue}
                    />
                    {/* <select
                      className="input-control"
                      name="analysisValue"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.analysisValue}
                      disabled={type === "view" || disable}
                    >
                      <option value="" defaultValue hidden>
                        Select Resolution Value
                      </option>
                      {getAnalysisByTypeResolution?.map((item) => {
                        return (
                          <>
                            <option value={item.name}>{item.name}</option>
                          </>
                        );
                      })}
                    </select> */}
                    {showError(errors.analysisValue, touched.analysisValue)}
                  </div>
                  {/* choose a data */}
                  <div className=" col-md-6 ">
                    <div className="form-group ">
                      <label htmlFor="noOfDay">
                        Date<span>*</span>
                      </label>
                      <input
                        type="date"
                        className="input-control"
                        placeholder="Date of Birth"
                        name="noOfDay"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.noOfDay}
                        disabled={disable}
                        // ref={dateInputRef}
                        id="noOfDay"
                        min={today}
                      />
                    </div>
                    {showError(errors.noOfDay, touched.noOfDay)}
                  </div>
                  {/* choose a time */}
                  <div className="col-md-6">
                    <label>
                      No. of hours<span>*</span>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      // defaultValue={colourOptions[0]}
                      // isDisabled={isDisabled}
                      // isLoading={isLoading}
                      // isClearable={isClearable}
                      // isRtl={isRtl}
                      // isSearchable={isSearchable}
                      name="color"
                      options={hourData.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.noOfDay}
                    />
                    {/* <select
                      className="input-control"
                      name="noOfDay"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.noOfDay}
                    >
                      <option value="" defaultValue>
                        Select No. of hours
                      </option>
                      <>
                      <option value="1 hour">1 hour</option>
                        <option value="2 hour">2 hour</option>
                        <option value="3 hour">3 hour</option>
                        <option value="4 hour">4 hour</option>
                        <option value="5 hour">5 hour</option>
                        <option value="6 hour">6 hour</option>
                        <option value="7 hour">7 hour</option>
                        <option value="8 hour">8 hour</option>
                        <option value="9 hour">9 hour</option>
                        <option value="10 hour">10 hour</option>
                        <option value="12 hour">12 hour</option>
                      </>
                    </select> */}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-group aling-right">
            <button
              type="button"
              className="btn btn-outline-primary big-btn-padd"
              onClick={onClose}
            >
              Cancel
            </button>
            {!disable && type === "update" && (
              <button
                type="submit"
                className="btn btn-primary-big big-btn-padd"
              >
                {" "}
                Update Ticket{" "}
              </button>
            )}
            {!disable && type === "add" && (
              <button
                type="submit"
                className="btn btn-primary-big big-btn-padd"
              >
                {" "}
                Create Ticket{" "}
              </button>
            )}
          </div>
        </div>
      </form>
      <Success
        isOpen={success}
        onClose={() => setSuccess(false)}
        message={
          type === "update" ? "Updated successfully!" : "Added Successfully"
        }
        descMessage={`Your informations has been ${
          type === "add" ? "added" : "updated"
        } successfully!`}
        closePreviousModal={onClose}
      />
    </>
  );
};
export default AddUserForm;
