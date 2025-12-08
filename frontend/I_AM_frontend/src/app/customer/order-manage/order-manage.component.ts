import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrdercustomerService, OrderHistory } from 'src/app/services/ordercustomer.service';

@Component({
  selector: 'app-order-manage',
  templateUrl: './order-manage.component.html',
  styleUrls: ['./order-manage.component.css']
})
export class OrderManageComponent implements OnInit{
  fullName:string = '';
  avatar:string ='';
  orders: OrderHistory[] = [];
  constructor(private authService:AuthService, private orderService:OrdercustomerService){}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.fullName = res.fullName;
        this.avatar = res.avatar ;
        console.log("Fullname: ", this.fullName);
        this.loadOrders();
      },
      error: (err) => {
        this.fullName = 'Không xác định'
        console.error(err);
      }
    });
  }

  getStatusText(status: number): string {
  switch (status) {
    case 1: return 'Chờ phê duyệt';
    case 2: return 'Đang giao hàng';
    case 3: return 'Giao hàng thành công';
    case 4: return 'Đã huỷ';
    default: return 'Không xác định';
  }
}

getStatusColorClass(status: number): string {
  return (status === 1 || status === 4) ? 'text-danger' : 'text-success';
}



  loadOrders(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (res) => {
        this.orders = res;
        console.log('Danh sách đơn hàng:', this.orders);
      },
      error: (err) => {
        console.error('Lỗi khi tải đơn hàng:', err);
      }
    });
  }
}
