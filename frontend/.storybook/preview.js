/** @type { import('@storybook/react').Preview } */
import '../src/index.css'; 
import '../src/components/ManageUsers/ManageUsers.css';
import '../src/components/ConfirmationModal/ConfirmationModal.css';
import '../src/components/CardEditForm/CardEditForm.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
