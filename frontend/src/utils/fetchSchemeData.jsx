import instance from "./axios";

const fetchData = async (URL, setData, setCount, config) => {
    try {
      let response;
      // Check if the config argument is given
      if (!config) {
        // Fetch schemes from the database without config
        response = await instance.get(URL);
      } else {
        // Fetch schemes from the database with config
        response = await instance.get(URL, config);
      }

      // Update state
      setData(response.data);
      if (typeof setCount === 'function') {
        setCount(response.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
};

export default fetchData;