import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartItemDetail, CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  fullname: string = '';
  phone: string = '';
  address: string = '';
  paymentMethod: number = 1; // mặc định là COD
  showCheckoutWarning: boolean = false;

  quantity: number = 1 ;
  totalQuantity: number = 0;

  totalCost: number = 0;
  totalItems: number = 0;
  TongTienHang: number = 0;
  cartItems: CartItemDetail[] = [];
  alertMessage: string = '';

  showAlert(message: string) {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 4000); // 4 giây tự ẩn
  }

  constructor(private authService:AuthService, private cartService: CartService) { }

  ngOnInit(): void {
    this.getCartTotalQuantity();
    this.cartService.getCartDetails().subscribe({
      next: (res) => {
        this.cartItems = res.items;
        this.totalCost = res.totalCost;
        this.totalItems = res.totalItems;
        this.TongTienHang = res.TongTienHang;
        console.log("cartItems", this.cartItems);
      },
      error: (err) => console.error('Lỗi khi lấy giỏ hàng:', err)
    });
    this.refreshCart();
  }

  increase(item: CartItemDetail): void {
  item.quantity++;
  this.updateQuantity(item);
}

decrease(item: CartItemDetail): void {
  if (item.quantity > 1) {
    item.quantity--;
    this.updateQuantity(item);
  }
}

updateQuantity(item: CartItemDetail): void {
  this.cartService.updateQuantity(item.productCode, item.color, item.size, item.quantity).subscribe({
    next: () => {
      console.log('Cập nhật số lượng thành công');
      this.refreshCart(); // reload lại để cập nhật totalCost v.v.
    },
    error: (err) => {
      console.error('Lỗi cập nhật số lượng:', err);
    }
  });
}

refreshCart(): void {
  this.cartService.getCartDetails().subscribe({
    next: (res) => {
      this.cartItems = res.items;
      this.totalCost = res.totalCost;
      this.totalItems = res.totalItems;
      this.TongTienHang = res.TongTienHang;
    },
    error: (err) => console.error('Lỗi khi làm mới giỏ hàng:', err)
  });
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

    removeItem(item: CartItemDetail): void {
      this.cartService.removeItem(item.productCode, item.color, item.size).subscribe({
        next: () => {
          // alert("Đã xoá sản phẩm khỏi giỏ hàng!");
          this.showAlert("Đã xoá sản phẩm khỏi giỏ hàng!") ;
          
          this.refreshCart();
          window.location.reload(); //  Tải lại trang để cập nhật giỏ hàng
          // this.ngOnInit(); // 🌀 Gọi lại để load lại toàn bộ giỏ
        },
        error: (err) => {
          console.error("Lỗi khi xoá:", err);
        }
      });
    }

    // Checkout
    checkout(): void {
      this.showCheckoutWarning = false; // Reset cảnh báo mỗi khi đặt hàng
      if (!this.fullname || !this.phone || !this.address) {
        this.showCheckoutWarning = true;
        return;
      }

      for (const item of this.cartItems) {
        if (item.quantity > item.QuantityOfProductVariant) {
          this.showAlert('Số lượng của sản phẩm ' + item.productName + ' không đủ trong kho!');
          console.error('Số lượng của sản phẩm ' + item.productName + ' không đủ trong kho!');
          return;
        }
      }

      const fullname = (document.getElementById('name') as HTMLInputElement)?.value;
      const phone = (document.getElementById('phone') as HTMLInputElement)?.value;
      const address = (document.getElementById('address') as HTMLInputElement)?.value;
      const paymentMethod = +(document.getElementById('method') as HTMLSelectElement)?.value;

      const data = { fullname, phone, address, paymentMethod };

      this.cartService.checkout(data).subscribe({
        next: (res) => {
          // alert('Đặt hàng thành công!');
          this.showAlert('Đặt hàng thành công!');
          // Optionally redirect:
          window.location.href = '/customer/order_manage';
        },
        error: (err) => {
          console.error('Lỗi đặt hàng:', err);
          // alert('Lỗi khi đặt hàng!');
          this.showAlert('Lỗi khi đặt hàng!') ;
        }
      });
    }

}
