import React from 'react';
 // Or whatever modal library you're using
 import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Input } from "reactstrap";
import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const BankInfoModal = ({ open, onClose, bankInfo, onInputChange, onSubmit }) => {
  console.log("trigger open modal",open)
  return (
<>
    <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={{
      ...style, 
      p: 4, 
      bgcolor: 'background.paper', 
      borderRadius: 3, 
      boxShadow: 24, 
      maxWidth: '600px', 
      margin: '0 auto', 
      position: 'relative',
      maxHeight: '80vh', // Modal yüksekliğini sınırla
    overflowY: 'auto'  // Uzun içerikler için dikey kaydırma  
    }}>
      {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {isUpdateProcess ? t("Update Course") : t("Create Course")}
      </Typography> */}
      <form onSubmit={(e) => { e.preventDefault();console.log("trigger on submit"); onSubmit(); }}>

      <div className="col" style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
            type="text"
            placeholder='Instructor Name'
            name="InstructorName"
            value={bankInfo.InstructorName}
            onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
            type="text"
              placeholder='Instructor Surname'
            name="InstructorSurname"
            value={bankInfo.InstructorSurname}
            onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
           type="text"
             placeholder='Identity Number'
           name="IdentityNumber"
           value={bankInfo.IdentityNumber}
           onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
            type="text"
              placeholder='Address'
            name="Address"
            value={bankInfo.Address}
            onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
          type="text"
          placeholder='Iban'
          name="Iban"
          value={bankInfo.Iban}
          onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
          <Input
              type="text"
              placeholder='Bank'

              name="BankName"
              value={bankInfo.BankName}
              onChange={onInputChange}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
      
      </div>

      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
     
          <Button 
           type="submit"
            variant="contained" 
            color="primary" 
            sx={{ mt: 2, width: '100%' }}
          >
            Save
          </Button>
          <Button 
            onClick={onClose} 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2, width: '100%' }}
          >
           Close
          </Button>
      </Typography>
      </form>

      {/* {!isActiveButton && <Spinner animation="border" sx={{ marginTop: '10px', textAlign: 'center' }} />} */}
    </Box>
  </Modal>

 
    </>
  );
};

export default BankInfoModal;
