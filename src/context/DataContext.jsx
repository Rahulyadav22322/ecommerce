import axios from "axios";
import { createContext, useContext, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  // fetching all products from API
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("https://fakestoreapi.com/products?limit=150");

      // fakestoreapi.com returns an array directly
      setData(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // Utility function to extract unique values safely
  const getUniqueCategory = (data, property) => {
    if (!Array.isArray(data)) return ["All"];

    let values = data
      .map(item => item?.[property])
      .filter(Boolean); // removes undefined, null, empty

    return ["All", ...new Set(values)];
  };

  const categoryOnlyData = data.length ? getUniqueCategory(data, "category") : ["All"];
  const brandOnlyData = data.length ? getUniqueCategory(data, "brand") : ["All"];

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        fetchAllProducts,
        categoryOnlyData,
        brandOnlyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const getData = () => useContext(DataContext);
