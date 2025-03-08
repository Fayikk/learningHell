import { useEffect } from 'react';

const GoogleConversionTracker = () => {
  useEffect(() => {
    console.log("GoogleConversionTracker mounted");
    
    const checkAndFireGtag = () => {
      if (window.gtag) {
        console.log("gtag found, firing conversion event");
        window.gtag('event', 'conversion', {
          'send_to': 'AW-11217374262/aYX2CIG016caELaY7uQp',
          'transaction_id': ''
        });
        return true;
      }
      return false;
    };

    if (!checkAndFireGtag()) {
      console.log("gtag not found, setting up retry mechanism");
      
      const retryTimes = [100, 500, 1000, 2000];
      
      retryTimes.forEach((delay, index) => {
        setTimeout(() => {
          console.log(`Retry attempt ${index + 1} to find gtag`);
          if (checkAndFireGtag()) {
            console.log("gtag found on retry");
          } else if (index === retryTimes.length - 1) {
            console.warn('Google gtag not found after multiple attempts. Make sure Google Tag Manager is properly set up in your HTML.');
          }
        }, delay);
      });
    }
  }, []);
  return null;
};//

export default GoogleConversionTracker;