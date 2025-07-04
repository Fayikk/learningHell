import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Team from '../../api/team'
import shape1 from '../../images/team/shape-1.svg'
import shape2 from '../../images/team/shape-2.svg'
import shape3 from '../../images/team/shape-3.svg'
import shape4 from '../../images/team/shape-4.svg'
import VerticallyCenteredModal from '../../main-component/CustomComponents/VerticallyCenteredModal'
import { useMakeInstructiveUserMutation } from '../../api/accountApi'
import { toast } from 'react-toastify'
const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const   TeamSection = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [applicantDetail,setApplicantDetail] = useState({
        cvPath:"",
        email:"",
        userId:"",
        message:"",
        name:"",
        subject:""
    });
    const [makeInstructive] = useMakeInstructiveUserMutation();


    const handleChangeRoleUserAsync = async (event) => {
        const userId = event.userId;
        var isMakeInstructor = false;
        if (event.decideInstructive === "MakeInstructor") {
            isMakeInstructor = true;
        }
        const decisionModel = {
        isMakeInstructive:isMakeInstructor,

        }



        
        await makeInstructive({userId,decisionModel}).then((response) => {
            if (response.data.isSuccess) {
                toast.success("User added role with Instructor successfully");
            }
            else {
                toast.error("Oops! something went wrong")
            }
            })
    }


    return (
        <section className={`wpo-team-section section-padding ${props.pbClass}`}>
       
      <VerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                    applicantDetail={applicantDetail}
                                    onData={handleChangeRoleUserAsync}
                                        
                                    
                                />
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>{props.title}</small>
                    <h2>{props.title}
                        <span>
                            
                            <i className="shape">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206 53" fill="none">
                                    <path
                                        d="M152.182 2.58319C107.878 0.889793 54.8748 6.13932 21.2281 18.6943C14.2699 21.4407 7.93951 24.7738 5.70192 28.7128C4.27488 31.2398 5.03121 33.954 7.69121 36.2925C14.8835 42.3911 31.9822 45.4011 46.8006 47.3115C78.3067 51.0179 113.672 51.7406 145.489 48.3204C167.194 46.0009 200.667 39.5923 199.399 28.5709C198.543 20.0621 180.437 14.5729 162.979 11.6178C138.219 7.469 111.131 6.00576 84.5743 5.86862C71.32 5.85789 58.0913 6.85723 45.6675 8.78436C33.512 10.7186 21.2709 13.4317 12.6602 17.5817C11.2246 18.2877 8.62449 17.4553 9.9973 16.6813C20.7486 11.2493 38.0215 7.73493 53.9558 5.76368C77.1194 2.90994 101.75 3.75426 125.339 5.14356C158.167 7.2615 207.554 13.5139 204.928 30.7413C203.629 36.0898 194.762 40.5057 184.681 43.5503C156.563 51.768 119.114 53.6844 85.6331 52.5265C65.1694 51.7477 44.4831 50.1855 25.9972 46.2442C11.4129 43.1186 -1.0337 37.8297 0.0679738 30.5063C2.14003 19.9035 31.4913 12.0006 52.6201 7.98775C71.2971 4.45904 91.3384 2.2302 111.674 1.24636C125.228 0.595237 138.962 0.539188 152.536 1.15931C153.475 1.20224 154.154 1.55523 154.051 1.94876C153.951 2.33872 153.115 2.62135 152.182 2.58319Z" />
                                </svg>
                            </i>
                        </span>
                    </h2>
                </div>
                <div className="wpo-team-wrap">
                    <div className="row">
                    {props.applicants && props.applicants.map((team, aitem) => (
                        
                            <div className="col col-lg-3 col-md-6 col-12" key={aitem}>
                              
                            <div className="wpo-team-item">
                                <div className="wpo-team-img">
                                    <div className="wpo-team-img-box">
                                    <img src={team.tImg} alt="" />
                                            <ul>
                                                <li><Link onClick={ClickHandler} to="/"><i className="fi flaticon-facebook-app-symbol"></i></Link></li>
                                                <li><Link onClick={ClickHandler} to="/"><i className="fi flaticon-twitter"></i></Link></li>
                                                <li><Link onClick={ClickHandler} to="/"><i className="fi flaticon-linkedin"></i></Link></li>
                                            </ul>
                                      
                                    </div>
                                </div>
                                <div className="wpo-team-text">
                                    <h2><a onClick={() => {
                                        setModalShow(true); 
                                        setApplicantDetail({cvPath:team.cvPath,email:team.email,userId:team.userId,message:team.message,name:team.name,subject:team.subject})}} >{team.name}</a></h2>
                                    <span>{team.title}</span>
                                </div>
                            </div>
                        </div>
                        ))}
                        
                    </div>
                </div>
            </div>
            <div className="shape-1"><img src={shape1} alt=""/></div>
            <div className="shape-2"><img src={shape2} alt=""/></div>
            <div className="shape-3"><img src={shape3} alt=""/></div>
            <div className="shape-4"><img src={shape4} alt=""/></div>
        </section>
    )
}

export default TeamSection;