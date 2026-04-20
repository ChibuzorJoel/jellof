import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { LookbookComponent } from './pages/lookbook/lookbook.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AuthComponent } from './pages/auth/auth.component';

// Admin
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminMessageComponent } from './admin/admin-message/admin-message.component';

// Guards (commented out until you create the files)
import { AuthGuard } from './guards/auth.guard';
 import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminPaymentComponent } from './admin/admin-payment/admin-payment.component';
import { AdminCustomersComponent } from './admin/admin-customers/admin-customers.component';
import { AdminInventoryComponent } from './admin/admin-inventory/admin-inventory.component';
import { NewsletterComponent } from './pages/newsletter/newsletter.component';
 
const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'collections', component: CollectionsComponent },
  { path: 'lookbook', component: LookbookComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'newsletter', component: NewsletterComponent },
  
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  
  // Auth Routes
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  
  // Protected Routes (uncomment canActivate after creating AuthGuard)
  { 
    path: 'checkout', 
    component: CheckoutComponent
    //canActivate: [AuthGuard]  // ← Uncomment after creating AuthGuard
  },
  { path: 'cart', component: CartComponent },
  
  // Admin Routes
  { path: 'admin/login', component: AdminLoginComponent },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/products', 
    component: AdminProductComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/orders', 
    component: AdminOrderComponent
    //canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/payment', 
    component: AdminPaymentComponent
    //canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/message', 
    component: AdminMessageComponent
    //canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/categories', 
    component: AdminCategoriesComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/customers', 
    component: AdminCustomersComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/inventory', 
    component: AdminInventoryComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  { 
    path: 'admin/contacts', 
    component: AdminMessageComponent
    // canActivate: [AdminAuthGuard]  // ← Uncomment after creating AdminAuthGuard
  },
  
  // Wildcard Route (404)
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }