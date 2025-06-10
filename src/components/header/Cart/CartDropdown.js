import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetShoppingCartQuery } from '../../../api/shoppingCartApi';
import './CartDropdown.css';

const CartDropdown = ({ show, onClose }) => {
    const { data } = useGetShoppingCartQuery();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (data && data.result) {
            setCourses(data.result.courses || []);
        }
    }, [data]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="cart-dropdown">
            <div className="cart-dropdown-content">
                {courses.map((course) => (
                    <div key={course.courseId} className="cart-item">
                        <img 
                            src={course.courseImage} 
                            alt={course.courseName} 
                            className="cart-item-image"
                        />
                        <div className="cart-item-details">
                            <p className="cart-item-name">{course.courseName}</p>
                            <p className="cart-item-price">${course.price}</p>
                        </div>
                    </div>
                ))}
                <Link to="/cart" className="go-to-cart-btn">
                    Go to Cart
                </Link>
            </div>
        </div>
    );
};

export default CartDropdown;
