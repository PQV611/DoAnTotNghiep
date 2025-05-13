import { Component } from '@angular/core';
import { Category, Color, ProductDTO, Size } from 'src/app/services/product-admin.service';
import { OnInit } from '@angular/core';
import { ProductAdminService } from 'src/app/services/product-admin.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent {
  
  constructor(private productService: ProductAdminService,  private cd: ChangeDetectorRef) {}

  categoryList : Category[] = [];
  isDeleteModalOpen: boolean = false;
  isDetailQuantity: boolean = false;
  productToDelete: any = null;
  isEditMode: boolean = false;
  productToEdit: any = null;
  productToDetail: any = null;
  modalName = '';
  modalColor = '';
  modalSize = '';
  modalDescription = '';
  modalQuantity: number = 0;
  modalPrice: number = 0;
  modalCategoryId = '';
  selectedImages: File[] = [];
  isModalOpen = false;
  errors: any = {};

  products: ProductDTO[] = [];
  currentPage = 0;
  totalPages = 0;
  pageSize = 6;
  searchTerm = '';
  selectedFilter: 'all' | 'top-rated' | 'best-seller' = 'all';
  sortPriceAsc = true;

  productVariants: { colorId: string, size: string, quantity: number }[] = [];

colorList: Color[] = [];
sizeList: Size[] = [];
alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}

addVariant() {
  this.productVariants.push({ colorId: '', size: 'S', quantity: 0 });
}

removeVariant(index: number) {
  this.productVariants.splice(index, 1);
}

getColorHex(colorId: string): string {
  const color = this.colorList.find(c => c.idColor === +colorId);
  console.log("mau:" + color);
  return color ? color.hexCode : '#fff'; // mặc định là trắng nếu không tìm thấy
  
}




  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadColors();
    this.loadSizes();
  }

  loadCategories() {
    this.productService.getCategories().subscribe(res => this.categoryList = res);
  }

  loadColors() {
    this.productService.getColors().subscribe(res => this.colorList = res);
  }
  
  loadSizes() {
    this.productService.getSizes().subscribe(res => this.sizeList = res);
  }

  loadProducts(page:number = 0): void {
    this.currentPage = page;
    this.productService.getProducts(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: res => {
        this.products = res.content;
        this.totalPages = res.totalPages;
        this.currentPage = res.number;
      },
      error: err => {
        console.error('Lỗi lấy sản phẩm:', err);
      }
    });
  }

  get filteredProducts() {
    let result = [...this.products];
    const keyword = this.searchTerm.toLowerCase();
    result = result.filter(p =>
      p.nameProduct.toLowerCase().includes(keyword)
    );
    switch (this.selectedFilter) {
      case 'top-rated':
        result = result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'best-seller':
        result = result.sort((a, b) => b.totalSold - a.totalSold);
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
    this.productVariants = [];
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
    if (files.length > 4) {
      this.errors.images = 'Chỉ được chọn tối đa 4 ảnh.';
      this.selectedImages = [];
      return;
    }
  
    this.selectedImages = Array.from(files);
    this.errors.images = null;
  
    // ✅ Gọi detectChanges để Angular update lại DOM ngay
    this.cd.detectChanges();
  }

  getImagePreview(file: File): string {
    return file ? URL.createObjectURL(file) : '';
  }
  

  saveProduct() {
    const formData = new FormData();
    formData.append('nameProduct', this.modalName);
    formData.append('description', this.modalDescription);
    formData.append('price', this.modalPrice.toString());
    formData.append('categoryId', this.modalCategoryId);
  
    // Thêm ảnh
    this.selectedImages.forEach(file => {
      formData.append('images', file);
    });
  
    // Lọc trùng biến thể
    const variantSet = new Set();
    const filteredVariants = this.productVariants.filter(v => {
      const key = `${v.colorId}-${v.size}`;
      if (variantSet.has(key)) return false;
      variantSet.add(key);
      return true;
    });
  
    // ✅ Bắt buộc stringify dạng text chứ KHÔNG dùng Blob
    formData.append('variants', JSON.stringify(
      filteredVariants.map(v => ({
        colorId: +v.colorId,
        sizeId: +v.size,
        quantity: +v.quantity
      }))
    ));
  
    const request = this.isEditMode && this.productToEdit
      ? this.productService.updateProduct(this.productToEdit.id, formData)
      : this.productService.addProduct(formData);
  
    request.subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: err => {
        console.error('Lỗi gửi sản phẩm:', err);
      }
    });
  }
  

  editProduct(product: any) {
    this.isEditMode = true;
    this.productToEdit = product;
    this.modalName = product.nameProduct;
    this.modalDescription = product.description;
    this.modalPrice = product.price;
    this.modalCategoryId = product.categoryId || '';
    this.selectedImages = [];
    this.errors = {};
    this.isModalOpen = true;
  
    // Chờ load xong màu và size rồi mới gọi API variant
    Promise.all([
      this.productService.getColors().toPromise().then(res => this.colorList = res!),
      this.productService.getSizes().toPromise().then(res => this.sizeList = res!)
    ]).then(() => {
      this.productService.getVariantsByProductId(product.id).subscribe(res => {
        this.productVariants = res.map(v => ({
          colorId: v.colorId,
          size: v.sizeId,
          quantity: v.quantity
        }));
      });
    });
  }

  
  confirmDelete(product: any) {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }
  
  deleteProduct() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.showAlert('Xóa sản phẩm thành công thành công');
          this.loadProducts();
          this.productToDelete = null;
          this.isDeleteModalOpen = false;
        },
        error: err => console.error('Lỗi xoá:', err)
      });
    }
  }

  confirmDetailQuantity(product: any) {
    this.productToDetail = product;
    this.productVariants = [];
  
    Promise.all([
      this.productService.getColors().toPromise().then(res => this.colorList = res!),
      this.productService.getSizes().toPromise().then(res => this.sizeList = res!)
    ]).then(() => {
      this.productService.getVariantsByProductId(product.id).subscribe(res => {
        this.productVariants = res.map(v => ({
          colorId: v.colorId,
          size: v.sizeId,
          quantity: v.quantity
        }));
        this.isDetailQuantity = true; // chỉ mở modal khi có dữ liệu
      });
    });
  }
  
  
  cancelDelete() {
    this.productToDelete = null;
    this.isDeleteModalOpen = false;
  }

  cancelDetailQuantity() {
    this.productToDetail = null;
    this.isDetailQuantity = false;
  }
  
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadProducts(page);
    }
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  onSearchChange() {
    this.loadProducts(0); // Tìm kiếm từ trang đầu
  }
  
  onFilterChange() {
    this.loadProducts(0); // Lọc từ trang đầu
  }
}
