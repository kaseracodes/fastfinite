export const calculateRent = (pickupDate, dropoffDate, packageRates, type) => {
  const diffInHours = dropoffDate.diff(pickupDate, "hour");
  let totalRent = 0;

  const days = Math.ceil(diffInHours / 24);
  const floorDays = Math.floor(diffInHours / 24);
  const hours = diffInHours % 24;

  if (type === "premiumBike2") {
    if (floorDays < 7) {
      totalRent =
        packageRates.daily.price * floorDays +
        packageRates.hourly.price * hours;
    } else if (floorDays < 30) {
      const weeks = Math.floor(floorDays / 7);
      const remainingDays = floorDays % 7;
      totalRent =
        weeks * packageRates.weekly.price +
        remainingDays * packageRates.daily.price +
        packageRates.hourly.price * hours;
    } else {
      // One month or more
      const months = Math.floor(floorDays / 30);
      const daysAfterMonths = floorDays % 30;

      // Calculate rent for remaining days after full months
      const remainingWeeks = Math.floor(daysAfterMonths / 7);
      const remainingDays = daysAfterMonths % 7;

      totalRent =
        months * packageRates.monthly.price +
        remainingWeeks * packageRates.weekly.price +
        remainingDays * packageRates.daily.price +
        packageRates.hourly.price * hours;
    }
  } else {
    if (days < 7) {
      // Less than a week
      totalRent = Math.max(days, 1) * packageRates.daily.price;
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
  }

  return totalRent;
};

export const calculateGST = (pickupDate, dropoffDate, packageRates, type) => {
  const rent = calculateRent(pickupDate, dropoffDate, packageRates, type);
  const gst = rent * 0.18;
  return gst;
};
