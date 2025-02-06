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
export {extractDateInfo, formatDate};