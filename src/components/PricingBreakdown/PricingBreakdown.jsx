// components/PricingBreakdown/PricingBreakdown.jsx
import React, { useState } from 'react';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './PricingBreakdown.module.css';

const PricingBreakdown = ({ pricingDetails }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className={styles.pricingContainer}>
      {/* Custom Pricing Indicator */}
      {pricingDetails.hasCustomPricing && (
        <div className={styles.customPricingIndicator}>
          <FiInfo className={styles.infoIcon} />
          <span>Custom pricing applied to part of your booking</span>
          <button 
            className={styles.toggleButton}
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            View Details 
            {showBreakdown ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      )}

      {/* Detailed Breakdown */}
      {showBreakdown && (
        <div className={styles.breakdown}>
          <h4>Pricing Breakdown</h4>
          {pricingDetails.breakdown.map((segment, index) => (
            <div key={index} className={styles.segment}>
              <div className={styles.segmentHeader}>
                <span className={`${styles.segmentType} ${styles[segment.type]}`}>
                  {segment.type === 'custom' ? 'Custom Pricing' : 'Standard Pricing'}
                </span>
                <span className={styles.segmentDuration}>
                  {segment.days} day{segment.days !== 1 ? 's' : ''}
                </span>
              </div>
              <div className={styles.segmentDetails}>
                <div className={styles.segmentDates}>
                  {segment.formattedStart} → {segment.formattedEnd}
                </div>
                <div className={styles.segmentPrice}>
                  ₹{segment.rent}
                </div>
              </div>
              {segment.type === 'custom' && (
                <div className={styles.customRates}>
                  Applied rates: 
                  {segment.pricing.dailyPrice && ` Daily: ₹${segment.pricing.dailyPrice}`}
                  {segment.pricing.weeklyPrice && ` Weekly: ₹${segment.pricing.weeklyPrice}`}
                  {segment.pricing.monthlyPrice && ` Monthly: ₹${segment.pricing.monthlyPrice}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PricingBreakdown;
