import React, { useState } from 'react';
import { Languages } from '../../main-component/Extensions/Languages';
import './Styles/MainFilterPage.css'
function MainPageFilter({onData}) {
  const [lowPriceRange, setLowPriceRange] = useState("0"); // Varsayılan fiyat aralığı
  const [highPriceRange,setHighPriceRange] = useState("1000");
  const [CourseLanguage, SetCourseLanguage] = useState('');
  const [rating, setRating] = useState(0);




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

  return (
    <div className="filter-container">
      <h3>Filter Options</h3>

      <div className="filter-item">
        <label>Price Range:</label>
        <input 
          type="number" 
          name="min" 
          value={lowPriceRange} 
          onChange={handlePriceChange}
          placeholder="Min" 
        />
        <span> - </span>
        <input 
          type="number" 
          name="max" 
          value={highPriceRange} 
          onChange={handlePriceChange}
          placeholder="Max" 
        />
      </div>

      <div className="filter-item">
        <label>Language:</label>
        <select
        value={CourseLanguage} onChange={handleLanguageChange}
          >
           
            {Languages.map((language,index) => (
              <option key={language[index]} value={language}>
                {language}
              </option>
            ))}
          </select>
      </div>

      {/* <div className="filter-item">
        <label>Rating:</label>
        <select value={rating} onChange={handleRatingChange}>
          <option value={"0"}>All Ratings</option>
          <option value={"5"}>5 Stars</option>
          <option value={"4"}>4 Stars & Up</option>
          <option value={"3"}>3 Stars & Up</option>
          <option value={"2"}>2 Stars & Up</option>
          <option value={"1"}>1 Star & Up</option>
        </select>
      </div> */}

    <button className="apply-filter-btn" onClick={()=>handlePress("filter")}>Apply Filters</button>
    <button className="apply-remove-btn" onClick={()=>handlePress("remove")}>Remove Filters</button>

</div>
  );
}

export default MainPageFilter;
