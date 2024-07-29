export const validatePhoneNo = (phone) => {
  const indianPhonePattern = /^[6-9]\d{9}$/;
  return indianPhonePattern.test(phone);
};

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};
