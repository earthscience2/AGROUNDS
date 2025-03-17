import React, { createContext, useState, useContext } from 'react';

const FieldContext = createContext();

export const useFieldContext = () => useContext(FieldContext);

export const FieldProvider = ({ children }) => {
  const [fieldData, setFieldData] = useState({
    match_code : "",
    user_code : "",
    ground_code : "",
    standard : "",
    quarter_info : [
      {
        quarter_name : "",
        start_time : "",
        end_time: "",
        status: "",
        home: ""
      }
    ]
  });

  const updateFieldData = (newData) => {
    setFieldData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <FieldContext.Provider value={{ fieldData, updateFieldData }}>
      {children}
    </FieldContext.Provider>
  );
};
