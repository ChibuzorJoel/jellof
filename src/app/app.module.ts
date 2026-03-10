import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

// Angular Modules
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Quill WYSIWYG Editor
import { QuillModule } from 'ngx-quill';

// Main App
import { AppComponent } from './app.component';

// Layout
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { LookbookComponent } from './pages/lookbook/lookbook.component';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { QuickViewComponent } from './pages/quick-view/quick-view.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CartComponent } from './pages/cart/cart.component';

// Shared Components
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { CartNotificationComponent } from './pages/components/cart-notification/cart-notification.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';

// Directives
import { ScrollAnimationDirective } from './directives/scroll-animation.directive';

// Admin Components
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminMessageComponent } from './admin/admin-message/admin-message.component';

// Services
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { AdminPaymentComponent } from './admin/admin-payment/admin-payment.component';

@NgModule({
  declarations: [
    AppComponent,

    // Layout
    HeaderComponent,
    FooterComponent,

    // Pages
    HomeComponent,
    AboutComponent,
    ContactComponent,
    CollectionsComponent,
    LookbookComponent,
    ProductSearchComponent,
    QuickViewComponent,
    CheckoutComponent,
    AuthComponent,
    CartComponent,

    // Shared Components
    ProductCardComponent,
    CartNotificationComponent,
    LiveChatComponent,

    // Directives
    ScrollAnimationDirective,

    // Admin
    AdminLoginComponent,
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminProductComponent,
    AdminOrderComponent,
    AdminCategoriesComponent,
    AdminMessageComponent,
    AdminPaymentComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Quill Editor
    QuillModule.forRoot()
  ],

  providers: [
    AuthService,
    CartService,
    OrderService,
    ProductService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }