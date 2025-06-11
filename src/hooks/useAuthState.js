import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAddShoppingCartItemMutation } from '../api/shoppingCartApi';
import { useDispatch } from 'react-redux';
import { cartStateUpdate } from '../store/reducers/cartSlice';
import { clearGuestCart } from '../store/reducers/guestCartSlice';
import { toast } from 'react-toastify';

export const useAuthState = () => {
    const authState = useSelector((state) => state.authStore);
    const guestCart = useSelector((state) => state.guestCartStore);
    const [addBasketItem] = useAddShoppingCartItemMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        const syncGuestCartWithBackend = async () => {
            if (authState.nameIdentifier && guestCart.items.length > 0) {
                // User just logged in and has items in guest cart
                try {
                    // Add each guest cart item to backend
                    for (const item of guestCart.items) {
                        const response = await addBasketItem({
                            courseId: item.courseId
                        });
                        
                        if (response.data && response.data.isSuccess) {
                            dispatch(cartStateUpdate(response.data.result.item2));
                        }
                    }
                    
                    // Clear guest cart after syncing
                    dispatch(clearGuestCart());
                    localStorage.removeItem('guestCart');
                    
                    toast.success('Cart items synchronized successfully');
                } catch (error) {
                    toast.error('Failed to synchronize cart items');
                }
            }
        };

        syncGuestCartWithBackend();
    }, [authState.nameIdentifier]); // Run when auth state changes

    return authState;
};
