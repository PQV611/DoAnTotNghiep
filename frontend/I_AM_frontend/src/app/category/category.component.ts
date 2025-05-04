import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  sizeList: string[] = ['S', 'M', 'L', 'XL'];
  colorList: string[] = ['#FF0000', '#0000FF', '#008000', '#000000'];
  selectedColor: string | null = null; // Biến lưu màu đang chọn
  
  //Value range
  priceFrom: number = 0;
  priceTo: number = 10000000;

  maxPrice: number = 10000000;
  minPrice: number = 0;

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
  

  ngOnInit() {
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
      }
    });
    
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
}
