import instance from './axios';

// utility function to edit a user
const useEditUser = (config) => {
  const editUser = async (id, updatedData) => {
    try {
      await instance.put(`api/user/${id}`, updatedData, config);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return editUser;
};

export default useEditUser;
