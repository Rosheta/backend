const {governmentsCodes} = require('./constants')
const { isLength, isNumeric } = require('validator')

const ssnValidator = function(v) {
  if (!isLength(v, { min: 14, max: 14 }) || !isNumeric(v)) {
    return false;
  }
  const birthdate = new Date(this.birthdate.value);
  const birthYear = birthdate.getFullYear();
  const birthMonth = (birthdate.getMonth() + 1).toString().padStart(2, '0');
  const birthDay = birthdate.getDate().toString().padStart(2, '0');
  let ssnPrefix;

  if (birthYear >= 1900 && birthYear < 2000) {
    ssnPrefix = '2' + birthYear.toString().slice(2) + birthMonth + birthDay;
  } else if (birthYear >= 2000 && birthYear < 2100) {
    ssnPrefix = '3' + birthYear.toString().slice(2) + birthMonth + birthDay;
  } else {
    return false; // Invalid birth year for this validation logic
  }

  const code = v.slice(7, 9);
  console.log(code, ssnPrefix)
  return v.startsWith(ssnPrefix) && governmentsCodes.has(code);
};

module.exports = ssnValidator;
