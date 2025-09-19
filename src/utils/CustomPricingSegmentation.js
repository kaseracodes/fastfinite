// utils/CustomPricingSegmentation.js
import dayjs from 'dayjs';
// ADD: Import the MinMax plugin
import minMax from 'dayjs/plugin/minMax';
import { calculateRent } from './Calculations';

// ADD: Extend dayjs with the MinMax plugin
dayjs.extend(minMax);

// Check if two date ranges overlap
const doDateRangesOverlap = (start1, end1, start2, end2) => {
  return start1 <= end2 && start2 <= end1;
};

// Split booking into segments based on custom pricing periods
export const segmentBookingByPricing = (pickupDate, dropoffDate, customPricing) => {
  if (!customPricing?.startDate || !customPricing?.endDate) {
    return [{
      startDate: pickupDate,
      endDate: dropoffDate,
      type: 'standard',
      pricing: null
    }];
  }

  const bookingStart = dayjs(pickupDate);
  const bookingEnd = dayjs(dropoffDate);
  const customStart = dayjs(customPricing.startDate);
  const customEnd = dayjs(customPricing.endDate);

  // Check if there's any overlap
  if (!doDateRangesOverlap(bookingStart, bookingEnd, customStart, customEnd)) {
    return [{
      startDate: pickupDate,
      endDate: dropoffDate,
      type: 'standard',
      pricing: null
    }];
  }

  const segments = [];

  // Before custom pricing period
  if (bookingStart.isBefore(customStart)) {
    segments.push({
      startDate: bookingStart,
      endDate: dayjs.min(bookingEnd, customStart), // NOW WORKS with plugin
      type: 'standard',
      pricing: null
    });
  }

  // During custom pricing period (overlap)
  const overlapStart = dayjs.max(bookingStart, customStart); // NOW WORKS with plugin
  const overlapEnd = dayjs.min(bookingEnd, customEnd); // NOW WORKS with plugin
  
  segments.push({
    startDate: overlapStart,
    endDate: overlapEnd,
    type: 'custom',
    pricing: customPricing
  });

  // After custom pricing period  
  if (bookingEnd.isAfter(customEnd)) {
    segments.push({
      startDate: dayjs.max(bookingStart, customEnd), // NOW WORKS with plugin
      endDate: bookingEnd,
      type: 'standard',
      pricing: null
    });
  }

  return segments;
};

// Calculate rent for a custom pricing segment
const calculateCustomSegmentRent = (startDate, endDate, customPricing, vehicleType) => {
  const diffInHours = endDate.diff(startDate, 'hour');
  const days = Math.ceil(diffInHours / 24);
  
  let rent = 0;

  // Apply custom pricing based on duration and available rates
  if (days >= 30 && customPricing.monthlyPrice) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    rent += months * parseFloat(customPricing.monthlyPrice);
    
    if (remainingDays >= 7 && customPricing.weeklyPrice) {
      const weeks = Math.floor(remainingDays / 7);
      const finalDays = remainingDays % 7;
      rent += weeks * parseFloat(customPricing.weeklyPrice);
      rent += finalDays * parseFloat(customPricing.dailyPrice || 0);
    } else {
      rent += remainingDays * parseFloat(customPricing.dailyPrice || 0);
    }
  } else if (days >= 7 && customPricing.weeklyPrice) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    rent += weeks * parseFloat(customPricing.weeklyPrice);
    rent += remainingDays * parseFloat(customPricing.dailyPrice || 0);
  } else if (customPricing.dailyPrice) {
    rent = days * parseFloat(customPricing.dailyPrice);
  }

  return rent;
};

// Calculate total pricing with segmentation
export const calculateSegmentedPricing = (pickupDate, dropoffDate, packageRates, vehicleType, customPricing) => {
  const segments = segmentBookingByPricing(pickupDate, dropoffDate, customPricing);
  
  let totalRent = 0;
  const breakdown = [];

  segments.forEach(segment => {
    let segmentRent = 0;
    
    if (segment.type === 'standard') {
      // Use existing calculation function
      segmentRent = calculateRent(segment.startDate, segment.endDate, packageRates, vehicleType);
    } else {
      // Calculate custom pricing
      segmentRent = calculateCustomSegmentRent(segment.startDate, segment.endDate, segment.pricing, vehicleType);
    }

    totalRent += segmentRent;
    
    breakdown.push({
      ...segment,
      rent: segmentRent,
      days: Math.ceil(segment.endDate.diff(segment.startDate, 'hour') / 24),
      formattedStart: segment.startDate.format('MMM DD, YYYY HH:mm'),
      formattedEnd: segment.endDate.format('MMM DD, YYYY HH:mm')
    });
  });

  return {
    totalRent,
    breakdown,
    hasCustomPricing: segments.some(s => s.type === 'custom')
  };
};
