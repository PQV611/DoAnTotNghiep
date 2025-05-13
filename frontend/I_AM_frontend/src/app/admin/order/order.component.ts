import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  changeTab(tab: 'pending' | 'shipping' | 'completed' | 'cancelled') {
    this.activeTab = tab;
    this.loadOrders();
  }

  loadOrders() {
    const endpointMap = {
      pending: '/admin/order/pending',
      shipping: '/admin/order/shipping',
      completed: '/admin/order/completed',
      cancelled: '/admin/order/cancelled'
    };
    const url = endpointMap[this.activeTab];
    this.http.get<any[]>(url).subscribe(data => {
      this.orders = data;
    });
  }

  approveOrder(order: any) {
    this.http.put(`/admin/order/${order.id}/approve`, {}).subscribe(() => this.loadOrders());
  }

  rejectOrder(order: any) {
    this.http.put(`/admin/order/${order.id}/cancel`, {}).subscribe(() => this.loadOrders());
  }

  markAsDelivered(order: any) {
    this.http.put(`/admin/order/${order.id}/deliver`, {}).subscribe(() => this.loadOrders());
  }

  viewDetail(order: any) {
    this.selectedOrder = order;
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedOrder = null;
  }

  get filteredOrders() {
    let result = this.orders;

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

  get countPendding() {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  get countShipping() {
    return this.orders.filter(o => o.status === 'shipping').length;
  }

  get countCompleted() {
    return this.orders.filter(o => o.status === 'completed').length;
  }
}
