import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { LookbookComponent } from './pages/lookbook/lookbook.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';

import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { QuickViewComponent } from './pages/quick-view/quick-view.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    CollectionsComponent,
    LookbookComponent,
    ProductCardComponent,
    AdminProductComponent,
    AdminDashboardComponent,
    AdminOrderComponent,
    ProductSearchComponent,
    QuickViewComponent,
    CheckoutComponent
    // ❌ AdminLoginComponent REMOVED
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
