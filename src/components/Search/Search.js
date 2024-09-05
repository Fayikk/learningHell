import React from 'react';
import { useState, useEffect } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import { TbWorld } from 'react-icons/tb';
import { FaLock } from 'react-icons/fa';
import { useGetCoursesBySearchMutation } from '../../api/courseApi';
import { MatchLocationToCurrency } from '../../main-component/Extensions/MatchLocationToCurrency';
import { Link } from 'react-router-dom';

function Search({onData,onChangeClick}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchFetch] = useGetCoursesBySearchMutation();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        try {
          await searchFetch(query).then((res) => {
            console.log('trigger search fetch', res);
            setResults(res.data.result);
          });
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
    onData(event.target.value)
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Enter tuşuna basıldığında yapılacak işlemler
      console.log('Search query:', query);
      onChangeClick(event.key)
    }
  };


  const handleClick = () => {
    console.log("trigger handle click")
  }

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Search..."
        style={styles.input}
      />
      {results.length > 0 && (
        <div style={styles.resultsWrapper}>
          <ul style={styles.resultsList}>
            {results.map((result, index) => (
            <Link to={`/course-single/${result.courseId}`} >
            <li key={index} style={styles.resultItem}  >
                <img
                  src={result.courseImage}
                  alt={result.courseName}
                  style={styles.resultImage}
                />
                <div style={styles.resultDetails}>
                  <h3 style={styles.resultName}>{result.courseName}</h3>
                  <p style={styles.resultPrice}>
                    {MatchLocationToCurrency()}
                    {result.coursePrice}
                  </p>
                  <p style={styles.resultLanguage}>{result.courseLanguage}</p>
                </div>
              </li>
            </Link>              
              
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px', 
  },
  input: {
    width: '300px',
    padding: '10px',
    borderRadius: '25px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  resultsWrapper: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    maxHeight: '300px', 
    overflowY: 'auto', 
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  resultsList: {
    margin: '0',
    padding: '0',
    listStyleType: 'none',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    cursor:"pointer",
  },
  resultImage: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    marginRight: '15px',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  resultName: {
    margin: '0',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  resultPrice: {
    margin: '5px 0',
    color: '#888',
  },
  resultLanguage: {
    margin: '0',
    color: '#888',
  },
};

export default Search;
