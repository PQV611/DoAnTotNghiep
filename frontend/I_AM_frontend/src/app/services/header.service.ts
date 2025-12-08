import { Injectable } from '@angular/core';

export interface ProductCategory {
  id: number;
  nameProduct: string;
  numberDiscount: number; // phần trăm giảm (0 nếu không có)
  originalPrice: number;
  salePrice: number;
  image1: string;
  image2: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }
}
