import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent {
  mainImage: string = '../../../assets/images/test-detail-P-1.jpg';

  imageList: string[] = [
    '../../../assets/images/test-detail-P-1.jpg',
    '../../../assets/images/test-detail-P-2.jpg',
    '../../../assets/images/test-detail-P-3.jpg',
    '../../../assets/images/test-detail-P-4.jpg'
  ];
  backgroundPosition = 'center';
  backgroundSize = '100%'; // Lúc đầu ảnh ở kích thước gốc

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
}
