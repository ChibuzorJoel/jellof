import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn) { // ✅ Fixed: Remove ()
      this.router.navigate(['/admin/login']);
      return false;
    }

    // Check if user is admin
    if (currentUser?.role !== 'admin') { // ✅ Fixed: Check role directly
      this.router.navigate(['/admin/login']);
      return false;
    }

    return true;
  }
}