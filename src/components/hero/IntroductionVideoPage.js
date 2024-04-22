import React from 'react'
import { Link } from 'react-router-dom'

export default function IntroductionVideoPage({introductionVideoUrl}) {


  return (
    <>
    <video width="100%" loop autoPlay muted controls key={introductionVideoUrl} controlsList="nodownload" className="media">
      <source src={introductionVideoUrl} />
      Your browser does not support the video tag.
    </video>
    </>
  )
}
