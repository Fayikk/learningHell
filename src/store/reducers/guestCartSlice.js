import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    cartCounter: 0
};

const guestCartSlice = createSlice({
    name: "guestCart",
    initialState,
    reducers: {
        addToGuestCart: (state, action) => {
            // Ürün zaten sepette var mı kontrol et
            const existingItem = state.items.find(item => item.courseId === action.payload.courseId);
            if (!existingItem) {
                state.items.push(action.payload);
                state.cartCounter = state.items.length;
                
                // LocalStorage'a kaydet
                localStorage.setItem('guestCart', JSON.stringify(state.items));
            }
        },
        removeFromGuestCart: (state, action) => {
            state.items = state.items.filter(item => item.courseId !== action.payload);
            state.cartCounter = state.items.length;
            
            // LocalStorage'ı güncelle
            localStorage.setItem('guestCart', JSON.stringify(state.items));
        },
        clearGuestCart: (state) => {
            state.items = [];
            state.cartCounter = 0;
            localStorage.removeItem('guestCart');
        },
        initializeGuestCart: (state) => {
            // LocalStorage'dan sepeti yükle
            const savedCart = localStorage.getItem('guestCart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                state.items = parsedCart;
                state.cartCounter = parsedCart.length;
            }
        }
    }
});

export const { addToGuestCart, removeFromGuestCart, clearGuestCart, initializeGuestCart } = guestCartSlice.actions;
export default guestCartSlice.reducer;
