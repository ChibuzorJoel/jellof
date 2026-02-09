import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { LookbookComponent } from './pages/lookbook/lookbook.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'lookbook', component: LookbookComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin/products', component: AdminProductComponent},
  { path: 'checkout', component: CheckoutComponent},

  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login.component')
        .then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminAuthGuard]
  },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./admin/admin-order/admin-order.component').then(m => m.AdminOrderComponent),
    canActivate: [adminAuthGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
