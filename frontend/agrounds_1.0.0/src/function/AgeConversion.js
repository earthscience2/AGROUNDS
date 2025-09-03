const AgeConversion = (birthdate) => {
  if (!birthdate) return '';

  const today = new Date();
  const birthDate = new Date(birthdate);

  let age = today.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (isBeforeBirthdayThisYear) {
    age--;
  }

  return age;
};



export default AgeConversion;


