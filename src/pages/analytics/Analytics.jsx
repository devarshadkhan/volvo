import React, { useState } from "react";
import Switch from "../../components/commonUI/Switch.js";
const Analytics = () => {
  const [notification,setNotifucations]= useState(true)

  const handleChange = ()=>{
    // if(notification === true){
      setNotifucations(false)
     alert("OFF")
    // }
  }
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

              <div className=" col-lg-3 ">
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
                  <button className=" btn-md btn-md-blue" type="button">
                    <i
                      class="fa-solid fa-file-csv"
                      style={{ fontSize: "21px" }}
                    ></i>
                  </button>

                  <button
                    to="/doctors/add-doctor"
                    className=" btn-md btn-md-blue"
                    type="button"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/icons-images/plus.svg`}
                      alt="icon"
                    />
                    Add User
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
                <tr>
                  <td data-label="S.No">S.No</td>
                  <td data-label="Name">Name</td>
                  <td data-label="Analytics Type">Analytics </td>
                  <td data-label="Status"><Switch handleChange={handleChange} switchValue={notification} /></td>
                  <td data-label="Created Date">1-12-12</td>
             
                  <td data-label="Action">
                    <button className=" btn-small greenbg" type="button">
                      <img
                        src={`${process.env.PUBLIC_URL}/icons-images/edit-small.svg`}
                        alt="icon"
                      />
                    </button>

                    <button className=" btn-small yellowbg">
                      <img
                        src={`${process.env.PUBLIC_URL}/icons-images/view-small.svg`}
                        alt="icon"
                      />
                    </button>
                    <button className=" btn-small redbg" type="submit">
                      <img
                        src={`${process.env.PUBLIC_URL}/icons-images/delete-small.svg`}
                        alt="icon"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
