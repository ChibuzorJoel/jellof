import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Not logged in → redirect to admin login
  if (!authService.isLoggedIn()) {
    router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Logged in but not admin → redirect home
  if (state.url.startsWith('/admin') && !authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  // Logged in & admin → allow
  return true;
};
