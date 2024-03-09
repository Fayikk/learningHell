import React, { Fragment,useEffect,useState } from "react";
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import { Button, Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { totalPrice } from "../../utils";
import Footer from "../../components/footer/Footer";
import { useGetShoppingCartQuery, useRemoveShoppingCartItemMutation } from "../../api/shoppingCartApi";
import { useSelector } from "react-redux";

const CartPage = (props) => {

  const authenticationState = useSelector((state) => state.authStore);
  const {data,isLoading} = useGetShoppingCartQuery(authenticationState.nameIdentifier);
  const [removeCartItem] = useRemoveShoppingCartItemMutation();
  const [courses,setCourses] = useState();

  useEffect(()=>{
    if (data) {
        setCourses(data.result.courses)
    }
  },[data])


  if (isLoading || !courses) {
    
  }

  const removeFromCart = async (courseId) => {
    console.log("trigger remove from cart")
    console.log(courseId)
    var response = await removeCartItem(courseId);
    console.log("response")
    console.log(response);
  }


  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const { carts } = props;

  return (
    <Fragment>
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
                                  <li>Brand : {courseItem.courseName}</li>
                                  <li>Size : {courseItem.courseName}</li>
                                </ul>
                              </td>
                              {/* <td className="stock">
                                <div className="pro-single-btn">
                                  <Grid className="quantity cart-plus-minus">
                                    <Button
                                      className="dec qtybutton"
                                      onClick={() =>
                                        props.decrementQuantity(catItem.id)
                                      }
                                    >
                                      -
                                    </Button>
                                    <input value={catItem.qty} type="text" />
                                    <Button
                                      className="inc qtybutton"
                                      onClick={() =>
                                        props.incrementQuantity(catItem.id)
                                      }
                                    >
                                      +
                                    </Button>
                                  </Grid>
                                </div>
                              </td> */}
                              <td className="ptice">${courseItem.coursePrice}</td>
                              <td></td>
                              {/* <td className="stock">${catItem.qty * catItem.price}</td> */}
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
                          ))}
                      </tbody>
                    </table>
                  </form>
                  {/* <div className="submit-btn-area">
                    <ul>
                      <li>
                        <Link
                          onClick={ClickHandler}
                          className="theme-btn"
                          to="/shop"
                        >
                          Continue Shopping{" "}
                        </Link>
                      </li>
                      <li>
                        <button type="submit">Update Cart</button>
                      </li>
                    </ul>
                  </div>
                  <div className="cart-product-list">
                    <ul>
                      <li>
                        Total product<span>( {carts.length} )</span>
                      </li>
                      <li>
                        Sub Price<span>${totalPrice(carts)}</span>
                      </li>
                      <li>
                        Vat<span>$0</span>
                      </li>
                      <li>
                        Eco Tax<span>$0</span>
                      </li>
                      <li>
                        Delivery Charge<span>$0</span>
                      </li>
                      <li className="cart-b">
                        Total Price<span>${totalPrice(carts)}</span>
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
                  </div> */}
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
};


export default CartPage
