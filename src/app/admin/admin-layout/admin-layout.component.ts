import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  
  adminName = 'Admin';
  searchQuery = '';
  notificationCount = 5;
  showProfileMenu = false;
  showNotifications = false;
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Track current route for active nav links
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/admin/products'], {
        queryParams: { search: this.searchQuery }
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  getInitials(): string {
    return this.adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      sessionStorage.clear();
      this.router.navigate(['/admin/login']);
    }
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}