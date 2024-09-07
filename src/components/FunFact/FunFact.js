import React from "react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

const FunFact = (props) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };
  return (
    <section className="wpo-fun-fact-section">
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="wpo-fun-fact-grids clearfix">
              <div className="grid">
                <div className="info">
                  <h3>
                    <span>
                      <CountUp end={985} enableScrollSpy />
                    </span>
                    +
                  </h3>
                  <p> {t("Student Enrolled")}</p>
                </div>
              </div>
              <div className="grid">
                <div className="info">
                  <h3>
                    <span>
                      <CountUp end={25} enableScrollSpy />
                    </span>
                    +
                  </h3>
                  <p>{t("Winning Award")}</p>
                </div>
              </div>
              <div className="grid">
                <div className="info">
                  <h3>
                    <span>
                      <CountUp end={35} enableScrollSpy />
                    </span>
                    +
                  </h3>
                  <p>{t("Event Organized")}</p>
                </div>
              </div>
              <div className="grid">
                <div className="info">
                  <h3>
                    <span>
                      <CountUp end={355} enableScrollSpy />
                    </span>
                    +
                  </h3>
                  <p>{t("Expert Mentor")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunFact;
