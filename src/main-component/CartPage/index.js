import React, { Fragment,useEffect,useState } from "react";
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { totalPrice } from "../../utils";
import Footer from "../../components/footer/Footer";
import { useGetShoppingCartQuery, useRemoveShoppingCartItemMutation } from "../../api/shoppingCartApi";
import { useSelector } from "react-redux";
import {toast} from 'react-toastify'
import IsLoading from "../../components/Loading/IsLoading";
import { cartStateUpdate } from "../../store/reducers/cartSlice";
import { MatchLocationToCurrency } from "../Extensions/MatchLocationToCurrency";
import { Helmet } from "react-helmet";

const CartPage = (props) => {
  const { data, isLoading } = useGetShoppingCartQuery(
    useSelector((state) => state.authStore.nameIdentifier),
    {
      refetchOnMountOrArgChange: true, // Forces the query to refetch data when the component mounts
    }
  );
  
  const [removeCartItem] = useRemoveShoppingCartItemMutation();
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setCourses(data.result?.courses || []);
      let jsonSerializer = JSON.stringify(data.result?.courses);
      localStorage.setItem("basketItems", jsonSerializer);
    }
  }, [data]);

  if (isLoading || !courses) {
    return <IsLoading />;
  }

  const removeFromCart = async (courseId) => {
    var response = await removeCartItem(courseId);
    if (response) {
      dispatch(cartStateUpdate(response.data.result.item2));
      toast.success(response.data.messages[0]);
    }
  };

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
if (courses.length > 0) {
 
  return (
    <Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <PageTitle pageTitle={"Cart"} pagesub={"Cart"} />
    
        <div className="cart-area section-padding">
        <div className="container">
          <div className="form">
            <div className="cart-wrapper">
              <div className="row">
                <div className="col-12">
                  <form action="cart">
                    <table className="table-responsive cart-wrap">
                      <thead>
                        <tr>
                          <th className="images images-b">Image</th>
                          <th className="product-2">Product Name</th>
                          <th className="ptice">Price</th>
                          <th className="stock">Total Price</th>
                          <th className="remove remove-b">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses &&
                          courses.length > 0 &&
                          courses.map((courseItem, crt) => (
                            <tr key={crt}>
                              <td className="images">
                                <img src={courseItem.courseImage} alt="" />
                              </td>
                              <td className="product">
                                <ul>
                                  <li className="first-cart">
                                    {courseItem.courseName}
                                  </li>
                                  {/* <li>Brand : {courseItem.courseName}</li>
                                  <li>Size : {courseItem.courseName}</li> */}
                                </ul>
                              </td>
                              <td className="ptice"> {MatchLocationToCurrency()} {courseItem.coursePrice}</td>
                              <td></td>
                              <td className="action">
                                <ul>
                                  <li
                                    className="w-btn"
                                    onClick={() =>
                                      removeFromCart(courseItem.courseId)
                                    }
                                  >
                                    <i className="fi ti-trash"></i>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))
                          
                          
                          
                          }
                      </tbody>
                    </table>
                  </form>
                  <div className="cart-product-list">
                    <ul>
                      <li>
                        Total product<span>( {courses.length} )</span>
                      </li>
                      <li>
                        Total Price<span>{MatchLocationToCurrency()}{totalPrice(courses)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/checkout"
                        >
                          Proceed to Checkout{" "}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


  
      <Footer />
      <Scrollbar />
    </Fragment>
  ); 
}
else{
  return (
    <Fragment>
    <Helmet>
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <PageTitle pageTitle={"Cart"} pagesub={"Cart"} />
  
      <div className="cart-area section-padding">
      <div className="container">
        <div className="form">
          <div className="cart-wrapper">
            <div className="row">
              <div className="col-12">
                <form action="cart">
                <h1 style={{textAlign:"center"}} ><span  > You Dont Have Any Item </span></h1>
                  <table className="table-responsive cart-wrap">
                    <thead>
                      <tr>
                        <th className="images images-b">Image</th>
                        <th className="product-2">Product Name</th>
                        <th className="ptice">Price</th>
                        <th className="stock">Total Price</th>
                        <th className="remove remove-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <Footer />
    <Scrollbar />
  </Fragment>
  )
}
};


export default CartPage
