import "./ConfirmationModal.css";

const ConfirmationModal = ({
  // String that will be displayed as the message/question
  message,
  // String that will be displayed on the cancel button
  cancelMessage,
  // String that will be displayed on the confirm button
  confirmMessage,
  // Function that will be called when the cancel button is clicked
  onCancel,
  // Function that will be called when the confirm button is clicked
  onConfirm,
  // String that will be used as the color scheme of the modal
  colorScheme,
}) => {

  return (
    <div className="modal confirmation">
      <div
        className="confirmation_modal versionTwo"
        style={{ borderTop: `7px solid ${colorScheme}` }}
      >
        <p>{message}</p>
        <div className="confirmation_options_container">
          <button className="cancel" onClick={onCancel}>
            {cancelMessage}
          </button>
          <button
            className="delete"
            onClick={onConfirm}
            style={{
              backgroundColor: `${colorScheme}`,
              border: `1px solid ${colorScheme} `,
            }}
          >
            {confirmMessage}
          </button>
        </div>
      </div>
    </div>
  );
};



ConfirmationModal.defaultProps = {
  message: "Are you sure?",
  cancelMessage: "Cancel",
  confirmMessage: "Confirm",
  colorScheme: "red",
  onCancel: () => console.log("Cancel clicked"),
  onConfirm: () => console.log("Confirm clicked"),
};

export default ConfirmationModal;
