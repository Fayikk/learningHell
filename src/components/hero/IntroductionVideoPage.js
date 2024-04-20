import React from 'react'
import { Link } from 'react-router-dom'
export default function IntroductionVideoPage({introductionVideoUrl}) {

    console.log("trigger videos")

  return (
    <div className="item">
    <video width="100%" loop autoPlay muted controls key={introductionVideoUrl} className="media">
      <source src={introductionVideoUrl} />
      Your browser does not support the video tag.
    </video>
  </div>
  )
}
