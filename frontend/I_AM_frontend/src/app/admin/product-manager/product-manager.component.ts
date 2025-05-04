import { Component } from '@angular/core';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent {
  categoryList = [
    { id: 'CAT01', name: 'Áo thun' },
    { id: 'CAT02', name: 'Quần jean' },
    { id: 'CAT03', name: 'Giày dép' },
  ];

  isDeleteModalOpen: boolean = false;
  productToDelete: any = null;
  isEditMode: boolean = false;
  productToEdit: any = null;
  modalName = '';
  modalDescription = '';
  modalQuantity: number = 0;
  modalPrice: number = 0;
  modalCategoryId = '';
  selectedImages: File[] = [];
  isModalOpen = false;
  errors: any = {};

  products = [
    {
      productId: 'SP01',
      name: 'Áo thun basic',
      description: 'Chất liệu cotton thoáng mát',
      quantity: 10,
      sold: 20,
      rating: 4.0,
      price: 150000,
      imageUrl: 'assets/images/test-detail-P-1.jpg'
    },
    {
      productId: 'SP02',
      name: 'Váy jeans basic',
      description: 'Chất liệu cotton thoáng mát mát mát',
      quantity: 20,
      sold: 10,
      rating: 4.4,
      price: 160000,
      imageUrl: 'assets/images/vay_test.webp'
    }
  ];

  searchTerm = '';
  selectedFilter: 'all' | 'top-rated' | 'best-seller' = 'all';
  sortPriceAsc: boolean = true;

  get filteredProducts() {
    let result = [...this.products];
    const keyword = this.searchTerm.toLowerCase();
    result = result.filter(p =>
      p.productId.toLowerCase().includes(keyword) ||
      p.name.toLowerCase().includes(keyword)
    );
    switch (this.selectedFilter) {
      case 'top-rated':
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case 'best-seller':
        result = result.sort((a, b) => b.sold - a.sold);
        break;
      case 'all':
      default:
        result = result.sort((a, b) =>
          this.sortPriceAsc ? a.price - b.price : b.price - a.price
        );
        break;
    }
    return result;
  }

  togglePriceSort() {
    this.sortPriceAsc = !this.sortPriceAsc;
  }

  openAddModal() {
    this.isEditMode = false;
    this.productToEdit = null;
    this.modalName = '';
    this.modalDescription = '';
    this.modalQuantity = 0;
    this.modalPrice = 0;
    this.modalCategoryId = '';
    this.selectedImages = [];
    this.errors = {};
    this.isModalOpen = true;
  }
  

  closeModal() {
    this.isModalOpen = false;
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 5) {
      this.errors.images = 'Chỉ được chọn tối đa 5 ảnh.';
      this.selectedImages = [];
      return;
    }
    this.selectedImages = Array.from(files);
    this.errors.images = null;
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  saveProduct() {
    this.errors = {};
    if (!this.modalName) this.errors.name = 'Vui lòng nhập tên sản phẩm';
    if (!this.modalDescription) this.errors.description = 'Vui lòng nhập mô tả';
    if (!this.modalQuantity || this.modalQuantity <= 0) this.errors.quantity = 'Số lượng không hợp lệ';
    if (!this.modalPrice || this.modalPrice <= 0) this.errors.price = 'Giá không hợp lệ';
    if (!this.modalCategoryId) this.errors.categoryId = 'Vui lòng chọn loại sản phẩm';
    if (!this.isEditMode && (this.selectedImages.length === 0 || this.selectedImages.length > 5)) {
      this.errors.images = 'Chọn từ 1 đến 5 ảnh';
    }
  
    if (Object.keys(this.errors).length > 0) return;
  
    if (this.isEditMode && this.productToEdit) {
      this.productToEdit.name = this.modalName;
      this.productToEdit.description = this.modalDescription;
      this.productToEdit.quantity = this.modalQuantity;
      this.productToEdit.price = this.modalPrice;
      this.productToEdit.categoryId = this.modalCategoryId;
      // không update ảnh vì chưa có backend
    } else {
      const newProduct = {
        productId: 'SP' + (this.products.length + 1).toString().padStart(2, '0'),
        name: this.modalName,
        description: this.modalDescription,
        quantity: this.modalQuantity,
        sold: 0,
        rating: 0,
        price: this.modalPrice,
        imageUrl: 'assets/images/default.jpg',
        categoryId: this.modalCategoryId
      };
      this.products.push(newProduct);
    }
  
    this.closeModal();
  }
  

  editProduct(product: any) {
    this.isEditMode = true;
    this.productToEdit = product;
  
    this.modalName = product.name;
    this.modalDescription = product.description;
    this.modalQuantity = product.quantity;
    this.modalPrice = product.price;
    this.modalCategoryId = product.categoryId || '';
    this.selectedImages = []; // Nếu muốn load lại hình, cần upload backend
  
    this.errors = {};
    this.isModalOpen = true;
  }
  
  confirmDelete(product: any) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }
  
  deleteProduct() {
    if (this.productToDelete) {
      this.products = this.products.filter(p => p !== this.productToDelete);
      this.productToDelete = null;
      this.isDeleteModalOpen = false;
    }
  }
  
  cancelDelete() {
    this.productToDelete = null;
    this.isDeleteModalOpen = false;
  }
  
}
