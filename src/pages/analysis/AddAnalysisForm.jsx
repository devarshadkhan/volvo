import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { showError } from "../../utils/utils";
import { createAnalysisData } from "../../redux/slice/analysis/createAnalysis";
import { useDispatch, useSelector } from "react-redux";
import { getAnalysisType } from "../../redux/slice/analysis/analysisType";
import { editUpdateAnalysis } from "../../redux/slice/analysis/updateAnalysis";
import { getAnalysisByIdAction } from "../../redux/slice/analysis/getAnalysisByIdSlice";
const validationSchema = yup.object({
  name: yup.string("Enter your AnalyticsName").required("Analytics name is required"),
  analysisType: yup.string("Select Analytics Type").required("Analytics Type is required"),
  status: yup.string("Select Status").required("Status is required"),
});

const AddAnalysisForm = ({ onClose, disable, type, analysisId, onAdd , initialData }) => {
  const initialValues = {
    name: "",
      analysisType: "",
      status: "",
  };

  const [userValues, setUserValues] = useState(initialValues);
 





  const dispatch = useDispatch();
  const fetchData = useSelector((state) => state.analysisType.analysisData);

  const formik = useFormik({
    initialValues: initialValues || initialData ,
    validationSchema: validationSchema,
    // onSubmit: (values,{resetForm}) => {
    //   const newValue = {
    //     name: values.name,
    //     analysisType: values.analysisType,
    //     status: values.status,
    //   };

    //   if (type === "add") {
    //     dispatch(createAnalysisData(values));
    //   } else if (type === "update") {
    //     dispatch(editUpdateAnalysis({ id: analysisId, data: newValue }));
    //   } else if (type === "profile") {
    //     dispatch(getAnalysisByIdAction(values));
    //   }
    // },
    onSubmit: async (values, { resetForm }) => {
      const newValue = {
        name: values.name,
        analysisType: values.analysisType,
        status: values.status,
      };
    
      if (type === "add") {
        // Assuming createAnalysisData is an asynchronous operation
        await dispatch(createAnalysisData(values));
        // await onAdd(values);
        resetForm();
        // window.location.reload();
      } else if (type === "update") {
        // Assuming editUpdateAnalysis is an asynchronous operation
        await dispatch(editUpdateAnalysis({ id: analysisId, data: newValue }));
      } 
    
    },
  }  
  );

  useEffect(() => {
    if (type === "view" && initialData) {
      console.log("initialData initialData initialData  form",initialData);
      formik.setValues({
        name: initialData.name,
        analysisType: initialData.analysisType,
        status: initialData.status,
      });
    }
  }, [type, initialData]);

  // useEffect(() => {
  //   dispatch(getAnalysisType());
  // }, []);


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="scroll">
          <div className="mar-30">
            <div className="Add-form-group">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>
                    Analytics name<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Analytics name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {showError(formik.errors.name, formik.touched.name)}
                </div>

                <div className="col-md-6 mb-2">
                  <label>
                    Analytics Type<span>*</span>
                  </label>
                  <select
                    className="input-control"
                    name="analysisType"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.analysisType}
                  >
                    <option value="" defaultValue>
                      Select Analytics Type
                    </option>
                    <option value="1" >
                     Resolution
                    </option>
                    <option value="2" >
                   Purpose
                    </option>
                    {/* {fetchData?.data?.map((ele) => (
                      <option value={ele.id} key={ele.id}>
                        {ele.name}
                      </option>
                    ))} */}
                  </select>
                  {showError(formik.errors.analysisType, formik.touched.analysisType)}
                </div>

                <div className="col-md-6 mb-2">
                  <label>
                    Status<span>*</span>
                  </label>
                  <select
                    className="input-control"
                    name="status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
                  >
                    <option value="" selected>
                      Select Status
                    </option>
                    <option value="0">Pending</option>
                    <option value="1">Active</option>
                  </select>
                  {showError(formik.errors.status, formik.touched.status)}
                </div>
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
    </>
  );
};

export default AddAnalysisForm;
