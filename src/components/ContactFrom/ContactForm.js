import React, { useState } from 'react'
import SimpleReactValidator from 'simple-react-validator';
import { useCreateSupportTicketMutation } from '../../api/supportApi';
import { toast } from 'react-toastify';




const supportTypes = [
    "Technical Problem","Only Ask","Account Problem"
]


const ContactForm = () => {


    const [createTicket] = useCreateSupportTicketMutation();
    const [forms, setForms] = useState({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: ''
    });
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));

    console.log("trigger forms",forms.subject)


    const changeHandler = e => {
        setForms({ ...forms, [e.target.name]: e.target.value })
        if (validator.allValid()) {
            validator.hideMessages();
        } else {
            validator.showMessages();
        }
    };

    const submitHandler = async e => {
        e.preventDefault();
        if (validator.allValid()) {
            validator.hideMessages();
            setForms({
                name: '',
                email: '',
                subject: '',
                phone: '',
                message: ''
            })

            // public string Name { get; set; }
            // [Required]
            // [EmailAddress]
            // public string Email { get; set; }
            // [Required]
            // [Phone]
            // public string PhoneNumber { get; set; }
            // [Required]
            // public string SupportType { get; set; }
            // [Required]
            // public string Message { get; set; }



            var formObject = new FormData();
            formObject.append("Name",forms.name),
            formObject.append("Email",forms.email),
            formObject.append("PhoneNumber",forms.phone),
            formObject.append("Message",forms.message),
            formObject.append("SupportType",forms.subject);
            await createTicket(formObject).then((response)=> {
                console.log("trigger create ticket",response)
                if (response.data.isSuccess) {
                    toast.success(response.data.message)
                }
                else {
                    toast.warning(response.data.message)

                }
            })



        } else {
            validator.showMessages();
        }
    };

    return (
        <form onSubmit={(e) => submitHandler(e)} className="contact-validation-active" >
            <div className="row">
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.name}
                            type="text"
                            name="name"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Your Name" />
                        {validator.message('name', forms.name, 'required|alpha_space')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.email}
                            type="email"
                            name="email"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Your Email" />
                        {validator.message('email', forms.email, 'required|email')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.phone}
                            type="phone"
                            name="phone"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Your phone" />
                        {validator.message('phone', forms.phone, 'required|phone')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <select
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            value={forms.subject}
                            type="text"
                            name="subject">
                            {
                                supportTypes.map((support,index)=> (
                                    <option value={support} >{support}</option>

                                ))
                            }



                        </select>
                        {validator.message('subject', forms.subject, 'required')}
                    </div>
                </div>
                <div className="col col-lg-12 col-12">
                    <textarea
                        onBlur={(e) => changeHandler(e)}
                        onChange={(e) => changeHandler(e)}
                        value={forms.message}
                        type="text"
                        name="message"
                        placeholder="Message">
                    </textarea>
                    {validator.message('message', forms.message, 'required')}
                </div>
            </div>
            <div className="submit-area">
                <button type="submit" className="theme-btn">Submit Now</button>
            </div>
        </form >
    )
}

export default ContactForm;