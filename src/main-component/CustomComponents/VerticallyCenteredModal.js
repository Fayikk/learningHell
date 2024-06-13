import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDownloadMaterialFileMutation } from '../../api/materialApi';
import {toast} from 'react-toastify'
import { file } from 'jszip';
function VerticallyCenteredModal(props) {

    const [downloadCv] = useDownloadMaterialFileMutation();

const [isMakeInstructor, setIsMakeInstructor] = useState(["MakeInstructor", "Reject"]);
const [selectedChoosen,setSelectedChoosen] = useState();
    console.log("trigger vertically",props)

    const handleResponseDataChildToParent = (decideInstructive) => {
        const userId = props.applicantDetail.userId;
        props.onData({decideInstructive,userId})
    }


    console.log("trigger is makge instructor",isMakeInstructor)

    const handleClickDownloadCv = async (fileUrl) => {
        // public string FileUrl { get; set; } = null!;
        // public MaterialType Type { get; set; } 
        const formData = {
            fileUrl:fileUrl,
            type:2
        }

        await downloadCv(formData).then((response) => {{
            if (response.data.isSuccess) {

                const linkSource = `data:application/pdf;base64,${response.data.result}`;
                const downloadLink = document.createElement("a");
                const fileName = fileUrl;
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                toast.success("Download process is success completed")
            }
            else {
                toast.error("Ooops! something went wrong")
            }

        }})
    }


    const handleChange = (event) => {
        setSelectedChoosen(event.target.value);
    };


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        {props.applicantDetail.name}

        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.applicantDetail.email}</h4>
        <p>
            {props.applicantDetail.message }
        </p>
        <a><button onClick={()=>handleClickDownloadCv(props.applicantDetail.cvPath)} >Download Cv</button></a>
        <div className='row'>
            <div className='col'>
                <select onChange={handleChange} value={selectedChoosen}>
                    {isMakeInstructor.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <p>Selected: {selectedChoosen}</p>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button  className='btn btn-primary' onClick={()=>handleResponseDataChildToParent(selectedChoosen)}>Send Decision</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default VerticallyCenteredModal