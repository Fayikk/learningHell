import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetShoppingCartQuery } from '../../../api/shoppingCartApi';
import { useSelector } from 'react-redux';
import './CartDropdown.css';
import { MatchLocationToCurrency } from '../../../main-component/Extensions/MatchLocationToCurrency';
import { useTranslation } from 'react-i18next';

const CartDropdown = ({ show, onClose }) => {
    const { t } = useTranslation();
    const { data } = useGetShoppingCartQuery();
    const [courses, setCourses] = useState([]);
    const userDetail = useSelector((state) => state.authStore.nameIdentifier);
    const guestCart = useSelector((state) => state.guestCartStore);

    useEffect(() => {
        if (userDetail) {
            // Authenticated user - use server cart
            if (data && data.result) {
                setCourses(data.result.courses || []);
            }
        } else {
            // Guest user - use guest cart
            setCourses(guestCart.items || []);
        }
    }, [data, userDetail, guestCart]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const calculateTotal = () => {
        return courses.reduce((total, course) => total + course.coursePrice, 0);
    };


    console.log(userDetail, "userDetail");

    if (!show) return null;

    return (
        <div className="mini-cart-content" style={{ right: show ? '0' : '-320px', opacity: show ? '1' : '0', visibility: show ? 'visible' : 'hidden' }}>
            <button onClick={onClose} className="mini-cart-close">×</button>
            <div className="mini-cart-items">
                {courses.length > 0 ? (
                    <>
                        {courses.map((course) => (
                            <div key={course.courseId} className="mini-cart-item">
                                <div className="mini-cart-item-image">
                                    <img src={course.courseImage} alt={course.courseName} />
                                </div>
                                <div className="mini-cart-item-des">
                                    <Link to={`/course/${course.courseId}`} onClick={onClose}>
                                        {course.courseName}
                                    </Link>
                                    <span className="mini-cart-item-price">
                                        {MatchLocationToCurrency()}{course.coursePrice}
                                    </span>
                                </div>
                            </div>
                        ))}                            <div className="mini-cart-action">
                            <span className="mini-checkout-price">
                                {t("Total")}: {MatchLocationToCurrency()}{calculateTotal()}
                            </span>
                            <div className="mini-btn">
                                <Link to="/cart" onClick={onClose} className="theme-btn">
                                    {t("View Cart")}
                                </Link>
                                {                                    !userDetail ? (
                                        <Link 
                                            to={`/login?returnUrl=${encodeURIComponent('/cart')}`} 
                                            onClick={onClose} 
                                            className="theme-btn theme-btn-s2"
                                        >
                                            {t("Sign in to Checkout")}
                                        </Link>
                                    ) : ""
                                }

                            </div>
                        </div>
                    </>                ) : (
                    <div className="empty-cart">
                        <p>{t("Your cart is empty")}</p>
                        <Link to="/course-3" onClick={onClose} className="theme-btn">
                            {t("Browse Courses")}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDropdown;
