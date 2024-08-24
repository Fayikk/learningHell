import React, { useState } from "react";
import { useRegisterNewsLetterMutation } from "../../api/newsLetterApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const SubmitHandler = (e) => {
  e.preventDefault();
};

const Newslatter2 = (props) => {
  const [sendEmail] = useRegisterNewsLetterMutation();
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSendClick = async () => {
    const model = {
      email: email,
    };

    await sendEmail(model).then((response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.messages[0]);
        setEmail("");
      } else {
        toast.error("Ooops something went wrong!");
      }
    });
  };

  return (
    <section className="wpo-subscribe-section-s2 section-padding">
      <div className="container-fluid">
        <div className="wpo-subscribe-wrap">
          <div className="subscribe-text">
            <h3> {t("Subscribe to our newsletter to receive latest news on our services")}.</h3>
          </div>
          <div className="subscribe-form">
            <form onSubmit={SubmitHandler}>
              <div className="input-field">
                <input type="email" value={email} placeholder={t("Enter your email")} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" onClick={handleSendClick}>
                  {" "}
                  {t("Subscribe")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newslatter2;
