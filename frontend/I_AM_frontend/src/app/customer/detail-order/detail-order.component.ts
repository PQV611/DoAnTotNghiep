import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { OrdercustomerService, OrderDetailResponse, OrderHistory } from 'src/app/services/ordercustomer.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css']
})
export class DetailOrderComponent implements OnInit{
  fullName: string = '';
  avatar: string = '';
  orderId!: number;
  orderDetail: OrderDetailResponse | null = null;

  constructor(private route:ActivatedRoute, private orderService: OrdercustomerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.fullName = res.fullName;
        this.avatar = res.avatar;
      },
      error: (err) => {
        this.fullName = 'Không xác định';
        console.error(err);
      }
    });

    this.orderId = +this.route.snapshot.params['id'];
    this.loadOrderDetail();
  }

  loadOrderDetail(): void {
    this.orderService.getOrderDetail(this.orderId).subscribe({
      next: (res) => {
        this.orderDetail = res;
        console.log('Chi tiết đơn hàng:', this.orderDetail);
      },
      error: (err) => {
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      }
    });
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Chờ phê duyệt',
      2: 'Đang giao hàng',
      3: 'Giao hàng thành công',
      4: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
  }

  getStatusIcon(status?: number): string {
    switch (status) {
      case 1: return 'bi bi-arrow-repeat';
      case 2: return 'bi bi-truck';
      case 3: return 'bi bi-check-circle';
      case 4: return 'bi bi-x-circle';
      default: return 'bi bi-question-circle';
    }
  }

  getStatusColor(status?: number): string {
    if (status === 1 || status === 4) return 'red';
    if (status === 2 || status === 3) return 'green';
    return 'black';
  }

  cancelOrder(): void {
    if (confirm('Bạn có chắc muốn huỷ đơn hàng này?')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: () => {
          alert('Huỷ đơn hàng thành công!');
          this.loadOrderDetail(); // reload lại
        },
        error: (err) => {
          console.error('Lỗi khi huỷ đơn:', err);
          alert('Không thể huỷ đơn hàng!');
        }
      });
    }
  }

  confirmReceived(): void {
    if (confirm('Bạn đã nhận được hàng?')) {
      this.orderService.confirmReceived(this.orderId).subscribe({
        next: () => {
          alert('Xác nhận đã nhận hàng thành công!');
          this.loadOrderDetail();
        },
        error: (err) => {
          console.error('Lỗi khi xác nhận:', err);
          alert('Không thể xác nhận nhận hàng!');
        }
      });
    }
  }

}
