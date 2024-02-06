import React, { useEffect, useState } from "react";
import Switch from "../../components/commonUI/Switch.js";
import Success from "../../components/commonUI/Success.js";
import AddUser from "../Users/AddUser.js";
import AddAnalysis from "./AddAnalysis.jsx";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAnalysisDataListing } from "../../redux/slice/analysis/getAllAnalysisSlice.js";
import {
  convertDateFormat,
} from "../../utils/utils.js";
import Pagination from "../../components/commonUI/Pagination.js";
import AnswerModal from "../ticketing/AnswerModal.jsx";
import Confirm from "../../components/commonUI/Confirm.js";
import { deleteAnalysisData } from "../../redux/slice/analysis/deleteAnalysis.js";
import { editUpdateAnalysis } from "../../redux/slice/analysis/updateAnalysis.js";
import { getAnalysisByIdAction } from "../../redux/slice/analysis/getAnalysisByIdSlice.js";
import { createAnalysisData } from "../../redux/slice/analysis/createAnalysis.js";
const Analysis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(false);
  const [viewModalData, setViewModalData] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [analysisList, setAnalysisList] = useState([]);
  // console.log("analysisList",analysisList);
  const dispatch = useDispatch();
  const fetchAnalysisData = useSelector(
    (state) => state.getAnalysis.analysisData
  );

  // console.log(fetchAnalysisData.analysisData);
  const startSerialNumber = pageNumber * 20 + 1;

  // useEffect(() => {
  //   setAnalysisList(fetchAnalysisData.analysisData);
  // }, [fetchAnalysisData.analysisData]);
  useEffect(() => {
    dispatch(getAnalysisDataListing(pageNumber));
  }, [pageNumber]);


  const userById = useSelector((state) => state.getAnalysisById);
  console.log("userByIduserById",userById);
 
  // useEffect(() => {
  //   dispatch(getAnalysisByIdAction(userById.id));
  // }, [userById.id, dispatch]);
  const TableDataListing = () => {
    return (
      <>
        {fetchAnalysisData.analysisData?.map((item, i) => {
          const serialNumber = (startSerialNumber + i)
            .toString()
            .padStart(2, "0");
          return (
            <>
              <tr key={i}>
                <td data-label="S.No">{serialNumber}</td>
                <td data-label="Name">{item.name}</td>
                <td data-label="Analytics Type">{item.analysisType} </td>
                <td data-label="Status">
                  <Switch
                    // handleChange={handleChange}
                    switchValue={item.status}
                    switchId={item.id}
                  />
                </td>
                <td data-label="Created Date">
                  {convertDateFormat(item.createdAt)}
                </td>

                <td >
                  <button
                    className=" btn-small greenbg"
                    type="button"
                    onClick={() => {
                      setEditModalData(item.id);
                      dispatch(getAnalysisByIdAction(item.id))
                      // dispatch(getAnalysisByIdAction(item.id))
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/icons-images/edit-small.svg`}
                      alt="icon"
                    />
                  </button>

                  <button
                    className=" btn-small yellowbg"
                    onClick={() => {
                      setViewModalData(true)
                      dispatch(getAnalysisByIdAction(item.id))
                      // getAnalysisByIdAction(item.id)
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/icons-images/view-small.svg`}
                      alt="icon"
                    />
                  </button>
                  <button
                    className=" btn-small redbg"
                    type="submit"
                    onClick={() => {
                      setShowConfirm(true);
                      setDeleteUserId(item.id);
                      // handleDel(item.id);
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/icons-images/delete-small.svg`}
                      alt="icon"
                    />
                  </button>
                </td>
              </tr>
            </>
          );
        })}
      </>
    );
  };

  // const handleAddAnalysis = async (values) => {
  //   // Dispatch action to add analysis data
  //   await dispatch(createAnalysisData(values));

  //   // Manually update the state with the new data
  //   setAnalysisList((prevAnalysisList) => [
  //     ...prevAnalysisList,
  //     fetchAnalysisData.analysisData, // Assuming `analysisData` is an array
  //   ]);

  //   // Close the modal
  //   setIsOpen(false);

    
  // };

  return (
    <>
      <div className="doctor-wrapper">
        <div className="container container-padd">
          <div className="mid-head mar-20">
            <h2>Users</h2>
          </div>

          {/* <form onSubmit={handleSubmit}> */}
          <form>
            <div className="row mar-20">
              <div className=" col-lg-3 ">
                <div className="form-group ">
                  <input
                    type="text"
                    className="input-control"
                    name="searchValue"
                    placeholder="Search by Name/Email/Mobile Number"
                  />
                </div>
              </div>

              {/* <div className=" col-lg-3 ">
                <div className="form-group ">
                  <select className="input-control" name="userType">
                    {" "}
                    <option value="" selected>
                      Select Role
                    </option>
                    <option value="user">User</option>
                    <option value="associate">Associate</option>
                    <option value="team Lead">Team Lead</option>
                    <option value="QA">QA</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div> */}
              <div className=" col-lg-2">
                <div className="form-group ">
                  <select className="input-control" name="status">
                    {" "}
                    <option value="" selected>
                      Analysis Type
                    </option>
                    <option value="0">Resolution</option>
                    <option value="1">Purpose</option>
                  </select>
                </div>
              </div>

              <div className=" col-lg-2">
                <div className="form-group ">
                  <select className="input-control" name="status">
                    {" "}
                    <option value="" selected>
                      Select Status
                    </option>
                    <option value="0">Inactive</option>
                    <option value="1">Active</option>
                  </select>
                </div>
              </div>

              <div className=" col-lg-2 col-5">
                <div className="form-group ">
                  <button className=" btn-md btn-md-blue" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <button className=" btn-md btn-md-blue" type="button">
                    <i className="fa-solid fa-rotate-right"></i>
                  </button>
                </div>
              </div>
              <div className=" col-lg-2 col-7">
                <div className="aling-right bflex">
                  {/* <button className=" btn-md btn-md-blue" type="button">
                    <i
                      class="fa-solid fa-file-csv"
                      style={{ fontSize: "21px" }}
                    ></i>
                  </button> */}

                  <button
                    to="/doctors/add-doctor"
                    className=" btn-md btn-md-blue"
                    type="button"
                    onClick={() => setIsOpen(true)}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/icons-images/plus.svg`}
                      alt="icon"
                    />
                    Add Analytics
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="mid-table ">
            <table
              className="table MobileTable"
              cellSpacing="2"
              cellPadding="0"
              border="0"
            >
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Analytics Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <TableDataListing />
              </tbody>
            </table>
          </div>
          <div className="pagination-col">
            {/* <div className="lefttext">
              <p>Showing Result {fetchData.totalItems} found</p>
            </div> */}
            <div className="lefttext">
              {/* <button class=" btn-small bluebg" type="button">
                <i class="fa-solid fa-chevron-down"></i>
              </button> */}
              <Pagination
                totalPages={fetchAnalysisData?.totalPages}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalItems={fetchAnalysisData?.totalItems}
                items={fetchAnalysisData?.totalItems}
              />
            </div>
          </div>
        </div>
      </div>

      {/* form Modal Open for Added, Edited, and Delete full CRUD operation */}
        <AddAnalysis
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          setIsOpen={setIsOpen}
          title="Add User"
          type="add"
          // onAdd={handleAddAnalysis}
          // analysisId={editModalDatxa}
        />
      <AddAnalysis
        isOpen={editModalData !== false}
        onClose={() => setEditModalData(false)}
        setIsOpen={setEditModalData}
        title="Edit Data"
        type="update"
        analysisId={editModalData} // Pass the ID here
      />
      <AddAnalysis
        isOpen={viewModalData}
        onClose={() => setViewModalData(false)}
        setIsOpen={setViewModalData}
        title="View Details"
        type="view"
        disabled={true}
        initialData={userById.analysisData}
      />

      <Confirm
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        handleConfirm={() => {
          dispatch(deleteAnalysisData(deleteUserId));
        }}
      />
    </>
  );
};

export default Analysis;
