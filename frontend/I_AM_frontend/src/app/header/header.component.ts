import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchKeyword: string = '';
  totalQuantity: number = 0;
  cartItems: CartItem[] = [];
  totalCost: number = 0;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.getCartTotalQuantity();
    this.authService.getCartDetails().subscribe({
      next: (res) => {
        this.cartItems = res.items;
        this.totalCost = res.totalCost;
        console.log("ảnh: " + this.cartItems[0].imageUrl);
        console.log("gior hàng: ", this.cartItems);
      },
      error: (err) => {
        console.error('Lỗi khi lấy giỏ hàng:', err);
      }
    });
    console.log("totalQuantity: ", this.getCartTotalQuantity());
  }

  getCartTotalQuantity(): void {
      this.authService.getCartTotalQuantity().subscribe({
        next: (res) => {
          // Nếu backend trả về một số đơn giản: 5
          this.totalQuantity = res.totalQuantity;

          // Nếu backend trả về object { totalQuantity: 5 }, thì sửa dòng trên thành:
          // this.totalQuantity = res.totalQuantity;

          console.log("Tổng số lượng:", this.totalQuantity);
        },
        error: (err) => {
          console.error("Lỗi khi lấy tổng số lượng:", err);
          this.totalQuantity = 0;
        }
      });
    }


  onSubmitSearch(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/category'], {
        queryParams: { keyword: this.searchKeyword }
      });
    }
  }
  
  isCartOpen = false;

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart() {
    this.isCartOpen = false;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/homepage';
  }
}
