import { Component } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  fromDate = '';
  toDate = '';
  searchTerm = '';
  activeTab: 'pending' | 'shipping' | 'completed' | 'cancelled' = 'pending';

  isDetailModalOpen = false;
  selectedOrder: any = null;

  orders = [
    {
      id: 'ORD001',
      customerId: 'KH001',
      address: '123 Đường A, Quận B',
      total: 1500000,
      method: 'VNPay',
      createdAt: '2025-05-01',
      status: 'pending',
      statusText: 'Đang chờ phê duyệt',
      products: [
        { name: 'Áo thun A', quantity: 2, price: 250000, imageUrl: 'assets/images/test-detail-P-1.jpg' },
        { name: 'Quần jean B', quantity: 1, price: 500000, imageUrl: 'assets/images/vay_test.webp' }
      ]
    },
    {
      id: 'ORD002',
      customerId: 'KH002',
      address: '456 Đường X, Quận Y',
      total: 2000000,
      method: 'Tiền mặt',
      createdAt: '2025-05-03',
      status: 'shipping',
      statusText: 'Đang giao hàng',
      products: [
        { name: 'Giày sneaker', quantity: 1, price: 2000000, imageUrl: 'assets/images/vay_test.webp' }
      ]
    },
    {
      id: 'ORD003',
      customerId: 'KH003',
      address: '789 Đường Z, Quận W',
      total: 1000000,
      method: 'VNPay',
      createdAt: '2025-05-04',
      status: 'completed',
      statusText: 'Giao hàng thành công',
      products: [
        { name: 'Áo sơ mi', quantity: 1, price: 1000000, imageUrl: 'assets/images/test-detail-P-1.jpg' }
      ]
    },
    {
      id: 'ORD004',
      customerId: 'KH004',
      address: '101 Đường Q, Quận K',
      total: 800000,
      method: 'Tiền mặt',
      createdAt: '2025-05-02',
      status: 'cancelled',
      statusText: 'Đã huỷ',
      products: [
        { name: 'Áo khoác', quantity: 1, price: 800000, imageUrl: 'assets/images/vay_test.webp' }
      ]
    }
  ];

  get filteredOrders() {
    let result = this.orders.filter(order => order.status === this.activeTab);
  
    // Ép kiểu ngày tạo về Date để so sánh chính xác
    if (this.fromDate) {
      const from = new Date(this.fromDate);
      result = result.filter(order => new Date(order.createdAt) >= from);
    }
  
    if (this.toDate) {
      const to = new Date(this.toDate);
      result = result.filter(order => new Date(order.createdAt) <= to);
    }
  
    if (this.searchTerm.trim()) {
      const keyword = this.searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(keyword) ||
        order.customerId.toLowerCase().includes(keyword)
      );
    }
  
    return result;
  }
  

  get countPendding(){
    return this.orders.filter(o => o.status === 'pending').length;
  }

  get countShipping() {
    return this.orders.filter(o => o.status === 'shipping').length;
  }

  get countCompleted() {
    return this.orders.filter(o => o.status === 'completed').length;
  }

  changeTab(tab: 'pending' | 'shipping' | 'completed' | 'cancelled') {
    this.activeTab = tab;
  }

  approveOrder(order: any) {
    order.status = 'shipping';
    order.statusText = 'Đang giao hàng';
  }

  rejectOrder(order: any) {
    order.status = 'cancelled';
    order.statusText = 'Đã huỷ';
  }

  markAsDelivered(order: any) {
    order.status = 'completed';
    order.statusText = 'Giao hàng thành công';
  }

  viewDetail(order: any) {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }
}
