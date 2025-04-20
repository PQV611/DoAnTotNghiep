import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  quantity: number = 1 ;
  
  increase(){
    this.quantity++ ;
  }

  decrease(){
    if(this.quantity > 0) this.quantity--;
  }
}
