import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Success from "../../../components/commonUI/Success";
import Select from "react-select"

const AddUserForm = ({ onClose, disable, type }) => {
  

  return (
    <>
      <form >
        <div className="scroll">
          <div className="ModalAvtar">
            <img
              src={"/icons-images/avtar.svg"}
            //   onClick={handleButtonClick}
              alt="icon"
            />
          </div>
          <p className="w-100 text-center">
          </p>
          {/* <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={disable} */}
          {/* /> */}
          <div className="mar-30 ">
            {/* fname lname */}
            <div className="Add-form-group">
              <div className="row">
                <div className=" col-md-6 mb-2 ">
                  <label>
                    First name<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="First name"
                    name="fname"
                  />
                </div>

                <div className=" col-md-6 mb-2 ">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Last name"
                    name="lname"
                  />
                </div>

                <div className=" col-md-6 mb-2 ">
                  <label>
                    Email<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Email"
                    name="email"
                  />
                </div>

                {/* role */}
                <div className=" col-md-6 mb-2 ">
                  <label>
                    Role<span>*</span>
                  </label>
                  <select
                    className="input-control"
                    name="roleType"
                  >
                    <option value="" selected>
                      Select Role
                    </option>

                 
                  </select>{" "}
                </div>

                {/* Team */}
               
                  <div className=" col-md-6 ">
                    <label>
                      Team<span>*</span>{" "}
                    </label>
                    <Select
                      name="teamId"
                      
                   
                    />
                  </div>
                

                <div className=" col-md-6 mb-2 ">
                  <label>
                    Gender<span>*</span>
                  </label>
                  <select
                    className="input-control"
                    name="gender"
                  >
                    <option value="" selected>
                      Select Gender
                    </option>

                    <option value="0">Male</option>
                    <option value="1">Female</option>
                    <option value="2">Other</option>
                  </select>
               
                </div>

                <div className=" col-md-6 mb-2 ">
                  <label>
                    Phone number<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Phone number"
                    name="phoneNumber"
                  />{" "}
                
                </div>

                <div className=" col-md-6 mb-2 ">
                  <label>Date of birth</label>
                  <input
                    type="date"
                    className="input-control"
                    placeholder="Date of Birth"
                    name="dateOfBirth"
                  />
              
                </div>

                {/* password Pincode */}
                {type === "add" && (
                  <>
                    <div className="col-md-6 mb-2 ">
                      <label>
                        Password<span>*</span>
                      </label>
                      <input
                        type="password"
                        className="input-control"
                        placeholder="Password"
                        name="password"
                      />{" "}
                
                    </div>
                    <div className=" col-md-6 mb-2 ">
                      <label>
                        Confirm password<span>*</span>
                      </label>
                      <input
                        type="password"
                        className="input-control"
                        placeholder="Confirm password"
                        name="confirmPassword"
                      />{" "}
                    
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* submit */}
            <div className="form-group aling-right">
              <button
                type="button"
                className="btn btn-outline-primary big-btn-padd"
                onClick={onClose}
              >
                Cancel
              </button>
              {!disable && (
                <button
                  type="submit"
                  className="btn btn-primary-big big-btn-padd"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      <Success
        // isOpen={success}
        // onClose={() => setSuccess(false)}
        message={
          type === "profile"
            ? "Profile updated successfully!"
            : type === "add"
            ? "Added Successfully"
            : "Updated Successfully"
        }
        descMessage={`Your information has been ${
          type === "add" ? " added " : " updated "
        } successfully!`}
        closePreviousModal={onClose}
      />
    </>
  );
};
export default AddUserForm;
