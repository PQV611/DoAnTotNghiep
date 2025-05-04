import { Component } from '@angular/core';

@Component({
  selector: 'app-discount-manager',
  templateUrl: './discount-manager.component.html',
  styleUrls: ['./discount-manager.component.css']
})
export class DiscountManagerComponent {
  discounts = [
    { productId: 'SP01', productName: 'Áo thun', discountCode: 'GIA50', toDate: '2025-06-01' },
    { productId: 'SP02', productName: 'Quần jean', discountCode: 'SALE20', toDate: '2025-05-15' }
  ];

  searchTerm = '';
  selectedStatus: 'all' | 'valid' | 'expired' = 'all';
  isModalOpen = false;
  isDeleteModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';

  modalProductId = '';
  modalProductName = '';
  modalDiscountCode = '';
  modalToDate = '';
  itemToEdit: any = null;
  itemToDelete: any = null;

  errors: any = {};

  // get filteredDiscounts() {
  //   return this.discounts.filter(item =>
  //     item.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  openAddModal() {
    this.modalMode = 'add';
    this.modalProductId = '';
    this.modalProductName = '';
    this.modalDiscountCode = '';
    this.modalToDate = '';
    this.errors = {};
    this.isModalOpen = true;
  }

  editDiscount(item: any) {
    this.modalMode = 'edit';
    this.itemToEdit = item;
    this.modalProductId = item.productId;
    this.modalProductName = item.productName;
    this.modalDiscountCode = item.discountCode;
    this.modalToDate = item.toDate;
    this.errors = {};
    this.isModalOpen = true;
  }

  saveDiscount() {
    // Reset lỗi
    this.errors = {};
  
    // Kiểm tra các trường bắt buộc
    if (!this.modalProductId) this.errors.productId = 'Vui lòng nhập mã sản phẩm';
    // if (!this.modalProductName) this.errors.productName = 'Vui lòng nhập tên sản phẩm';
    if (!this.modalDiscountCode) this.errors.discountCode = 'Vui lòng nhập mã giảm giá';
    if (!this.modalToDate) this.errors.toDate = 'Vui lòng nhập ngày hết hạn';
  
    // Nếu có lỗi thì không lưu
    if (Object.keys(this.errors).length > 0) return;
  
    if (this.modalMode === 'add') {
      console.log('Lưu') ;
      // Thêm mới dòng mới
      this.discounts.push({
        productId: this.modalProductId,
        productName: this.modalProductName,
        discountCode: this.modalDiscountCode,
        toDate: this.modalToDate
      });
    } else if (this.modalMode === 'edit' && this.itemToEdit) {
      console.log('Lưu 1') ;
      // Cập nhật dữ liệu cũ
      this.itemToEdit.productId = this.modalProductId;
      this.itemToEdit.productName = this.modalProductName;
      this.itemToEdit.discountCode = this.modalDiscountCode;
      this.itemToEdit.toDate = this.modalToDate;
    }
  
    // Reset modal
    this.closeModal();
  }
  

  confirmRemoveDiscount(item: any) {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  removeDiscount() {
    if (this.itemToDelete) {
      this.itemToDelete.discountCode = '';
      this.itemToDelete.toDate = '';
    }
    this.cancelRemoveDiscount();
  }

  cancelRemoveDiscount() {
    this.itemToDelete = null;
    this.isDeleteModalOpen = false;
  }

  closeModal() {
    this.isModalOpen = false;
    this.itemToEdit = null;
    this.errors = {};
  }

  getStatus(item: any): string {
    if (!item.toDate) return 'Không có mã';
    const today = new Date().toISOString().split('T')[0];
    return item.toDate >= today ? 'Còn hiệu lực' : 'Hết hạn';
  }

  getStatusClass(item: any): string {
    const status = this.getStatus(item);
    return status === 'Còn hiệu lực' ? 'status-valid' :
           status === 'Hết hạn' ? 'status-expired' : '';
  }

  get filteredDiscounts() {
    const today = new Date().toISOString().split('T')[0];
  
    return this.discounts.filter(item => {
      const matchesSearch =
        item.productId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(this.searchTerm.toLowerCase());
  
      const status = item.toDate >= today ? 'valid' : 'expired';
      const matchesStatus =
        this.selectedStatus === 'all' || status === this.selectedStatus;
  
      return matchesSearch && matchesStatus;
    });
}
}
