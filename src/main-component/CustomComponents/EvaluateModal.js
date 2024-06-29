import { Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { courseEvaluateEnum } from '../../api/Enums/evaluateEnum';

function EvaluateModal({ props,status, onData }) {
    const [description, setDescription] = useState("");
    const [closeModal, setCloseModal] = useState(props);
    const [statu, setStatu] = useState("");
    const [returnEvaluate,setReturnEvaluate] = useState({
        description:String,
        statu:Number
    })

    console.log("trigger evaluate modal statu",status.result[0].courseEvaluteStatus)

    const sendDataToParent = () => {
        onData({returnEvaluate });
    };


    const evaluateSettings = [
        {
        name:"Send To Revision",    
        value:courseEvaluateEnum.InRevision,

        },
        {
            name:"Cancel",    
            value:courseEvaluateEnum.Cancel,
        },
        {
            name:"Accept",    
            value:courseEvaluateEnum.Accept,
        }
    ];

    return (
        <div
            className="modal hide"
            style={{ display: closeModal ? 'block' : 'none', position: 'initial' }}
        >
            <Modal.Dialog>
                <Modal.Header closeButton onClick={() => setCloseModal(false)}>
                    <Modal.Title> 
                        {status.result[0].courseEvaluteStatus === courseEvaluateEnum.Cancel || status.result[0].courseEvaluteStatus === courseEvaluateEnum.InRevision ? status.result[0].courseEvaluateDescription : "Send Evaluate"}</Modal.Title>
                </Modal.Header>

                {
                    status.result[0].courseEvaluteStatus === courseEvaluateEnum.Cancel || status.result[0].courseEvaluteStatus === courseEvaluateEnum.InRevision ? ("") : (
                        <Modal.Body>
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                        <div className="col" style={{ alignItems: 'center' }}>
                            <input type='text' placeholder='Description' onChange={(e) => setReturnEvaluate((prevState) => {return {...prevState,description:e.target.value}})} />
                        </div>
                        <div className="col" style={{ alignItems: 'center' }}>
                            <Select value={returnEvaluate.statu} onChange={(e) => setReturnEvaluate((prevState) => {return {...prevState,statu:e.target.value}})}>
                                {evaluateSettings.map((setting, index) => (
                                    <MenuItem key={index} value={setting.value}>{setting.name}</MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Modal.Body>
                    )
                }
                

                <Modal.Footer>
                {
                    status.result[0].courseEvaluteStatus === courseEvaluateEnum.Cancel || status.result[0].courseEvaluteStatus === courseEvaluateEnum.InRevision ? (
                        <Button variant="secondary" onClick={() => setCloseModal(false)}>Close</Button>
                    ) : (
                        <>
                        <Button variant="secondary" onClick={() => setCloseModal(false)}>Close</Button>
                        <Button variant="primary" onClick={sendDataToParent}>Send To Evaluate</Button>
                        </>
                    )
                }
                   
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default EvaluateModal;
