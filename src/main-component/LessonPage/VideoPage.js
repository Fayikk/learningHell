import React from 'react'

export default function VideoPage() {
  return (
    <div>
          <video className="w-100" loop autoPlay  muted controls key={localStorage.getItem('willSelectedVideo')} >
                                <source
                                            src={JSON.parse(localStorage.getItem('willSelectedVideo'))}
                                            type="video/mp4"
                                        />
                                   
                                </video>
    </div>
  )
}
