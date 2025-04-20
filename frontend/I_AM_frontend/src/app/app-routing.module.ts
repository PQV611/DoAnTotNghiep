import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CartComponent } from './cart/cart.component';
import { InfoComponent } from './customer/info/info.component';
import { OrderManageComponent } from './customer/order-manage/order-manage.component';
import { FavouriteProductComponent } from './customer/favourite-product/favourite-product.component';
import { DetailProductComponent } from './customer/detail-product/detail-product.component';
import { DetailOrderComponent } from './customer/detail-order/detail-order.component';

const routes: Routes = [
  // {path: '', redirectTo: 'homepage', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: 'pay/cart', component: CartComponent},
  {path: 'customer/info', component: InfoComponent},
  {path: 'customer/order_manage', component: OrderManageComponent},
  {path: 'customer/favourite_product', component: FavouriteProductComponent},
  {path: 'customer/detailProduct', component: DetailProductComponent},
  {path: 'customer/detailOrder', component:DetailOrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
