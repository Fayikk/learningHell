import { useEffect } from "react";

const GoogleTag = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-11217374262";
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "AW-11217374262");
    };
  }, []);

  return null;
};

export default GoogleTag;
