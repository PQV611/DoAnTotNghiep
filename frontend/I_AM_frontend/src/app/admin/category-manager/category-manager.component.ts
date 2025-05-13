import { Component, OnInit } from '@angular/core';
import { CategoriesService, CategoryDTO } from 'src/app/services/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  searchTerm: string = '';
  categories: CategoryDTO[] = [];
  errors: any = {};

  // Pagination
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  // Modal
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  modalCategoryName = '';
  editingCategoryId: number | null = null;

  // Modal xoá
  isDeleteModalOpen = false;
  categoryToDeleteId: number | null = null;

  constructor(
    private categoryService: CategoriesService,
    private toastr: ToastrService
  ) {}

  loadPage(page: number): void {
    this.categoryService.getPage(page, this.pageSize).subscribe(res => {
      this.categories = res.content;
      this.currentPage = res.number;
      this.totalPages = res.totalPages;
    });
  }

  ngOnInit(): void {
    this.loadCategories(0);
    this.loadPage(0);
  }
  alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}


  get filteredCategories() {
    return this.categories.filter(c =>
      (c.name_category || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i);
  }
  

  loadCategories(page: number = 0): void {
    this.categoryService.getCategoriesFiltered(this.searchTerm, page, this.pageSize).subscribe({
      next: res => {
        console.log('DANH MỤC NHẬN ĐƯỢC:', res);
        this.categories = res.content;
        console.log('DỮ LIỆU CẦN HIỂN THỊ:', this.categories);
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
      },
      error: err => {
        console.error('LỖI GỌI API:', err);
      }
    });
  }

  addCategory(): void {
    this.modalMode = 'add';
    this.modalCategoryName = '';
    this.isModalOpen = true;
    this.errors = {}; // Reset lỗi
  }

  editCategory(id: number): void {
    const cat = this.categories.find(c => c.id_category === id);
    if (cat) {
      this.modalMode = 'edit';
      this.modalCategoryName = cat.name_category;
      this.editingCategoryId = id;
      this.isModalOpen = true;
      this.errors = {}; // Reset lỗi
    }
  }

  saveCategory(): void {
    this.errors = {}; // Reset lỗi
    // if (!this.modalName) this.errors.name = 'Vui lòng nhập tên sản phẩm';
    // if (!this.modalDescription) this.errors.description = 'Vui lòng nhập mô tả';
    // if (!this.modalQuantity || this.modalQuantity <= 0) this.errors.quantity = 'Số lượng không hợp lệ';
    // if (!this.modalPrice || this.modalPrice <= 0) this.errors.price = 'Giá không hợp lệ';
    // if (!this.modalCategoryId) this.errors.categoryId = 'Vui lòng chọn loại sản phẩm';
    // if (!this.isEditMode && (this.selectedImages.length === 0 || this.selectedImages.length > 5)) {
    //   this.errors.images = 'Chọn từ 1 đến 5 ảnh';
    // }
    if (!this.modalCategoryName) this.errors.name_category = 'Vui lòng nhập tên danh mục';
    if (Object.keys(this.errors).length > 0) return; // Nếu có lỗi thì không lưu
    if (this.modalMode === 'add') {
      this.categoryService.create({ name_category: this.modalCategoryName }).subscribe(() => {
        this.showAlert('Thêm danh mục thành công');
        this.closeModal();
        this.loadCategories();
      });
    } else if (this.modalMode === 'edit' && this.editingCategoryId !== null) {
      this.categoryService.update(this.editingCategoryId, {
        name_category: this.modalCategoryName
      }).subscribe(() => {
        this.showAlert('Cập nhật danh mục thành công');
        this.closeModal();
        this.loadCategories();
      });
    }
  }

  confirmDelete(id: number): void {
    this.categoryToDeleteId = id;
    this.isDeleteModalOpen = true;
  }

  deleteCategory2(): void {
    if (this.categoryToDeleteId !== null) {
      this.categoryService.delete(this.categoryToDeleteId).subscribe(() => {
        this.showAlert('Xoá danh mục thành công');
        this.loadCategories();
        this.isDeleteModalOpen = false;
        this.categoryToDeleteId = null;
      });
    }
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.categoryToDeleteId = null;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalCategoryName = '';
    this.editingCategoryId = null;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadCategories(page);
    }
  }
  onSearchChange(): void {
    this.loadCategories(0); // luôn về trang đầu khi lọc
  }
  
}
