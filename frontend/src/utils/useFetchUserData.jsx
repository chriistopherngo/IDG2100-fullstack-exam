import { useState, useEffect } from 'react';
import instance from './axios';

// utility function to fetch users in the database
const useFetchUserData = (config) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await instance.get("/api/user", config);
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [config]);

  return users;
};

export default useFetchUserData;
