const extractDateInfo = (dateString) => {
  const [year, month, day] = dateString.split('-'); 
  const date = new Date(year, month - 1, day); 

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return { year, month, day, dayOfWeek };
};


const formatDate = (dateString) => {
  if (!dateString) return ''; 
  const [year, month, day] = dateString.split('-'); 
  return `${month}.${day}`; 
};



function createDateTimeFromLocalStorage(selectedTime) {
  const startTimeRaw = localStorage.getItem("startTime");
  // const startTimeRaw = '2024032812'

  if (!startTimeRaw || selectedTime.length !== 5) return null;

  const year = startTimeRaw.slice(0, 4);
  const month = startTimeRaw.slice(4, 6);
  const day = startTimeRaw.slice(6, 8);
  const [hour, minute] = selectedTime.split(":");

  return `${year}-${month}-${day} ${hour}:${minute}:00.000000`;
}



export {extractDateInfo, formatDate, createDateTimeFromLocalStorage};


