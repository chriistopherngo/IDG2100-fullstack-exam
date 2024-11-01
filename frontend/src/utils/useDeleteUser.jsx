import instance from './axios';

// utility function to delete a user
const useDeleteUser = (config) => {
  const deleteUser = async (id) => {
    try {
      await instance.delete(`api/user/${id}`, config);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return deleteUser;
};

export default useDeleteUser;