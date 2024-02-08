import React, { useEffect, useState } from "react";
import Confirm from "../../components/commonUI/Confirm";
import Pagination from "../../components/commonUI/Pagination";
import AddTicket from "./AddTicket";
// import "../../styles/Patient.css";
import { useDispatch, useSelector } from "react-redux";
import { getRolesAction } from "../../redux/slice/forForms/getRolesSlice";
import { useFormik } from "formik";
import { convertToCSV, isPermitted, showError } from "../../utils/utils";
import { ticketSearchSchema } from "../../utils/schema";
import { useLocation } from "react-router-dom";
import { searchCSVTicketsAction } from "../../redux/slice/tickets/searchCSVTicketsSlice";
import { searchTicketsAction } from "../../redux/slice/tickets/searchTicketsSlice";
import { getAllTicketsAction } from "../../redux/slice/tickets/getAllTicketsSlice";
import { getAllManagersAction } from "../../redux/slice/forForms/getAllManagersSlice";
import { getAllTeamsAction } from "../../redux/slice/forForms/getAllTeamsFormSlice";
import { getAllTLAction } from "../../redux/slice/forForms/getAllTLSlice";
import { getTicketByIdAction } from "../../redux/slice/tickets/getTicketByIdSlice";
import AnswerModal from "./AnswerModal";

const style = {
  control: (provided) => ({
    ...provided,
    height: "44px",
  }),
};

