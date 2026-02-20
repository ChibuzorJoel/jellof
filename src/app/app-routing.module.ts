import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { LookbookComponent } from './pages/lookbook/lookbook.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthComponent } from './pages/auth/auth.component';

// Admin
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { CartComponent } from './pages/cart/cart.component';

// Guards (commented out until you create the files)
// import { AuthGuard } from './guards/auth.guard';
// import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'collections', component: CollectionsComponent },
  { path: 'lookbook', component: LookbookComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  
  // Auth Routes
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  
  // Protected Routes (uncomment canActivate after creating AuthGuard)
  { 
    path: 'checkout', 
    component: CheckoutComponent
    // canActivate: [AuthGuard]  // ← Uncomment after creating AuthGuard
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