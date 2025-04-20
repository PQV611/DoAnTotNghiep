import { Component } from '@angular/core';

@Component({
  selector: 'app-favourite-product',
  templateUrl: './favourite-product.component.html',
  styleUrls: ['./favourite-product.component.css']
})
export class FavouriteProductComponent {
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  isSizeListOpen = false;

  toggleSizeList() {
    this.isSizeListOpen = !this.isSizeListOpen;
  }
}
