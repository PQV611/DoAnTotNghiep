import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DetailProductService, ProductDetail } from 'src/app/services/detail-product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  product!: ProductDetail;
  mainImage: string = '';
  imageList: string[] = [];
  backgroundPosition = 'center';
  backgroundSize = '100%'; // Lúc đầu ảnh ở kích thước gốc

  selectedColor: string = '';
  selectedSize: string = '';
  quantity: number = 1;

  showWarning: boolean = false;
  availableSizes: string[] = [];
  productId: number = 0;

  constructor(private route: ActivatedRoute, private productService: DetailProductService, public authService:AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductDetail(id).subscribe(data => {
      this.product = data;
      this.imageList = data.imageList;
      this.mainImage = data.mainImage;
      console.log("PRODUCT DETAIL: ", this.product.id);
      
    });
    
    this.productId = id;
    console.log("PRODUCT ID: " + id);
    console.log("Màu đã chọn:", this.selectedColor);
    console.log("Size đã chọn:", this.selectedSize);

  }

  changeMainImage(imageSrc: string): void {
    this.mainImage = imageSrc;
    this.resetZoom(); // khi đổi ảnh thì cũng reset zoom
  }

  onMouseMove(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.backgroundPosition = `${x}% ${y}%`;
    this.backgroundSize = '200%'; // Hover vào thì phóng to
  }

  onMouseLeave(): void {
    this.resetZoom(); // Hover ra thì thu nhỏ về ban đầu
  }

  private resetZoom(): void {
    this.backgroundPosition = 'center';
    this.backgroundSize = '100%';
  }

  addToCart(): void {
    console.log('Gửi lên:', this.productId, this.selectedColor.trim(), this.selectedSize.trim(), this.quantity);

    if (!this.product) {
      alert('Sản phẩm chưa tải xong, vui lòng thử lại.');
      return;
    }

    this.showWarning = false; // Reset cảnh báo mỗi khi thêm vào giỏ hàng
    if (!this.selectedColor || !this.selectedSize) {
      // alert('Vui lòng chọn màu và size trước khi thêm vào giỏ hàng.');
      this.showWarning = true;
      return;
    }

    this.cartService.addToCart(this.productId, this.selectedColor, this.selectedSize, this.quantity)
      .subscribe({
        next: (res) => {
          alert('Đã thêm vào giỏ hàng!');
        },
        error: (err) => {
          console.error('Lỗi thêm vào giỏ hàng:', err);
          alert('Có vẻ sản màu hoặc size này đã hết hàng');
        }
      });
  }

  onColorChange(color: string): void {
    this.loadSizesByColor(this.product.id, color); // gọi API để cập nhật danh sách size theo màu
  }


  loadSizesByColor(productId: number, color: string): void {
    this.productService.getSizesByColor(productId, color).subscribe({
      next: (sizes) => {
        this.availableSizes = sizes;
        console.log('Kích thước có sẵn cho màu', color, ':', sizes);
      },
      error: (err) => {
        console.error('Lỗi khi lấy size theo màu:', err);
      }
    });
  }
}
