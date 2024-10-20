import React from 'react'
import ProfileIcon from "../../icons/ProfileIcon";
import PointIcon from "../../icons/PointIcon";
import ClockIcon from "../../icons/ClockIcon";
import InstructorIcon from "../../icons/InstructorIcon";
import profiles from "../../images/profile-picture.jpg";

const InstructorDetails = (props) => {
  
  
  return (
    <div className="flex rounded-2xl shadow-lg flex-col gap-5 p-5">
    <div className="flex flex-col  sm:gap-10 ">
      <h1 className="text-themeOrange text-[22px] font-bold">
        Kariyerin için yeni bir beceri kazan
      </h1>
    </div>
    <div className="flex flex-col gap-4">
      <h1 className="text-black text-[22px] font-bold">
      </h1>
      <div className="flex gap-2 items-center">
        <span className="text-themeOrange">
          {" "}
          <ProfileIcon />
        </span>
        <span className="text-black/75 text-sm font-semibold">
          {/* 97473 learners */}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-blue-400">
          {" "}
          <PointIcon />
        </span>
        <span className="text-black/75 text-sm font-semibold">
          {/* 15 points to earn */}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-themeOrange">
          {" "}
          <ClockIcon />
        </span>
        <span className="text-black/75 text-sm font-semibold">
          12 hour of content
        </span>
      </div>
    </div>
    <div className="flex flex-col gap-1  ">
      <div className="flex gap-2">
        <InstructorIcon />{" "}
        <span className="text-black font-bold">Eğitmen</span>
      </div>
      <span className="text-black font-bold">{props.instructor.fullName ? props.instructor.fullName : ""}</span>
    </div>
    <img src={profiles} className="h-24 w-24" />
    <p className="sm:max-w-[400px] items-center justify-center">
    
    </p>
  </div>
  )
}

export default InstructorDetails