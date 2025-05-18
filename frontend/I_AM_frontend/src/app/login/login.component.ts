import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  registerData = {
    username: '',
    password: '',
    email: '',
    fullName: '',
    confirmPassword: ''
  };

  loginData = {
    username: '',
    password: ''
  };

  passwordMismatch = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (!container || !registerBtn || !loginBtn) {
      console.error("Không tìm thấy phần tử cần thiết!");
      return;
    }

    registerBtn.addEventListener('click', () => {
      container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
      container.classList.remove("active");
    });
  }

  // onRegister() {
  //   if (this.registerData.password !== this.registerData.confirmPassword) {
  //     alert('Mật khẩu xác nhận không khớp!');
  //     return;
  //   }

  //   this.authService.register(this.registerData).subscribe({
  //     // next: () => alert('Đăng ký thành công'),
  //     // error: () => alert('Đăng ký thất bại')
  //     next: (res) => {
  //       if (res.success) {
  //         alert(res.message); // "Đăng ký thành công!"
  //         // Chuyển về đăng nhập
  //         const container = document.getElementById('container');
  //         if (container) container.classList.remove('active');
  //       } else {
  //         alert('Lỗi: ' + res.message);
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       alert('Đăng ký thất bại, vui lòng thử lại sau.');
  //     }
  //   });
  // }

  onRegister(form: NgForm) {
    this.passwordMismatch = this.registerData.password !== this.registerData.confirmPassword;
    if (form.invalid || this.passwordMismatch) {
      return; // Dừng lại nếu form sai
    }

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        if (res.success) {
          alert(res.message);
          const container = document.getElementById('container');
          if (container) container.classList.remove('active');
        } else {
          alert('Lỗi: ' + res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Đăng ký thất bại, vui lòng thử lại sau.');
      }
    });
  }

  // onLogin() {
  //   this.authService.login(this.loginData).subscribe({
  //     next: (response) => {
  //       this.authService.saveToken(response.token);
  //       alert('Đăng nhập thành công');
  //       const role = this.authService.getRoleFromToken();
  //       console.log('Role from token:', role);
  //       if (role === 'ADMIN') {
  //         this.router.navigate(['/admin']);
  //       } else if (role === 'STAFF') {
  //         this.router.navigate(['/admin/categories']);
  //       } else {
  //         this.router.navigate(['/homepage']);
  //       }
  //       // this.router.navigate(['/homepage']);
  //     },
  //     error: () => alert('Đăng nhập thất bại')
  //   });
  // }

  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        // alert('Đăng nhập thành công');
        const role = this.authService.getRoleFromToken();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'STAFF') {
          this.router.navigate(['/admin/categories']);
        } else {
          this.router.navigate(['/homepage']);
        }
      },
      error: () => alert('Đăng nhập thất bại')
    });
  }
}
