import {createContext, useState, useReducer} from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
   items: [],
   addItemToCart: () => {},
   updateItemQuantity: () => {}
});

// fonction for the reducer
function shoppingCartreducer(state, action) {
    if(action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];
    
          const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
          );
          const existingCartItem = updatedItems[existingCartItemIndex];
    
          if (existingCartItem) {
            const updatedItem = {
              ...existingCartItem,
              quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
          } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
              id: action.payload,
              name: product.title,
              price: product.price,
              quantity: 1,
            });
          }
    
          return {
            ...state, //not needed here because we have only one value
            items: updatedItems,
          };
       
    }

    if(action.type === 'UDAPTE_ITEM') {
        const updatedItems = [...state.items];
          const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id ===  action.payload.productId
          );
    
          const updatedItem = {
            ...updatedItems[updatedItemIndex],
          };
    
          updatedItem.quantity += action.payload.amount;
    
          if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
          } else {
            updatedItems[updatedItemIndex] = updatedItem;
          }
    
          return {
            ...state,
            items: updatedItems,
          };
    }
    return state;
}

// contient all our code in the app.jsx
export default function CartContextProvider({children}) {
    // on utilise use pour reduire le code i guess

    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartreducer,
        {
            items: []
        }
    );

    // we don't need this state because we useReducer
   /*  const [shoppingCart, setShoppingCart] = useState({
        items: [],
      }); */
    
      function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM',
            payload: id
        });

        
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UDAPTE_ITEM',
            payload:{
                productId,
                amount
            }
        });
      }
    
    // value to store the context
    const valueCTX = {
      items : shoppingCartState.items,
      addItemToCart : handleAddItemToCart,
      updateItemQuantity: handleUpdateCartItemQuantity
    };

    return <CartContext.Provider value={valueCTX}>
        {children}
    </CartContext.Provider>
}