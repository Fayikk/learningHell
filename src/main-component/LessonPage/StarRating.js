import React, { useEffect, useState } from 'react';
import './style/StarRating.css';
import { useApplyRateMutation, useCheckRatingQuery } from '../../api/ratingApi';
import IsLoading from '../../components/Loading/IsLoading';

const StarRating = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [applyRate] = useApplyRateMutation();

  const { data, isLoading } = useCheckRatingQuery(courseId);

  useEffect(() => {
    if (data && data.isSuccess ) {
      setRating(data.result[0].rate);
    } else {
      setRating(0);
    }
  }, [data]);

  if (isLoading) {
    return (
      <>
        <IsLoading />
      </>
    );
  }

  console.log("trigger rating", rating);

  const sendRate = async (newRating) => {
    const rateModel = {
      courseId: courseId,
      Rate: newRating
    };
    console.log("trigger send rate", rateModel);
    if (rateModel.Rate === 0) {
      return;
    }
    await applyRate(rateModel).then((response) => console.log(response.data.isSuccess));
  };

  return (
    <div className="star-rating">
     
      {
        data && !data.isSuccess ? (
      <span>Rate this course</span>

        ) : (
      <span>You evaluated </span>

        )
      }
     
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={() => {
              setRating(index);
              sendRate(index);
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            disabled={data && data.isSuccess} // Hata önlemek için bu şekilde güncellendi
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
