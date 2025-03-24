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
        match_start_time: "",
        match_end_time: "",
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
