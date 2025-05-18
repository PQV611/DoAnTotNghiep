import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  isDetailModalOpen = false;

  selectedStatus = 0; // 0 = tất cả
  pageSize = 6;
  currentPage = 0;
  totalPages = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}

  loadOrders(): void {
    const params = new HttpParams()
      .set('status', this.selectedStatus.toString())
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    this.http.get<any>('http://localhost:8080/admin/order', { params }).subscribe(res => {
      this.orders = res.content;
      this.totalPages = res.totalPages;
      this.currentPage = res.number;
    });
  }

  changeStatus(status: number): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadOrders();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadOrders();
  }

  approveOrder(order: any): void {
    this.http.put(`http://localhost:8080/admin/order/${order.idOrder}/approve`, {}).subscribe(() => {
      this.showAlert('Phê duyệt đơn hàng thành công');
      this.loadOrders();
    });
  }

  rejectOrder(order: any): void {
    this.http.put(`http://localhost:8080/admin/order/${order.idOrder}/cancel`, {}).subscribe(() => {
      this.showAlert('Huỷ đơn hàng thành công');
      this.loadOrders();
    });
  }

  markAsDelivered(order: any): void {
    this.http.put(`http://localhost:8080/admin/order/${order.idOrder}/deliver`, {}).subscribe(() => {
      this.showAlert('Đánh dấu đã giao hàng thành công');
      this.loadOrders();
    });
  }

  viewDetail(order: any): void {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeDetailModal(): void {
    this.selectedOrder = null;
    this.isDetailModalOpen = false;
  }

  statusTextMap: { [key: number]: string } = {
    1: 'Chờ phê duyệt',
    2: 'Đang giao hàng',
    3: 'Giao hàng thành công',
    4: 'Đã huỷ'
  };

  getStatusText(status: number): string {
    return this.statusTextMap[status] || 'Không xác định';
  }
}
