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
import { CategoryComponent } from './category/category.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CategoryManagerComponent } from './admin/category-manager/category-manager.component';
import { ProductManagerComponent } from './admin/product-manager/product-manager.component';
import { DiscountManagerComponent } from './admin/discount-manager/discount-manager.component';
import { AccountComponent } from './admin/account/account.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrderComponent } from './admin/order/order.component';

const routes: Routes = [
  // {path: '', redirectTo: 'homepage', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: 'pay/cart', component: CartComponent},
  {path: 'customer/info', component: InfoComponent},
  {path: 'customer/order_manage', component: OrderManageComponent},
  {path: 'customer/favourite_product', component: FavouriteProductComponent},
  {path: 'customer/detailProduct', component: DetailProductComponent},
  {path: 'customer/detailOrder', component:DetailOrderComponent},
  {path:'category', component: CategoryComponent},
  { path: 'admin', component: AdminLayoutComponent, children: [
    { path: 'categories', component: CategoryManagerComponent },
    { path: 'products', component: ProductManagerComponent },
    { path: 'discounts', component: DiscountManagerComponent },
    {path : 'order', component: OrderComponent},
    {path : 'account', component: AccountComponent},
    {path : 'dashboard', component: DashboardComponent},
    {path: '', redirectTo: 'dashboard', pathMatch: 'full' }
]}
];

// cẩn thận các order, product vì có thể import nhầm bên frontend

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
