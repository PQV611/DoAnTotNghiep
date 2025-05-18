import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HomepageService, Product } from '../services/homepage.service';
import { AuthService } from '../services/auth.service';
import { FavouriteProduct, FavouriteService } from '../services/favourite.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent implements OnInit, AfterViewInit {
  @ViewChild('slider') sliderRef!: ElementRef;
  @ViewChild('image') imageRef!: ElementRef;
  @ViewChild('productSliderWomen') productSliderWomen!: ElementRef;
  @ViewChild('productSliderMen') productSliderMen!: ElementRef;
  
  current = 0;
  slideInterval: any;
  imageCount = 4; // Số lượng ảnh
  currentIndex = 0;
  visibleCount = 5;
  itemWidth = 236 + 30; // Width + margin
  totalItems = 10;
  role = this.authService.getRoleFromToken()
  activeTab: string = 'women';
  showTab(tab: string) {
    this.activeTab = tab;
  }
  favouriteProducts: FavouriteProduct[] = [];
  products: Product[] = [];
  constructor(private homepageService: HomepageService, private authService: AuthService, private favouriteService: FavouriteService) {}

  ngOnInit(): void {
    this.homepageService.getTop5Products().subscribe((res) => {
      this.products = res;
    });
    this.loadFavourites();
  }

//   products = [
//   {
//     name: 'Áo thun trơn ICY Summer',
//     price: '209.700đ',
//     image: 'assets/images/homepage-test.webp',
//     hoverImage: 'assets/images/homepage-test2.webp',
//     colors: ['Đỏ', 'Đen', 'Xanh'],
//     sizes: ['S', 'X', 'M', 'L'],
//     isFavorite: false
//   },
//   {
//     name: 'Áo thun trơn ICY Summer',
//     price: '1đ',
//     image: 'assets/images/homepage-test1.webp',
//     hoverImage: 'assets/images/homepage-test2.webp',
//     colors: ['Đỏ', 'Đen', 'Xanh'],
//     sizes: ['S', 'X', 'M', 'L'],
//     isFavorite: false
//   },
//   {
//     name: 'Áo thun trơn ICY Summer',
//     price: '2đ',
//     image: 'assets/images/homepage-test.webp',
//     hoverImage: 'assets/images/homepage-test2.webp',
//     colors: ['Đỏ', 'Đen', 'Xanh'],
//     sizes: ['S', 'X', 'M', 'L'],
//     isFavorite: false
//   },
//   {
//     name: 'Áo thun trơn ICY Summer',
//     price: '3đ',
//     image: 'assets/images/homepage-test.webp',
//     hoverImage: 'assets/images/homepage-test2.webp',
//     colors: ['Đỏ', 'Đen', 'Xanh'],
//     sizes: ['S', 'X', 'M', 'L'],
//     isFavorite: false
//   },
//   {
//     name: 'Áo thun trơn ICY Summer',
//     price: '4đ',
//     image: 'assets/images/homepage-test.webp',
//     hoverImage: 'assets/images/homepage-test2.webp',
//     colors: ['Đỏ', 'Đen', 'Xanh'],
//     sizes: ['S', 'X', 'M', 'L'],
//     isFavorite: false
//   }
//   // tạo thêm 4 sản phẩm tương tự
// ];

isSizeListOpen: number | null = null;



  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  getImageWidth(): number {
    return this.imageRef.nativeElement.offsetWidth;
  }

  moveSlide(index: number): void {
    const width = this.getImageWidth();
    this.sliderRef.nativeElement.style.transform = `translateX(-${width * index}px)`;
  }

  handleNext(): void {
    this.stopAutoSlide();
    this.current = (this.current + 1) % this.imageCount;
    this.moveSlide(this.current);
    this.startAutoSlide();
  }

  handlePrev(): void {
    this.stopAutoSlide();
    this.current = (this.current - 1 + this.imageCount) % this.imageCount;
    this.moveSlide(this.current);
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.current = (this.current + 1) % this.imageCount;
      this.moveSlide(this.current);
    }, 3000);
  }

  stopAutoSlide(): void {
    clearInterval(this.slideInterval);
  }

  isFavorite = false;

  // toggleFavorite(index: number) {
  //   this.products[index].isFavorite = !this.products[index].isFavorite;
  // }

  // isSizeListOpen = false;

  toggleSizeList(index: number) {
    this.isSizeListOpen = this.isSizeListOpen === index ? null : index;
  }

  // slide in IAM women
  scrollNext() {
    if (this.currentIndex + this.visibleCount < this.totalItems) {
      this.currentIndex++;
      this.updateScroll();
    }
  }

  scrollPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateScroll();
    }
  }

  updateScroll() {
    const scrollAmount = this.currentIndex * this.itemWidth;
    this.productSliderWomen.nativeElement.style.transform = `translateX(-${scrollAmount}px)`;
  }


  loadFavourites(): void {
    this.favouriteService.getFavourites().subscribe({
      next: (res) => {
        this.favouriteProducts = res;
      },
      error: (err) => {
        console.error('Không thể tải danh sách yêu thích:', err);
      }
    });
  }

  // toggleFavourite(productId: number): void {
  //   this.favouriteService.toggleFavourite(productId).subscribe({
  //     next: () => this.loadFavourites(), // Reload sau khi toggle
  //     error: (err) => console.error('Không thể thay đổi trạng thái yêu thích:', err)
  //   });
  // }

  toggleFavourite(product: Product): void {
  this.favouriteService.toggleFavourite(product.id).subscribe({
    next: () => {
      product.isActive = product.isActive === 1 ? 0 : 1;
    }
  });
}
}
