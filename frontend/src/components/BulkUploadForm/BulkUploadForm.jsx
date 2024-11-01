import React, { useState } from "react";
import instance from "../../utils/axios";
import "./BulkUploadForm.css";
import { useAuth } from "../../context/AuthContext";
import getConfig from "../../utils/getConfig";
import { IoMdClose } from "react-icons/io";

const BulkUploadForm = ({ handleSetOpenBulk, handleAddCard }) => {
  const [type, setType] = useState("mission");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState();

  const { token } = useAuth();

  // Code for uploading a JSON file to the backend
  // Src: https://www.youtube.com/watch?v=-7w2KtfiMEM&ab_channel=CodeWithYousaf

  const apiEndpoint =
    type === "mission"
      ? "http://localhost:5353/api/bulk/add-mission"
      : "http://localhost:5353/api/bulk/add-assessment";

  const UploadFile = (e) => {
    // Prevent the default form submission to avoid page refresh
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    instance
      .post(apiEndpoint, formData, getConfig(token))
      .then((res) => {
        // add the new card to the list of cards
        handleAddCard(res.data);
        setSuccess("File uploaded successfully");
        setError("");
      })
      .catch((error) => {
        console.error(error);
        setError("Error uploading file");
      });
  };
  return (
    <>
      <div className="modal">
        <div className="bulk-up-container">
          <div className="close_card versionTwo bulkUpload">
            <div className="iconPlusText" onClick={handleSetOpenBulk}>
              <IoMdClose size={30} /> <span>Close</span>
            </div>
          </div>

          <h2>Bulk Upload</h2>

          <div className="default-icons-link template">
            <a
              href="../../templates/assessment-template.json"
              download={"assessment-template.json"}
              
            >
              Download assessment JSON template
            </a>
          </div>

          <br />
          <div className="default-icons-link template">
            <a
              href="../../templates/mission-template.json"
              download={"mission-template.json"}
            >
              Download mission JSON template
            </a>
          </div>

          <form>
            <fieldset>
              <legend>Select a card type:</legend>
              <div>
                <input
                  type="radio"
                  id="mission"
                  name="card_type"
                  value="mission"
                  checked={type === "mission"}
                  onChange={() => setType("mission")}
                />
                <label htmlFor="mission">Mission</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="assessment"
                  name="card_type"
                  value="assessment"
                  checked={type === "assessment"}
                  onChange={() => setType("assessment")}
                />
                <label htmlFor="assessment">Assessment</label>
              </div>
            </fieldset>
            <div className="form-group">
              <label>Upload JSON File</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <button type="submit" onClick={UploadFile}>
              Submit
            </button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default BulkUploadForm;
