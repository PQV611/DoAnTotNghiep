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

  changeMainImage(imageSrc: string): void {
    this.mainImage = imageSrc;
  }
}
