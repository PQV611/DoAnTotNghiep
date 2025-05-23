import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { InfoComponent } from './customer/info/info.component';
import { FormsModule } from '@angular/forms';
import { OrderManageComponent } from './customer/order-manage/order-manage.component';
import { FavouriteProductComponent } from './customer/favourite-product/favourite-product.component';
import { DetailProductComponent } from './customer/detail-product/detail-product.component';
import { DetailOrderComponent } from './customer/detail-order/detail-order.component';
import { CategoryComponent } from './category/category.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CategoryManagerComponent } from './admin/category-manager/category-manager.component';
import { ProductManagerComponent } from './admin/product-manager/product-manager.component';
import { DiscountManagerComponent } from './admin/discount-manager/discount-manager.component';
import { OrderComponent } from './admin/order/order.component';
import { AccountComponent } from './admin/account/account.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    LoginComponent,
    CartComponent,
    InfoComponent,
    OrderManageComponent,
    FavouriteProductComponent,
    DetailProductComponent,
    DetailOrderComponent,
    CategoryComponent,
    AdminLayoutComponent,
    CategoryManagerComponent,
    ProductManagerComponent,
    DiscountManagerComponent,
    OrderComponent,
    AccountComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
