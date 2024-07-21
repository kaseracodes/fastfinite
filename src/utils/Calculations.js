export const calculateRent = (pickupDate, dropoffDate, packageRates) => {
  const diffInHours = dropoffDate.diff(pickupDate, "hour");
  const days = Math.ceil(diffInHours / 24);

  let totalRent = 0;

  if (days < 7) {
    // Less than a week
    totalRent = days * packageRates.daily.price;
  } else if (days < 30) {
    // Less than a month
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    totalRent =
      weeks * packageRates.weekly.price +
      remainingDays * packageRates.daily.price;
  } else {
    // One month or more
    const months = Math.floor(days / 30);
    const daysAfterMonths = days % 30;

    // Calculate rent for remaining days after full months
    const remainingWeeks = Math.floor(daysAfterMonths / 7);
    const remainingDays = daysAfterMonths % 7;

    totalRent =
      months * packageRates.monthly.price +
      remainingWeeks * packageRates.weekly.price +
      remainingDays * packageRates.daily.price;
  }

  return totalRent;
};
