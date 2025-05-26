import { Component } from '@angular/core';
import { ProductCategory, ShowcategoryService } from '../services/showcategory.service';
import { ActivatedRoute } from '@angular/router';
import { FavouriteService } from '../services/favourite.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  sizeList: string[] = ['S', 'M', 'L', 'XL'];
  colorList: string[] = ['#FF0000', '#0000FF', '#008000', '#000000'];
  selectedColor: string | null = null; // Biến lưu màu đang chọn
  products: ProductCategory[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  selectedCategoryId: number | null = null;   // lưu id danh mục được chọn
  selectedSize: string | null = null;
  searchKeyword: string | null = null; // lưu từ khóa tìm kiếm
  //Value range
  priceFrom: number = 0;
  priceTo: number = 10000000;

  maxPrice: number = 10000000;
  minPrice: number = 0;

  role = this.authService.getRoleFromToken()

  isDraggingLeft = false;
  isDraggingRight = false;

  isSizeVisible: boolean = false;
  isColorVisible: boolean = false;
  isPriceVisible: boolean = false;
  isSizeListOpenClick = false;
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  isSizeListOpen = false;

  toggleSizeList() {
    this.isSizeListOpen = !this.isSizeListOpen;
  }

  toggleSizeDisplay(): void {
    this.isSizeVisible = !this.isSizeVisible;
  }
  toggleColorDisplay(): void {
    this.isColorVisible = !this.isColorVisible;
  }
  togglePriceDisplay(): void {
    this.isPriceVisible = !this.isPriceVisible;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  toggleSizeListClick() {
    this.isSizeListOpenClick = !this.isSizeListOpenClick;
  }

  constructor(private route: ActivatedRoute,private showCategoryService: ShowcategoryService, private favouriteService: FavouriteService, private authService: AuthService) {}
  

  ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || null;
    const categoryId = +params['categoryId'] || null;
    
    this.selectedCategoryId = categoryId;
    console.log('Category ID:', this.selectedCategoryId);
    this.loadPage(0);
  });
    const leftHandle = document.querySelectorAll('.ui-slider-handle')[0] as HTMLElement;
    const rightHandle = document.querySelectorAll('.ui-slider-handle')[1] as HTMLElement;
    const slider = document.getElementById('slider-range') as HTMLElement;
  
    // Xử lý kéo tay trái
    leftHandle.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDraggingLeft = true;
      event.preventDefault();
    });
  
    // Xử lý kéo tay phải
    rightHandle.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDraggingRight = true;
      event.preventDefault();
    });
  
    document.addEventListener('mouseup', () => {
      this.isDraggingLeft = false;
      this.isDraggingRight = false;
      // this.onPriceRangeChanged();
    });
  
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDraggingLeft || this.isDraggingRight) {
        const rect = slider.getBoundingClientRect();
        let percent = ((event.clientX - rect.left) / rect.width) * 100;
    
        // Ép percent nằm trong 0% - 100%
        percent = Math.max(0, Math.min(100, percent));
    
        const value = Math.round((percent / 100) * this.maxPrice);
    
        if (this.isDraggingLeft) {
          this.priceFrom = Math.min(Math.max(this.minPrice, value), this.priceTo - 100000); // giới hạn từ min đến priceTo
          this.updatePriceDisplay();
          leftHandle.style.left = `${(this.priceFrom / this.maxPrice) * 100}%`;
          slider.querySelector('.ui-slider-range')!.setAttribute('style',
            `left: ${(this.priceFrom / this.maxPrice) * 100}%; width: ${((this.priceTo - this.priceFrom) / this.maxPrice) * 100}%`);
        }
    
        if (this.isDraggingRight) {
          this.priceTo = Math.max(Math.min(this.maxPrice, value), this.priceFrom + 100000); // giới hạn từ priceFrom đến max
          this.updatePriceDisplay();
          rightHandle.style.left = `${(this.priceTo / this.maxPrice) * 100}%`;
          slider.querySelector('.ui-slider-range')!.setAttribute('style',
            `left: ${(this.priceFrom / this.maxPrice) * 100}%; width: ${((this.priceTo - this.priceFrom) / this.maxPrice) * 100}%`);
        }
        // this.onPriceRangeChanged();
      }
    });
    
  }

  categoryNameMap: { [key: number]: string } = {
    1: 'Chân váy',
    2: 'Áo thun nữ',
    3: 'Áo sơ mi nữ',
    4: 'Chân váy Jeans',
    5: 'Chân váy chữ A',
    6: 'Chân váy nút chì',
    7: 'Quần dài nữ',
    8: 'Quần Jeans nữ',
    9: 'Quần short nữ',
    10: 'Set công sở',
    11: 'Áo polo nam',
    12: 'Áo thun nam',
    13: 'Áo sơ mi nam',
    14: 'Quần dài nam',
    16: 'Quần short nam',
    15 : 'Quần Jeans nam',
    17: 'Quần kaki nam',
    40: 'Hôm nay bạn là "Công chúa"',
    41: 'Hôm nay bạn muốn "Lịch sự"',
    42: 'Hôm nay bạn là "Hoàng tử"',
    43: 'Hôm nay bạn muốn "Thư giãn"',
    44: 'Hôm nay bạn sẽ là "Nhân viên xuất sắc"',
    45 : 'Hôm nay bạn sẽ là "Chủ tịch"',
    46: 'Hôm nay bạn sẽ là "Tổng tài"',
    47: 'Hôm nay bạn sẽ là "Người thành công"',
  };

  getCategoryName(): string {
    return this.categoryNameMap[this.selectedCategoryId ?? 0] || 'Tất cả sản phẩm';
  }


loadPage(page: number): void {
  if (this.searchKeyword) {
    // Nếu có từ khóa tìm kiếm thì gọi API tìm kiếm
    this.showCategoryService
      .searchProductsPaged(
        page,
        this.searchKeyword,
        this.selectedSize ?? undefined,
        this.priceFrom,
        this.priceTo
      )
      .subscribe((res) => {
        this.products = res.content;
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
      });
  } else {
    // Không có keyword → lọc theo categoryId
    this.showCategoryService
      .getFilteredProducts(
        page,
        this.selectedSize ?? undefined,
        this.priceFrom,
        this.priceTo,
        this.selectedCategoryId ?? undefined
      )
      .subscribe((res) => {
        this.products = res.content;
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
        console.log('Products:', this.products);
      });
  }
}


  updatePriceDisplay() {
    const fromInput = document.querySelector('input[name="product_price_from"]') as HTMLInputElement;
    const toInput = document.querySelector('input[name="product_price_to"]') as HTMLInputElement;
  
    const fromDiv = document.getElementById('amout-from')!;
    const toDiv = document.getElementById('amout-to')!;
  
    fromInput.value = this.priceFrom.toString();
    toInput.value = this.priceTo.toString();
  
    fromDiv.innerText = this.priceFrom.toLocaleString('vi-VN') + 'đ';
    toDiv.innerText = this.priceTo.toLocaleString('vi-VN') + 'đ';
  }


  // tim san phẩm
  toggleFavourite(product: ProductCategory): void {
  this.favouriteService.toggleFavourite(product.id).subscribe({
    next: () => {
      product.isActive = product.isActive === 1 ? 0 : 1;
    }
  });
}
}
