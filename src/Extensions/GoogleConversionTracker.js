import { useEffect } from 'react';

const GoogleConversionTracker = () => {
  useEffect(() => {
    // Check if gtag is available
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11217374262/aYX2CIG016caELaY7uQp',
        'transaction_id': ''
      });
    } else {
      console.warn('Google gtag not found. Make sure Google Tag Manager is properly set up.');
    }
  }, []); // Empty dependency array ensures this runs once when component mounts

  // This component doesn't render anything visible
  return null;
};

export default GoogleConversionTracker;