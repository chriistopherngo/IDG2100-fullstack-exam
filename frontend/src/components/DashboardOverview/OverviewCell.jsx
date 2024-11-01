import React, { useState, useEffect } from "react";
import instance from "../../utils/axios";
import { useAuth } from "../../context/AuthContext"
import getConfig from "../../utils/getConfig";

const OverviewCell = ({ name, url, onCount,className }) => {
  // store the count
  const [count, setCount] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await instance.get(url, getConfig(token));
        setCount(response.data.length);
        // If onCount is a function, call it with the count
        if (typeof onCount === "function") {
          onCount(response.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [url, onCount]);

  return (
    <div className={`overviewCell ${className}`}>
      <span>{name}:</span> {count}
    </div>
  );
};

export default OverviewCell;
