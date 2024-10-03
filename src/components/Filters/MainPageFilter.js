import React, { useState } from 'react';
import { Languages } from '../../main-component/Extensions/Languages';
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Input } from "reactstrap";
import './Styles/MainFilterPage.css'

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

function MainPageFilter({onData,openModal}) {
  const [lowPriceRange, setLowPriceRange] = useState("0"); // Varsayılan fiyat aralığı
  const [highPriceRange,setHighPriceRange] = useState("1000");
  const [CourseLanguage, SetCourseLanguage] = useState('');
  const [rating, setRating] = useState(0);
  const [modal,setModal] = useState(true)



    const handlePress = (type) => {
        onData({lowPriceRange,highPriceRange,CourseLanguage,rating,type})
    }


  const handlePriceChange = (event) => {
    const { value, name } = event.target;
    if (name === 'min') {
        setLowPriceRange(value);
    } else {
        setHighPriceRange(value);
    }
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value    );
  };

  const handleLanguageChange = (event) => {
    SetCourseLanguage(event.target.value);
  };


  const handleModalEvent = (value) => {
    openModal(value)
  }

  
  return (
  
  <>
<Modal
  open={openModal}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{
    p: 4,
    bgcolor: 'background.paper',
    borderRadius: '10px',  // Kenarları yuvarlat
    boxShadow: 24,
    maxWidth: '600px',
    margin: '0 auto',
    position: 'relative',
    maxHeight: '80vh',  // Modal yüksekliğini sınırla
    overflowY: 'auto',  // Uzun içerikler için dikey kaydırma
    display: 'flex',
    flexDirection: 'column',
    gap: 3  // Elemanlar arası boşluk
  }}>
    {/* Kapatma butonu */}
    <button
      onClick={() => handleModalEvent(false)}  // Modal'ı kapatan fonksiyon
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#555', // Kapama butonu rengi
        fontWeight: 'bold'
      }}
    >
      &times;
    </button>

    {/* Fiyat Aralığı Inputları */}
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
    <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Min Price</label>

      <Input
        type="number"
        name="min"
        value={lowPriceRange}
        onChange={handlePriceChange}
        placeholder="Min Price"
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          flex: 1,
          fontSize: '16px'
        }}
      />
          <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Max Price</label>


      <Input
        type="number"
        name="max"
        value={highPriceRange}
        onChange={handlePriceChange}
        placeholder="Max Price"
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          flex: 1,
          fontSize: '16px'
        }}
      />
    </div>

    {/* Dil Seçimi */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>Select Language</label>
      <select
        value={CourseLanguage}
        onChange={handleLanguageChange}
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px',
          color: '#333',
          backgroundColor: '#f7f7f7'
        }}
      >
        {Languages.map((language, index) => (
          <option key={index} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>

    {/* Filtre Butonları */}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
      <button
        onClick={() => handlePress("filter")}
        style={{
          padding: '12px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          flex: 1
        }}
      >
        Apply Filters
      </button>
      <button
        onClick={() => handlePress("remove")}
        style={{
          padding: '12px 20px',
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          flex: 1
        }}
      >
        Remove Filters
      </button>
    </div>
  </Box>
</Modal>


</>
  );
}

export default MainPageFilter;
