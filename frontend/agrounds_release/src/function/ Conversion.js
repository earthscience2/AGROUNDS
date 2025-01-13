const extractDateInfo = (dateString) => {
  const [year, month, day] = dateString.split('-'); 
  const date = new Date(year, month - 1, day); 

  const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return { year, month, day, dayOfWeek };
};


const formatDate = (dateString) => {
  if (!dateString) return ''; 
  const [year, month, day] = dateString.split('-'); 
  return `${month}.${day}`; 
};
export {extractDateInfo, formatDate};