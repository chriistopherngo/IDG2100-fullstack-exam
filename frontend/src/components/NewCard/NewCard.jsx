import React, { useState, useEffect } from "react";
import instance from "../../utils/axios";
import "./NewCard.css";
import { useAuth } from "../../context/AuthContext";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getConfig from "../../utils/getConfig";

const NewCard = ({ onAddCard, onClose, getCardType, onNotify, cards }) => {
  const { token } = useAuth();
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState(
    `${getCardType === "mission" ? "http://localhost:5353/uploads/icon-mission.png" : ""}`
  );

  // Extract unique categories from cards
  let categories = [];
  cards.forEach((card) => {
    if (!categories.includes(card.card_category)) {
      categories.push(card.card_category);
    }
  });

  // define initial form data based on card type
  const assessmentInitialFormData = {
    card_id: "",
    card_type: getCardType,
    card_category: "",
    card_name: "",
    card_description: "",
    card_details: "",
    card_icon: "",
  };

  const missionInitialFormData = {
    card_id: "",
    card_type: getCardType,
    card_name: "",
    card_description: "",
    card_icon: "",
  };

  let initialFormData =
    getCardType === "mission"
      ? missionInitialFormData
      : assessmentInitialFormData;

  const [formData, setFormData] = useState(initialFormData);

  // auto-generate card_id based on the highest id in the database
  const generateNewCardId = async (getCardType) => {
    try {
      const response = await instance.get(`api/${getCardType}`);
      //  save each id in an array
      const cardIds = response.data.map((card) => card.card_id);
      // find the highest id
      const highestId = Math.max(...cardIds);
      // return the highest id + 1
      return highestId + 1;
    } catch (error) {
      console.error("Error fetching mission cards:", error);
    }
  };

  useEffect(() => {
    fetchCardId();
  }, [getCardType]);

  // fetch card id based on card type
  const fetchCardId = async () => {
    const cardId = await generateNewCardId(getCardType);
    setFormData((prevFormData) => ({
      ...prevFormData,
      card_id: cardId,
      card_type: getCardType,
    }));
  };

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // if the name is card_type, reset the form data
    if (name === "card_type") {
      setFormData({ ...initialFormData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    } 
    // if the name is card_category, set the image url based on the category
    if (name === "card_category") {
      switch (value) {
        case "assessment timing":
          setImageUrl(`http://localhost:5353/uploads/icon-timing.png`);
          break;
        case "assessment format":
          setImageUrl(`http://localhost:5353/uploads/icon-format.png`);
          break;
        case "assessment artefact":
          setImageUrl(`http://localhost:5353/uploads/icon-artefact.png`);
          break;
        case "context":
          setImageUrl(`http://localhost:5353/uploads/icon-context.png`);
          break;
        case "the assessor":
          setImageUrl(`http://localhost:5353/uploads/icon-assessor.png`);
          break;
        case "who is assessed":
          setImageUrl(`http://localhost:5353/uploads/icon-assessed.png`);
          break;
        default:
          setImageUrl("");
          break;
      }
    }
  
  };

  // clear form fields
  const clearFields = () => {
    setFormData(initialFormData);
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an instance of FormData
    const submitData = new FormData();

    // Append all relevant data fields to submitData
    submitData.append("card_id", formData.card_id);
    submitData.append("card_type", formData.card_type);
    submitData.append("card_name", formData.card_name);
    submitData.append("card_description", formData.card_description);
    if (file) {
      submitData.append("card_icon", file);
    } else {
      submitData.append("card_icon", "default");
    }

    // Only append these for 'assessment' type cards
    if (getCardType === "assessment") {
      submitData.append("card_category", formData.card_category);
      submitData.append("card_details", formData.card_details);
    }

    const endpoint =
      getCardType === "mission" ? "api/mission" : "api/assessment";

    instance
      .post(endpoint, submitData, getConfig(token))
      .then((res) => {
        // Update the card list with the new card
        onAddCard(res.data);
        onNotify("Card added successfully!");
        clearFields();
        onClose();
      })
      .catch((error) => {
        console.error("Error posting card:", error);
        toast.error("Error adding card");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
    // Update the image preview
    setImageUrl(newImageUrl);
    // add the file to formData
    setFile(file);
    setFormData({
      ...formData,
      card_icon: file,
    });
  };

  return (
    <>
      <div className="modal versionTwo">
        <div className="close_card versionTwo">
          <div className="iconPlusText" onClick={() => onClose()}>
            <IoMdClose size={30} /> <span>Close</span>
          </div>
        </div>
        <form className="edit_card versionTwo" onSubmit={handleSubmit}>
          <div className="edit-fields-container">
            <div className="edit-field icon">
              <div className="current_icon_container">
                <img
                  src={imageUrl}
                  alt="Current Icon"
                  className="current_icon"
                />
              </div>
              <input type="file" onChange={handleFileChange} />
            </div>

            <div className="edit-field name">
              <input
                style={{ border: "0.5px solid #000", padding: "5px" }}
                placeholder="Name"
                type="text"
                name="card_name"
                onChange={handleChange}
                value={formData.card_name}
                required
              />
            </div>
            <div className="edit-field description">
              <textarea
                style={{ border: "0.5px solid #000", padding: "5px" }}
                placeholder="Description"
                type="text"
                name="card_description"
                onChange={handleChange}
                value={formData.card_description}
                required
              />
            </div>
            {getCardType === "mission" && <div className="whitebox"></div>}

            {getCardType === "assessment" && (
              <>
                <div className="edit-field category">
                  <div className="select-container">
                    <select
                      name="card_category"
                      onChange={handleChange}
                      value={formData.card_category}
                      required
                      style = {{textTransform: "capitalize"}}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="edit-field details">
                  <textarea
                    style={{ border: "0.5px solid #000", padding: "5px" }}
                    placeholder="Details"
                    type="text"
                    name="card_details"
                    onChange={handleChange}
                    value={formData.card_details}
                    required
                  />
                </div>
              </>
            )}
          </div>

          <edit-super-assessment-card
            key={formData.card_category}
            card-id={formData.card_id}
            card-name={formData.card_name}
            card-category={formData.card_category}
            card-description={formData.card_description}
            card-details={formData.card_details}
          />
          <div className="operations_container">
            <button
              type="submit"
              className="button-26 nonScaled"
              onClick={handleSubmit}
            >
              Add card
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewCard;