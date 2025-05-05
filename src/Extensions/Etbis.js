import React from 'react'
import { EtbisValue } from '../api/Base/Keys';

function Etbis() {
    const result =EtbisValue;

    console.log("trigger Etbis",result)
    if (!result) {
        return null; // or a loading spinner, or any other fallback UI
        
    }

  return (
    <>
   <div id="ETBIS"><div id="5601513738727087"><a href="https://etbis.eticaret.gov.tr/sitedogrulama/5601513738727087" target="_blank"><img style='width:10px; height:12px' src={`data:image/jpeg;base64,${EtbisValue}`}/></a></div></div>
  </>
  )
}

export default Etbis