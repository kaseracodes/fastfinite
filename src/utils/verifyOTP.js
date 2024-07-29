const verifyOTP = async (confirmationResult, otp) => {
  const res = await confirmationResult.confirm(otp);
  console.log(res.user);
  return res;
};

export default verifyOTP;
