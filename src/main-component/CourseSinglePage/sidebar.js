import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useAddShoppingCartItemMutation } from '../../api/shoppingCartApi';
import { cartStateUpdate } from '../../store/reducers/cartSlice';
import { MatchLocationToCurrency } from '../Extensions/MatchLocationToCurrency';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Sidebar = (props) => {
  const [addBasketItem] = useAddShoppingCartItemMutation();
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.authStore.nameIdentifier);

  console.log("trigger inner user detail",userDetail)

  const addBasket = async () => {

    if (userDetail==="") {
      toast.warning("You Must SignIn For Before  Add The Basket Item")
      return;
    }

    const shoppingCartModel = {
      courseId: props.courseDetail.courseId,
    };

    const response = await addBasketItem(shoppingCartModel);
    if (response && response.data.isSuccess) {
      dispatch(cartStateUpdate(response.data.result.item2));
      toast.success(response.data.messages[0]);
    } else {
      if (response.data.errorMessages.length > 0) {
        toast.error(response.data.errorMessages[0]);
      } else {
        toast.info(response.data.messages[0]);
      }
    }
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-black rounded-full p-4 bg-themeOrange px-3">
          {MatchLocationToCurrency()} {props.courseDetail.coursePrice}
        </span>
        <span className="text-black/75 text-[15px]">Language:</span>
        <span className="text-black/75 font-bold text-[15px]">
          {props.courseDetail.courseLanguage}
        </span>
      </div>
      <div className="flex justify-end items-center">
        <button className="theme-btn-s3" onClick={addBasket}>Add To Cart</button>
      </div>
    </div>
  );
};

export default Sidebar;
