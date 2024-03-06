import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ts1 from '../../images/testimonial/thumb1.png'
import ts2 from '../../images/testimonial/thumb2.png'
import ts3 from '../../images/testimonial/thumb3.png'


import shape1 from '../../images/testimonial/shape-1.png'
import shape2 from '../../images/testimonial/shape-2.png'


const testimonial = [
    {
        id: '01',
        tImg: ts1,
        Des: "I can't express enough gratitude for the awesome experience I had during my education journey. As a beginner they support me as much possible.",
        Title: 'Robert Willum',
        Sub: "President of BPT",
    },
    {
        id: '02',
        tImg: ts2,
        Des: "I can't express enough gratitude for the awesome experience I had during my education journey. As a beginner they support me as much possible.",
        Title: 'Leslie Alexander',
        Sub: "President of TBP",
    },
    {
        id: '03',
        tImg: ts3,
        Des: "I can't express enough gratitude for the awesome experience I had during my education journey. As a beginner they support me as much possible.",
        Title: 'David Joy',
        Sub: "President of AML",
    },
    {
        id: '04',
        tImg: ts2,
        Des: "I can't express enough gratitude for the awesome experience I had during my education journey. As a beginner they support me as much possible.",
        Title: 'Leslie Alexander',
        Sub: "President of TBP",
    },
]

const Testimonial = (props) => {

    const settings = {
        dots: false,
        arrows: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: '0',
                    infinite: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                }
            }
        ]
    };


    return (
        <section className={`wpo-testimonial-section section-padding ${props.tsClass}`}>
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>Testimonials</small>
                    <h2>What Our Students
                        <span>
                            Says
                            <i className="shape">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127 50" fill="none">
                                    <path
                                        d="M93.7612 1.81784C66.465 0.219842 33.8091 5.17362 13.0789 17.0213C8.79185 19.613 4.89164 22.7583 3.51303 26.4753C2.63381 28.8599 3.0998 31.4212 4.73866 33.628C9.16992 39.3831 19.7047 42.2235 28.8345 44.0263C48.2459 47.5238 70.0346 48.2058 89.6377 44.9783C103.011 42.7895 123.633 36.7419 122.853 26.3414C122.325 18.3121 111.17 13.1321 100.413 10.3435C85.1589 6.42839 68.4696 5.04759 52.1074 4.91817C43.9412 4.90804 35.7909 5.85108 28.1364 7.66965C20.6472 9.49496 13.1053 12.0551 7.80009 15.9713C6.9156 16.6375 5.31367 15.8521 6.15947 15.1217C12.7835 9.99574 23.4255 6.67934 33.2429 4.81914C47.5143 2.12618 62.6896 2.92293 77.2231 4.23396C97.4486 6.23258 127.877 12.1328 126.259 28.3896C125.459 33.4367 119.995 37.6039 113.784 40.4769C96.4604 48.2317 73.388 50.0401 52.7598 48.9474C40.1518 48.2126 27.4066 46.7384 16.0173 43.0191C7.03166 40.0695 -0.636876 35.0786 0.0418796 28.1679C1.3185 18.1624 19.4022 10.7047 32.4199 6.91791C43.9271 3.58801 56.2749 1.48473 68.8037 0.556321C77.1545 -0.0581187 85.6161 -0.11101 93.9792 0.474171C94.5578 0.514683 94.9763 0.847786 94.913 1.21915C94.8514 1.58714 94.3362 1.85385 93.7612 1.81784Z" />
                                </svg>
                            </i>
                        </span>
                        About Us
                    </h2>
                </div>
                <div className="wpo-testimonial-wrap">
                    <div className="row align-items-center">
                        <div className="wpo-testimonial-items wpo-testimonial-active">
                            <Slider {...settings}>
                                {
                                    testimonial.map((tesmnl, tsm) => (
                                        <div className="wpo-testimonial-item" key={tsm}>
                                            <div className="wpo-testimonial-text">
                                                <div className="wpo-testimonial-text-btm">
                                                    <div className="wpo-testimonial-text-btm-img">
                                                        <img src={tesmnl.tImg} alt="" />
                                                    </div>
                                                    <div className="wpo-testimonial-text-btm-info">
                                                        <h3>{tesmnl.Title}</h3>
                                                        <span>{tesmnl.Sub}</span>
                                                    </div>
                                                </div>
                                                <ul>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li><i className="fi flaticon-star"></i></li>
                                                    <li>(5.0)</li>
                                                </ul>
                                                <i className="quote fi flaticon-right-quote-sign"></i>
                                                <p>“{tesmnl.Des}”</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Slider>

                        </div>
                    </div>
                </div>
            </div>
            <div className="shape-1"><img src={shape1} alt="" /></div>
            <div className="shape-2"><img src={shape2} alt="" /></div>
        </section>
    );
}

export default Testimonial;