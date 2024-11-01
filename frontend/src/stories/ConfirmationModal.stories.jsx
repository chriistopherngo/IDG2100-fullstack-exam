import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";
import '../components/ConfirmationModal/ConfirmationModal.css';


export default {
  title: 'ConfirmationModal',
  component: ConfirmationModal,
};

const Template = (args) => <ConfirmationModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: 'Are you sure you want to proceed?',
  cancelMessage: 'Cancel',
  confirmMessage: 'Confirm',
  colorScheme: 'red',
};

export const WithBlueColorScheme = Template.bind({});
WithBlueColorScheme.args = {
  message: 'Are you sure you want to delete this item?',
  cancelMessage: 'No, keep it',
  confirmMessage: 'Yes, delete it',
  colorScheme: '#007BFF',
};

export const CustomActions = Template.bind({});
CustomActions.args = {
  message: 'Do you want to save changes?',
  cancelMessage: 'Discard',
  confirmMessage: 'Save',
  colorScheme: 'green',
  onCancel: () => alert('Action cancelled'),
  onConfirm: () => alert('Action confirmed'),
};
