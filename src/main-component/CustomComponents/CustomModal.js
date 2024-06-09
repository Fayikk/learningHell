import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CustomModal({ props,type, onData }) {
    const [closeModal, setCloseModal] = useState(props);
    const [file, setFile] = useState();
    const [title,setTitle] = useState();
    const [message,setMessage] = useState("");
    const sendDataToParent = () => {
        onData({file,title});
    };


    useEffect(()=>{
        if (type === "NewMaterial") {
            setMessage("Add New Material")   
           }
           else if (type === "NewVideo")
               {
                   setMessage("Add New Video")
               }
               else if(type === "Change Video")
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
                <div className="row w-100" style={{ alignItems: 'center' }}>
                    <input type='file' onChange={setFile} />

                    </div>
                    <div className='col'>
                      <input type='text'placeholder='what is title' onChange={(e) => setTitle(e.target.value)} ></input>
                    </div>
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
