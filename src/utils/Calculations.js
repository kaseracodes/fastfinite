export const calculateRent = (pickupDate, dropoffDate, packageRates, type) => {
    let hours = dropoffDate.diff(pickupDate, "hour");
    let totalRent = 0;

    if (type === "premiumBike2") {
        let months = Math.floor(hours / 720);
        hours %= 720;
        let weeks = Math.floor(hours / 168);
        hours %= 168;
        let days = Math.floor(hours / 24);
        hours %= 24;
        totalRent += months * packageRates.monthly.price + weeks * packageRates.weekly.price + days * packageRates.daily.price + hours * packageRates.hourly.price;
    } else {
        let days = Math.ceil(hours / 24);
        let months = Math.floor(days / 30);
        days %= 30;
        let weeks = Math.floor(days / 7);
        days %= 7;
        totalRent += months * packageRates.monthly.price + weeks * packageRates.weekly.price + days * packageRates.daily.price;
    }

    return totalRent;
};

export const calculateGST = (pickupDate, dropoffDate, packageRates, type) => {
    const rent = calculateRent(pickupDate, dropoffDate, packageRates, type);
    const gst = rent * 0.18;
    return gst;
};
