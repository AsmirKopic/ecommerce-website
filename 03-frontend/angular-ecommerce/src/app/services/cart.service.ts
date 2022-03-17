import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Array of cart items
  cartItems: CartItem[] = [];

  // Subject - subclass of Observable
  // we use Subject to publish event in our code
  // event will be sent to all of the subscribers
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0) {

      // find the item in the cart based on item id
      // for (let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      // find the item in the cart based on item id usind .find() method
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

      // check if we fount it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    // add item to the cart
    if(alreadyExistsInCart) {
      // increment the quantity of item
      existingCartItem.quantity++;
    }
    else{
      // add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantyValue = 0;

    // loop cartItems list and calculate te values
    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantyValue += currentCartItem.quantity;
    }

    // publish the new values
    // all subscribers will receive the new data
    // .next(..) -> publish/send event
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantyValue);

    // log cart data (for debugging)
    this.logCartData(totalPriceValue, totalQuantyValue);
  }

  logCartData(totalPriceValue: number, totalQuantyValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity= ${tempCartItem.quantity},
                  unitPrice=${tempCartItem.unitPrice}, subtotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantyValue}`) 
  }
}
