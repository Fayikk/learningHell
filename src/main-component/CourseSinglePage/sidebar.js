import React from 'react'
import { Link } from 'react-router-dom'
import blogs from '../../api/blogs'
import { Button } from 'reactstrap'
import { useAddShoppingCartItemMutation } from '../../api/shoppingCartApi'
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux'
import { cartStateUpdate } from '../../store/reducers/cartSlice'
import { MatchLocationToCurrency } from '../Extensions/MatchLocationToCurrency'
const Sidebar = (props) => {

    const [addBasketItem] = useAddShoppingCartItemMutation();
    const dispatch = useDispatch();


    console.log("trigger props",props)


    const addBasket = async () => {
        const shoppingCartModel = {
            courseId:props.CourseDetail.courseId
        }

       var response = await addBasketItem(shoppingCartModel)
        if (response && response.data.isSuccess) {
                dispatch(cartStateUpdate(response.data.result.item2))
                toast.success(response.data.messages[0])
        }
        else {
            if (response.data.errorMessages.length > 0) {
                toast.error(response.data.errorMessages[0])
                
            }
            else {
                toast.info(response.data.messages[0])

            }
        }
    }



    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }


    return (
<>

<h4 className=' rounded-md w-32 text-black p-3' > {MatchLocationToCurrency()} {props.CourseDetail.coursePrice} </h4>
        <button onClick={()=>addBasket()} className="bg-themeOrange rounded-md w-32 text-white p-2 ">
        Satın Al{" "}
      </button>
      </>




        //     <div className="blog-sidebar">
        //         <div className="widget features-widget">
        //             <div className="features-top">
        //                 {/* <h4>$80.20 <del>$94.99</del></h4> */}
                      
        //                 {/* <span> 5 days left!</span> */}
        //             </div>
        //             <div className="cart-btn">
        //                 <Button onClick={()=>addBasket()}  className="theme-btn-s3">Add to Cart</Button>
        //             </div>
        //             <ul>
        //                 <li>Duration: <span>20 Hours</span></li>
        //                 <li>Lessons: <span>24</span></li>
        //                 <li>Videos <span>10 Hours</span></li>
        //                 <li>Students: <span>Max 100</span></li>
        //                 <li>Language: <span> {props.CourseDetail.courseLanguage} </span></li>
        //                 <li>Skill Level <span>Advanced</span></li>
        //             </ul>
        //         </div>
        //         {/* <div className="widget recent-post-widget">
        //             <h3>Latest Course</h3>
        //             <div className="posts">
        //                 {blogs.map((blog, bl) => (
        //                     <div className="post" key={bl}>
        //                         <div className="img-holder">
        //                             <img src={blog.screens} alt="" />
        //                         </div>
        //                         <div className="details">
        //                             <h4><Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.title}</Link></h4>
        //                             <span className="date">{blog.create_at}</span>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div> */}
        //     </div>
        // </div>
    )
}

export default Sidebar;