import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Features = (props) => {

    useEffect(() => {
        const items = document.querySelectorAll('.wpo-features-area .features-wrap .feature-item-wrap');
        const handleHover = (el) => {
            items.forEach(item => {
                item.classList.remove('active');
                item.classList.add('item');
            });

            el.classList.add('active');
        };
        items.forEach(item => item.addEventListener('mouseenter', () => handleHover(item)));
        return () => {
            items.forEach(item => item.removeEventListener('mouseenter', () => handleHover(item)));
        };
    }, []);

    return (
        <section className="wpo-features-area">
            <div className="container-fluid">
                <div className="features-wrap">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                        <i className="fi flaticon-training-1"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">1250+ Courses</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                        <i className="fi flaticon-training-1"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">1250+ Courses</Link></h2>
                                        <p>We are providing best Courses. That help you be expert.</p>
                                        <Link onClick={ClickHandler} className="more" to="/course">Read More...</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap active">
                                <div className="feature-item">
                                    <div className="icon">
                                        <i className="fi flaticon-team"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">25k Students</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                        <i className="fi flaticon-team"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">25k Students</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                        <Link onClick={ClickHandler} className="more" to="/course">Read More...</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                        <i className="fi flaticon-video-lesson"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">500+ Free class</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                        <i className="fi flaticon-video-lesson"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">500+ Free class</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                        <Link onClick={ClickHandler} className="more" to="/course">Read More...</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12">
                            <div className="feature-item-wrap">
                                <div className="feature-item">
                                    <div className="icon">
                                        <i className="fi flaticon-training"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">250+ Mentors</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                    </div>
                                </div>
                                <div className="feature-item-hidden">
                                    <div className="icon">
                                        <i className="fi flaticon-training"></i>
                                    </div>
                                    <div className="feature-text">
                                        <h2><Link onClick={ClickHandler} to="/course">250+ Mentors</Link></h2>
                                        <p>We are providing best Courses. That help you be expert. </p>
                                        <Link onClick={ClickHandler} className="more" to="/course">Read More...</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features;