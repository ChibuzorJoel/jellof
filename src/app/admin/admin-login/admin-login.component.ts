import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/admin/dashboard';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = response.message || 'Login failed';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage =
          error.error?.message || 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
