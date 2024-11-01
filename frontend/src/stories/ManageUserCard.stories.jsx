import ManageUserCard from '../components/ManageUsers/ManageUserCard';

export default {
  title: 'Components/ManageUserCard',
  component: ManageUserCard,
};

const Template = (args) => <ManageUserCard {...args} />;

const sampleUser = {
  _id: '1',
  fName: 'Ola',
  lName: 'Skjeret',
  email: 'olansk@ntnu.no',
  university: 'NTNU',
  department: 'Design',
  role: 'User',
  position: 'Student',
};


export const Default = Template.bind({});
Default.args = {
  selectedUser: sampleUser,
};



