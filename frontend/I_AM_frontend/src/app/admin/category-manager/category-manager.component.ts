import { Component } from '@angular/core';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent {
  searchTerm: string = '';
  categories = [
    { id: 1, name: 'Áo thun' },
    { id: 2, name: 'Quần jean' },
    { id: 3, name: 'Giày thể thao' }
  ];
  // Modal
  isModalOpen: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  modalCategoryName: string = '';
  editingCategoryId: number | null = null;
  // Thêm biến mới cho modal xoá
  isDeleteModalOpen: boolean = false;
  categoryToDeleteId: number | null = null;

  get filteredCategories() {
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addCategory(): void {
    console.log('CLICKED ADD'); // kiểm tra
    this.modalMode = 'add';
    this.modalCategoryName = '';
    this.isModalOpen = true;
    console.log('isModalOpen:', this.isModalOpen); // xem log
  }

  editCategory(id: number): void {
    const cat = this.categories.find(c => c.id === id);
    if (cat) {
      this.modalMode = 'edit';
      this.modalCategoryName = cat.name;
      this.editingCategoryId = id;
      this.isModalOpen = true;
    }
  }

  deleteCategory(id: number): void {
    const confirmDelete = confirm('Bạn có chắc muốn xoá danh mục này?');
    if (confirmDelete) {
      this.categories = this.categories.filter(c => c.id !== id);
    }
  }

  // Lưu danh mục (thêm hoặc sửa)
  saveCategory(): void {
    if (this.modalMode === 'add') {
      const newId = Math.max(...this.categories.map(c => c.id)) + 1;
      this.categories.push({ id: newId, name: this.modalCategoryName });
    } else if (this.modalMode === 'edit' && this.editingCategoryId !== null) {
      const index = this.categories.findIndex(c => c.id === this.editingCategoryId);
      if (index !== -1) {
        this.categories[index].name = this.modalCategoryName;
      }
    }
    this.closeModal();
  }

  // Đóng modal
  closeModal(): void {
    this.isModalOpen = false;
    this.modalCategoryName = '';
    this.editingCategoryId = null;
  }

  // Khi bấm nút xoá
confirmDelete(id: number): void {
  this.categoryToDeleteId = id;
  this.isDeleteModalOpen = true;
}

// Thực hiện xoá
deleteCategory2(): void {
  if (this.categoryToDeleteId !== null) {
    this.categories = this.categories.filter(c => c.id !== this.categoryToDeleteId);
    this.categoryToDeleteId = null;
    this.isDeleteModalOpen = false;
  }
}

// Huỷ xoá
cancelDelete(): void {
  this.isDeleteModalOpen = false;
  this.categoryToDeleteId = null;
}
}
