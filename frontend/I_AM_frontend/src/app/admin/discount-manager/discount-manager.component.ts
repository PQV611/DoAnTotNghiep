import { Component, OnInit } from '@angular/core';
import { DiscountService, DiscountDTO } from 'src/app/services/discount.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-discount-manager',
  templateUrl: './discount-manager.component.html',
  styleUrls: ['./discount-manager.component.css']
})
export class DiscountManagerComponent implements OnInit {
  discounts: DiscountDTO[] = [];
  searchTerm = '';
  selectedStatus: 'all' | 'valid' | 'expired' = 'all';

  currentPage = 0;
  totalPages = 0;
  pageSize:number = 6;

  isModalOpen = false;
  isDeleteModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';

  modalProductId = '';
  modalDiscountCode = '';
  modalToDate = '';
  itemToEdit: DiscountDTO | null = null;
  itemToDelete: DiscountDTO | null = null;

  errors: any = {};

  constructor(private discountService: DiscountService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}


  loadDiscounts(page = 0): void {
    this.discountService.getDiscountsFiltered(this.searchTerm, this.selectedStatus, page, this.pageSize).subscribe({
      next: (res) => {
        console.log('MÃ GIẢM GIÁ NHẬN ĐƯỢC:', res);
        this.discounts = res.content;
        console.log('DỮ LIỆU CẦN HIỂN THỊ:', this.discounts);
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
      },
        error: (err) => {
        this.discounts = err.content;
        this.currentPage = err.number;
        this.totalPages = err.totalPages;
        }
    });
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadDiscounts(page);
    }
  }

  onSearchChange(): void {
    this.loadDiscounts(0);
  }

  onStatusChange(): void {
    this.loadDiscounts(0);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.modalProductId = '';
    this.modalDiscountCode = '';
    this.modalToDate = '';
    this.errors = {};
    this.isModalOpen = true;
  }

  editDiscount(item: DiscountDTO): void {
    this.modalMode = 'edit';
    this.itemToEdit = item;
    this.modalProductId = item.id_product.toString();
    this.modalDiscountCode = item.numberDiscount.toString();
    this.modalToDate = item.endDate.split('T')[0];
    this.errors = {};
    this.isModalOpen = true;
  }

  saveDiscount(): void {
    this.errors = {};
  
    // Check trống
    if (!this.modalProductId) this.errors.productId = 'Vui lòng nhập mã sản phẩm';
    if (!this.modalDiscountCode) this.errors.discountCode = 'Vui lòng nhập mã giảm giá';
    if (!this.modalToDate) this.errors.toDate = 'Vui lòng nhập ngày hết hạn';
  
    // Check đã tồn tại productId nếu đang thêm mới
    if (this.modalMode === 'add') {
      const exists = this.discounts.some(d => d.id_product === +this.modalProductId);
      if (exists) this.errors.productId = 'Mã sản phẩm đã tồn tại';
    }
  
    // Check số giảm giá
    const discountValue = +this.modalDiscountCode;
    if (discountValue < 0 || discountValue > 100) {
      this.errors.discountCode = 'Giảm giá phải nằm trong khoảng 0 - 100';
    }
  
    // Check ngày hết hạn không nhỏ hơn hôm nay
    const selectedDate = new Date(this.modalToDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      this.errors.toDate = 'Ngày hết hạn không được nhỏ hơn hôm nay';
    }
  
    // Nếu có lỗi thì không lưu
    if (Object.keys(this.errors).length > 0) return;
  
    const discount: DiscountDTO = {
      id_product: +this.modalProductId,
      name_product: '',
      numberDiscount: discountValue,
      endDate: this.modalToDate + 'T00:00:00',
      isActive: true
    };
  
    if (this.modalMode === 'add') {
      this.discountService.create(discount).subscribe({
        next: () => {
          this.showAlert('Thêm mã giảm giá thành công');
          this.closeModal();
          this.loadDiscounts(this.currentPage);
        },
        error: (err) => {
          const msg = err.error?.message || 'Không tồn tại mã sản phẩm';
          this.showAlert(msg);  // => hiển thị lỗi do backend trả về
        }
      });
    } else if (this.modalMode === 'edit') {
      this.discountService.update(discount).subscribe(() => {
        this.showAlert('Cập nhật mã giảm giá thành công');
        this.closeModal();
        this.loadDiscounts(this.currentPage);
      });
    }
  }
  

  confirmRemoveDiscount(item: DiscountDTO): void {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  removeDiscount(): void {
    if (this.itemToDelete) {
      this.discountService.delete(this.itemToDelete.id_product).subscribe(() => {
        this.showAlert('Xoá mã giảm giá thành công');
        this.cancelRemoveDiscount();
        this.loadDiscounts(this.currentPage);
      });
    }
  }

  cancelRemoveDiscount(): void {
    this.itemToDelete = null;
    this.isDeleteModalOpen = false;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalProductId = '';
    this.modalDiscountCode = '';
    this.modalToDate = '';
    this.itemToEdit = null;
    this.errors = {};
  }

  getStatus(item: DiscountDTO): string {
    if (!item.endDate) return 'Không có mã';
    const today = new Date().toISOString().split('T')[0];
    return item.endDate >= today ? 'Còn hiệu lực' : 'Hết hạn';
  }

  getStatusClass(item: DiscountDTO): string {
    const status = this.getStatus(item);
    return status === 'Còn hiệu lực' ? 'status-valid' : status === 'Hết hạn' ? 'status-expired' : '';
  }
}
