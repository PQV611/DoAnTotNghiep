import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FavouriteProduct, FavouriteService } from 'src/app/services/favourite.service';

@Component({
  selector: 'app-favourite-product',
  templateUrl: './favourite-product.component.html',
  styleUrls: ['./favourite-product.component.css']
})
export class FavouriteProductComponent implements OnInit {
  favouriteProducts: FavouriteProduct[] = [];
  fullName: string = '';
  avatar: string ='';
  // favourites: any[] = [];

  constructor(private authService: AuthService, private favouriteService: FavouriteService) { }

  ngOnInit(): void {
    this.loadFavourites();
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.fullName = res.fullName;
        this.avatar = res.avatar ;
        console.log("ảnh: "+ this.avatar);
        console.log("Fullname: ", this.fullName);
      },
      error: (err) => {
        this.fullName = 'Không xác định'
        console.error(err);
      }
    });
    // this.authService.getFavouriteProducts().subscribe({
    //   next: (data) => {
    //     this.favouriteProducts = data;
    //   },
    //   error: (err) => {
    //     console.error("Lỗi khi lấy danh sách yêu thích", err);
    //   }
    // });
  }


  isFavorite = false;

  loadFavourites(): void {
    this.favouriteService.getFavourites().subscribe({
      next: (res) => {
        this.favouriteProducts = res;
        console.log('Danh sách yêu thích:', this.favouriteProducts);
      },
      error: (err) => {
        console.error('Không thể tải danh sách yêu thích:', err);
      }
    });
  }

  toggleFavourite(productId: number): void {
    this.favouriteService.toggleFavourite(productId).subscribe({
      next: () => this.loadFavourites(), // Reload sau khi toggle
      error: (err) => console.error('Không thể thay đổi trạng thái yêu thích:', err)
    });
  }

  isSizeListOpen = false;

  toggleSizeList() {
    this.isSizeListOpen = !this.isSizeListOpen;
  }
}
