import React from "react";
import sImg1 from "../../../images/shop/shop-single/review/img-1.jpg";
import sImg2 from "../../../images/shop/shop-single/review/img-1.jpg";

const SubmitHandler = (e) => {
  e.preventDefault();
};

const Review = () => {
  return (
    <div className="flex rounded-2xl shadow-lg flex-col gap-2 p-5">
      <div className="flex flex-col gap-3">
        {" "}
        <h1 className="font-bold text-black text-2xl p-1">Comments</h1>
        <div className="col flex flex-col  sm:gap-1">
          <div className="client-rv flex flex-col sm:flex-row sm:gap-2 text-sm">
            <div className="client-pic">
              <img src={sImg1} alt="" className=" w-20 h-20" />
            </div>
            <div className="details">
              <div className="name-rating-time">
                <div className="name-rating">
                  <div>
                    <h4 className="text-black font-bold">Jenefar Willium</h4>
                  </div>
                  <div className="product-rt">
                    <span>25 Sep 2023</span>
                    <div className="rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration.
                </p>
              </div>
            </div>
          </div>
          <div className="client-rv flex gap-2 text-sm flex flex-col sm:flex-row sm:gap-2">
            <div className="client-pic">
              <img src={sImg2} alt="" className=" w-20 h-20" />
            </div>
            <div className="details">
              <div className="name-rating-time">
                <div className="name-rating">
                  <div>
                    <h4 className="text-black font-bold">Maria Bannet</h4>
                  </div>
                  <div className="product-rt">
                    <span>28 Sep 2023</span>
                    <div className="rating">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star-o"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="review-form flex flex-col ">
        <h1 className="font-bold text-black text-2xl  ">Add a Review</h1>
        <form onSubmit={SubmitHandler}>
          <div className="give-rat-sec">
            <div className="give-rating">
              <label>
                <input type="radio" name="stars" value="1" />
                <span className="icon">★</span>
              </label>
              <label>
                <input type="radio" name="stars" value="2" />
                <span className="icon">★</span>
                <span className="icon">★</span>
              </label>
              <label>
                <input type="radio" name="stars" value="3" />
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
              </label>
              <label>
                <input type="radio" name="stars" value="4" />
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
              </label>
              <label>
                <input type="radio" name="stars" value="5" />
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
                <span className="icon">★</span>
              </label>
            </div>
          </div>
          <div>
            <input
              type="text"
              className="form-control focus:border-themeOrange rounded-2xl border-2 "
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              className="form-control focus:border-themeOrange rounded-2xl border-2"
              placeholder="Email "
              required
            />
          </div>
          <div>
            <textarea
              className="form-control focus:border-themeOrange rounded-2xl border-2"
              placeholder="Review "
            ></textarea>
          </div>
          <div className="rating-wrapper">
            <div className="submit">
              <button
                type="submit"
                className="bg-themeOrange px-4 p-2 text-white rounded-full"
              >
                Post Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
