import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CustomModal({ props,changeVideoObject,type, onData }) {
    const [closeModal, setCloseModal] = useState(props);
    const [file, setFile] = useState();
    const [title, setTitle] = useState(changeVideoObject.videoName || "");
    const [rowNumber, setRowNumber] = useState(changeVideoObject.rowNumber || "");

    const [message,setMessage] = useState("");
    const sendDataToParent = () => {
        onData({file,title,rowNumber});
    };


    useEffect(()=>{
        if (type === "NewMaterial") {
            setMessage("Add New Material")   
           }
           else if (type === "NewVideo")
               {
                   setMessage("Add New Video")
               }
               else if(type === "ChangeVideo")
                   {
                       setMessage("Change Video")
                   }
    },[])

   

    return (
        <div
            className="modal hide"
            style={{ display: closeModal ? 'block' : 'none', position: 'initial' }}
        >
            <Modal.Dialog>
                <Modal.Header closeButton onClick={() => setCloseModal(false)}>
                    <Modal.Title>{message}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                <div className="col" style={{ alignItems: 'center' }}>
                    <input type='file' onChange={setFile} />

                    </div>
                    <div className='col'>
                            <input type='text' placeholder='What is title' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        {(type === "NewVideo" || type === "ChangeVideo") && (
                            <div className='col'>
                                <input type='number' placeholder='Section Row Number' value={rowNumber} onChange={(e) => setRowNumber(e.target.value)} />
                            </div>
                        )}

                  
                  </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCloseModal(false)}>Close</Button>
                    <Button variant="primary" onClick={sendDataToParent}>Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default CustomModal;