// Ticket component
// Ticket component
// Ticket component
const Tickets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [answerTicket, setAnswerTicket] = useState(false);
  const [viewUser, setViewUser] = useState(false);
  const [forCSV, setForCSV] = useState(false);
  const [updateTicket, setUpdateTicket] = useState(false);

  const [ticketList, setTicktesList] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);
  const dispatch = useDispatch();
  const tickets = useSelector((s) => s.tickets);
  const addTicket = useSelector((s) => s.addTicket);
  const ticketStatus = useSelector((s) => s.ticketStatus);
  const searchTicket = useSelector((s) => s.searchTicket);
  const updateUser = useSelector((s) => s.updateTicket);
  const searchCSVTickets = useSelector((s) => s.searchCSVTicket);
  const allTeams = useSelector((state) => state.allTeams);
  const allManagers = useSelector((state) => state.allManagers);
  const menu = useSelector((state) => state.menu);
  const answerTicketAPi = useSelector((state) => state.answerTicket);

  const url = useLocation().pathname.replace("/", "");

  const permitted = menu.modules.find((m) => m.slug === url);

  useEffect(() => {
    dispatch(getRolesAction());
  }, []);

  useEffect(() => {
    dispatch(getAllTeamsAction());
  }, []);

  useEffect(() => {
    if (
      values.ticketNo ||
      values.searchValue ||
      values.teamId ||
      values.searchStatus ||
      values.startDate ||
      values.endDate ||
      values.analysisType
    ) {
      dispatch(searchTicketsAction({ ...values, pageNumber }));
      return;
    } else {
      setTimeout(() => {
        dispatch(getAllTicketsAction(pageNumber));
      }, 300);
    }
  }, [
    pageNumber,
    addTicket.success,
    ticketStatus.success,
    updateUser.success,
    answerTicketAPi.success,
  ]);

  const initialValues = {
    ticketNo: "",
    searchValue: "",
    teamId: "",
    searchStatus: "",
    startDate: "",
    endDate: "",
    analysisType: "",
    // roleType: "",
    // teamId: { value: "", label: "" },
    // managerId: { value: "", label: "" },
    // teamLeadId: { value: "", label: "" },
  };

  useEffect(() => {
    if (searchCSVTickets.success && forCSV) {
      if (searchCSVTickets.users && searchCSVTickets.users.length > 0) {
        const csvContent = convertToCSV(searchCSVTickets.users);
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "ticket.csv";
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        // Handle case when there are no search results
        console.log("No search results to export to CSV");
      }
      setForCSV(false);
    }
  }, [searchCSVTickets.success]);

  useEffect(() => {
    setTicktesList(tickets.tickets);
  }, [tickets.success, tickets.tickets]);

  // setting searched User
  useEffect(() => {
    searchTicket.success && setTicktesList(searchTicket.tickets);
  }, [searchTicket.success]);

  const { handleChange, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      initialValues,
      validationSchema: ticketSearchSchema,
      onSubmit: (data) => {
        let searchData;

        if (
          !data.ticketNo &&
          !data.searchValue &&
          !data.teamId &&
          !data.searchStatus &&
          !data.startDate &&
          !data.endDate &&
          !data.analysisType
        ) {
          searchData = initialValues;
        } else {
          searchData = data;
        }
        if (forCSV) {
          dispatch(searchCSVTicketsAction({ ...data, pageNumber }));
          setForCSV(false);
        } else {
          dispatch(searchTicketsAction({ ...data, pageNumber: pageNumber }));
        }
      },
    });

  const status = ["Pending", "Open", "Close"];
  // seriel Number for pagination
  const startSerialNumber = pageNumber * 10 + 1;
  return (
    <>
      <div className="doctor-wrapper">
        <div className="container container-padd">
          <div className="mid-head mar-20">
            <h2>Ticket Listing </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row mar-20">
              <div className=" col-lg-9">
                <div className="row">
                  <div className=" col-lg-3 col-width  col-6">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="form-group ">
                        <input
                          type="text"
                          class="input-control"
                          name="ticketNo"
                          placeholder="Ticket Number"
                          onChange={handleChange}
                          value={values.ticketNo}
                        />
                        {/* {showError(errors.ticketNo, touched.ticketNo)} */}
                      </div>
                    )}
                  </div>

                  <div className=" col-lg-3 col-width col-6 ">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="form-group ">
                        <input
                          type="text"
                          class="input-control"
                          name="searchValue"
                          placeholder="Question"
                          onChange={handleChange}
                          value={values.searchValue}
                        />
                        {showError(errors.searchValue, touched.searchValue)}
                      </div>
                    )}
                  </div>
                  <div className=" col-lg-2 col-6 ">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="form-group ">
                        <select
                          class="input-control"
                          onChange={handleChange}
                          name="analysisType"
                          value={values.analysisType}
                        >
                          {" "}
                          <option value="" selected>
                            {" "}
                            Select AnalysisType
                          </option>
                          <option value="1">Resolution</option>
                          <option value="2">Purpose</option>
                          {/* <option value="0">Pending</option> */}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className=" col-lg-2 col-6 ">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="form-group ">
                        <select
                          class="input-control"
                          onChange={handleChange}
                          name="teamId"
                          value={values.teamId}
                        >
                          {" "}
                          <option value="" selected>
                            Select Team
                          </option>
                          {Array.isArray(allTeams.teams) &&
                          allTeams.teams.length > 0 ? (
                            allTeams.teams?.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.teamName}
                              </option>
                            ))
                          ) : (
                            <option value="">No Teams Available</option>
                          )}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className=" col-lg-2 col-6 ">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="form-group ">
                        <select
                          class="input-control"
                          onChange={handleChange}
                          name="searchStatus"
                          value={values.searchStatus}
                        >
                          {" "}
                          <option value="" selected>
                            {" "}
                            Select Status
                          </option>
                          <option value="2">Close</option>
                          <option value="1">Open</option>
                          <option value="0">Pending</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className=" col-lg-3 col-Padd">
                    {isPermitted(permitted?.isSearch) && (
                      <div class="ticketDate">
                        <input
                          className="input-control"
                          type="date"
                          onChange={handleChange}
                          name="startDate"
                          id="startDate"
                          value={values.startDate}
                        />
                        <span>To</span>
                        <input
                          className="input-control"
                          type="date"
                          onChange={handleChange}
                          name="endDate"
                          id="endDate"
                          value={values.endDate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" col-lg-3 ">
                <div className="row">
                  {isPermitted(permitted?.isSearch) && (
                    <div className=" col-lg-4 col-10 bflex">
                      <button className=" btn-md btn-md-blue" type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                      <button
                        className=" btn-md btn-md-blue"
                        type="button"
                        onClick={() => {
                          dispatch(getAllTicketsAction(pageNumber));
                          resetForm();
                          setPageNumber(0);
                        }}
                      >
                        <i className="fa-solid fa-rotate-right"></i>
                      </button>
                    </div>
                  )}

                  <div className=" col-lg-8 ">
                    <div className="row">
                      <div className=" col-lg-12 right-aling">
                        {isPermitted(permitted?.isCsv) && (
                          <button
                            class=" btn-small greenbg download-btn"
                            onClick={() => {
                              setForCSV(true);
                              dispatch(searchCSVTicketsAction(values));
                            }}
                            type="button"
                          >
                            <img
                              src="/icons-images/download-img.png"
                              alt="icon"
                            />
                          </button>
                        )}
                        {isPermitted(permitted?.isAdd) && (
                          <button
                            to="/doctors/add-doctor"
                            className=" btn-md btn-md-blue add-Btn"
                            type="button"
                            onClick={() => setIsOpen(true)}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/icons-images/plus.svg`}
                              alt="icon"
                            />
                            Add Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="mid-table">
            <table
              className="table MobileTable"
              cellSpacing="2"
              cellPadding="0"
              border="0"
            >
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Ticket No. </th>
                  <th scope="col">Question</th>
                  <th scope="col">Analysis Type</th>
                  <th scope="col">Analysis Value</th>
                  <th scope="col">No. of Time & Date</th>
                  <th scope="col">Team </th>
                  <th scope="col">Manager </th>
                  <th scope="col">Team Leader </th>
                  <th scope="col">Agent</th>
                  <th scope="col">Start Date</th>
                  {isPermitted(permitted?.isStatus) && (
                    <th scope="col">Status</th>
                  )}
                  {(permitted?.isUpdate === "1" ||
                    permitted?.isRead === "1") && <th scope="col"> Action</th>}
                </tr>
              </thead>
              <tbody>
                {ticketList?.dataItems?.length === 0 ? (
                  <tr>
                    <td colSpan={"9"} align="center">
                      <h2 className="mt-5 mb-5"> No Tickets Found!</h2>
                    </td>
                  </tr>
                ) : (
                  ticketList?.dataItems?.map((user, index) => {
                    const serialNumber = (startSerialNumber + index)
                      .toString()
                      .padStart(2, "0");

                    return (
                      <tr key={index}>
                        <td data-label="S.No">{serialNumber}</td>
                        <td data-label="Ticket No.">
                          {user.ticketNo
                            ? user.ticketNo.replace(/#/g, "")
                            : "NA"}
                        </td>
                        <td
                          data-label="Question"
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.taskQuestion || "NA"}
                        </td>
                        <td
                          data-label="Analysis Type"
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.analysisType}
                        </td>
                        <td
                          data-label="Analysis Type"
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user.analysisValue}
                        </td>
                        <td
                          data-label="date&time"
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user?.noOfDay}
                        </td>
                        <td data-label="Team Leader">
                          {user?.teamName || "NA"}
                        </td>
                        <td data-label="Manager">{user.managerName || "NA"}</td>
                        <td data-label="Team ">{user.tlName || "NA"}</td>
                        <td data-label="Agent">{user?.agentName || "NA"}</td>
                        <td data-label="Start Date ">
                          {user.createdAt || "NA"}
                        </td>
                        {isPermitted(permitted?.isStatus) && (
                          <td
                            data-label="Status"
                            className={`tdGape 
                          ${
                            user.status == "0"
                              ? "status-open"
                              : user.status === "1"
                              ? "status-close"
                              : "status-pending"
                          }`}
                          >
                            {status[Number(user.status)]}
                          </td>
                        )}
                        {(isPermitted(permitted?.isUpdate) ||
                          isPermitted(permitted?.isRead)) && (
                          <td data-label="Action">
                            {isPermitted(permitted?.isUpdate) &&
                              user.status != "2" && (
                                <button
                                  className=" btn-small greenbg"
                                  type="button"
                                  onClick={() => {
                                    setAnswerTicket(true);
                                    dispatch(
                                      getTicketByIdAction(user.ticketNo)
                                    );
                                  }}
                                >
                                  <img
                                    src={`${process.env.PUBLIC_URL}/icons-images/question-icon.png`}
                                    alt="icon"
                                  />
                                </button>
                              )}
                            {isPermitted(permitted?.isUpdate) &&
                              user.status != "2" && (
                                <button
                                  className=" btn-small bluebg"
                                  type="button"
                                  onClick={() => {
                                    setUpdateTicket(true);
                                    dispatch(
                                      getTicketByIdAction(user.ticketNo)
                                    );
                                  }}
                                >
                                  <img
                                    src={`${process.env.PUBLIC_URL}/icons-images/ticket-icon.png`}
                                    alt="icon"
                                  />
                                </button>
                              )}
                            {isPermitted(permitted?.isRead) && (
                              <button
                                className=" btn-small yellowbg"
                                onClick={() => {
                                  setViewUser(true);
                                  dispatch(getTicketByIdAction(user.ticketNo));
                                }}
                              >
                                <img
                                  src={`${process.env.PUBLIC_URL}/icons-images/view-icon.png`}
                                  alt="icon"
                                  className="eye-icon"
                                />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {ticketList?.dataItems?.length > 0 && (
            <Pagination
              totalPages={ticketList?.totalPages}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItems={ticketList?.totalItems}
              items={ticketList?.dataItems?.length}
            />
          )}
        </div>
      </div>
      {/* <Outlet /> */}
      <AddTicket
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        setIsOpen={setIsOpen}
        title="Add Ticket"
        type="add"
      />

      <AddTicket
        isOpen={updateTicket !== false}
        onClose={() => setUpdateTicket(false)}
        setIsOpen={setUpdateTicket}
        title="Assign Ticket"
        type="update"
        ticketId={updateTicket} 
        
      />

      <AnswerModal
        isOpen={answerTicket}
        onClose={() => setAnswerTicket(false)}
        title="Answers"
        setIsOpen={setAnswerTicket}
        disabled={false}
        type="reply"
      />

      <AnswerModal
        isOpen={viewUser}
        onClose={() => setViewUser(false)}
        title="Answers"
        setIsOpen={setViewUser}
        disabled={true}
        type="view"
      />
    </>
  );
};

export default Tickets;
