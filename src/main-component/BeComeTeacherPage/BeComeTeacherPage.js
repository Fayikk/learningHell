import React, { useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import vImg from '../../images/teacher.jpg';
import TeamSection from '../../components/TeamSection/TeamSection';
import { useApplyCvMutation } from '../../api/becomeTeacherApi';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import MustBeAuthorize from '../../Wrappers/HoC/MustBeAuthorize';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
const BeComeTeacherPage = (props) => {
    const [becomeTeacherAsync] = useApplyCvMutation();
    const Navigate = useNavigate();
    const [forms, setForms] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const userId = useSelector((state) => state.authStore.nameIdentifier);
    const [file, setFile] = useState(null);
    const {t} = useTranslation()
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));

    const changeHandler = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value });
        validator.showMessages();
    };

    const changeFileHandler = (event) => {
        setFile(event.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (validator.allValid() && file) {
            validator.hideMessages();

            const formData = new FormData();
            formData.append("Name", forms.name);
            formData.append("Email", forms.email);
            formData.append("Subject", forms.subject);
            formData.append("Message", forms.message);
            formData.append("Cv", file);
            formData.append("userId",userId);

            try {
                await becomeTeacherAsync({ formData }).then((response) => {
                    if (response.data.isSuccess) {
                        Navigate("/Home")
                        toast.success(response.data.errorMessages[0])
                    }
                    if (!response.data.isSuccess) {
                        toast.error(response.data.errorMessages[0])
                    }
                });

                setForms({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setFile(null);
            } catch (error) {
                console.error("Form submission error:", error);
            }
        } else {
            validator.showMessages();
        }
    };

    return (
        <div className="teacher-page">
            <Navbar hclass={'wpo-header-style-2'} topbarClass={'d-block'}/>
            <PageTitle pageTitle={t("Apply for Teacher")} pagesub={'Teacher'} />
            <div className="teacher-area section-padding pb-0 mt-5">
                <div className="container">
                   
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card shadow border-0 mb-5">
                                <div className="card-body p-4 p-md-5">
                                    <h3 className="mb-4 text-center">{t("Apply Now")}</h3>
                                    <form onSubmit={submitHandler} id="contact-form-main">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    onBlur={changeHandler}
                                                    onChange={changeHandler}
                                                    placeholder={t("Your Name")}
                                                    value={forms.name}
                                                    className="form-control"
                                                />
                                                {validator.message('name', forms.name, 'required|alpha_space')}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    onBlur={changeHandler}
                                                    onChange={changeHandler}
                                                    placeholder={t("Your Email")}
                                                    value={forms.email}
                                                    className="form-control"
                                                />
                                                {validator.message('email', forms.email, 'required|email')}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    onBlur={changeHandler}
                                                    onChange={changeHandler}
                                                    placeholder={t("Your Subject")}
                                                    value={forms.subject}
                                                    className="form-control"
                                                />
                                                {validator.message('subject', forms.subject, 'required|alpha_space')}
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="file" className="form-label">{t("Upload Your CV")}</label>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    id="file"
                                                    onBlur={changeFileHandler}
                                                    onChange={changeFileHandler}
                                                    className="form-control"
                                                />
                                                <small className="text-muted">{file ? file.name : t("No file selected")}</small>
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    onBlur={changeHandler}
                                                    onChange={changeHandler}
                                                    name="message"
                                                    placeholder={t("Message")}
                                                    value={forms.message}
                                                    className="form-control"
                                                    rows={4}
                                                />
                                                {validator.message('message', forms.message, 'required')}
                                            </div>
                                            <div className="col-12 text-center">
                                                <button type="submit" className="theme-btn submit-btn px-5 py-2">{t("Send Message")}</button>
                                            </div>
                                            
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TeamSection pbClass={'s2'} />
            </div>
            <Footer />
            <Scrollbar />
        </div>
    );
};

export default MustBeAuthorize(BeComeTeacherPage);
