import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useAddShoppingCartItemMutation } from "../../api/shoppingCartApi";
import { cartStateUpdate } from "../../store/reducers/cartSlice";
import { useNavigate } from "react-router-dom";
import CartDropdown from "../../components/header/Cart/CartDropdown";
import { MatchLocationToCurrency } from "../Extensions/MatchLocationToCurrency";
import { addToGuestCart } from "../../store/reducers/guestCartSlice";

const Sidebar = (props) => {
  const [addBasketItem] = useAddShoppingCartItemMutation();
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.authStore.nameIdentifier);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const addBasket = async () => {
    const courseDetail = props.courseDetail;

    if (userDetail === "") {
      // Guest user - add to guest cart
      dispatch(
        addToGuestCart({
          courseId: courseDetail.courseId,
          courseName: courseDetail.courseName,
          coursePrice: courseDetail.coursePrice,
          courseImage: courseDetail.courseImage,
        })
      );
      toast.success("Item added to guest cart");
      setShowDropdown(true);
      return;
    }

    // Authenticated user - add to server cart
    const shoppingCartModel = {
      courseId: courseDetail.courseId,
    };

    const response = await addBasketItem(shoppingCartModel);
    if (response && response.data.isSuccess) {
      dispatch(cartStateUpdate(response.data.result.item2));
      toast.success(response.data.messages[0]);
      setShowDropdown(true);
    } else {
      if (response.data.errorMessages.length > 0) {
        toast.error(response.data.errorMessages[0]);
      } else {
        toast.info(response.data.messages[0]);
      }
    }
  };

  return (
    <div className=" flex justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-black rounded-full p-4 bg-themeOrange px-3">
          {props.courseDetail.coursePrice === 0 ? (
            <span>free</span>
          ) : (
            <>
              <span>
                {MatchLocationToCurrency()}
                {props.courseDetail.coursePrice}
              </span>
            </>
          )}
        </span>
        <span className="text-black/75 text-[15px]">Language:</span>
        <span className="text-black/75 font-bold text-[15px]">
          {props.courseDetail.courseLanguage}
        </span>
      </div>
      <div className="flex justify-end items-center">
        <button className="theme-btn-s3" onClick={addBasket}>
          Add To Cart
        </button>
      </div>
      <CartDropdown
        show={showDropdown}
        onClose={() => setShowDropdown(false)}
      />
    </div>
  );
};

export default Sidebar;
