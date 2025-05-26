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

  alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}


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

  onRegister(form: NgForm) {
    this.passwordMismatch = this.registerData.password !== this.registerData.confirmPassword;
    if (form.invalid || this.passwordMismatch) {
      // this.showAlert("Vui lòng nhập thông tin đăng ký");
      return; // Dừng lại nếu form sai
    }

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        if (res.success) {
          // alert(res.message);
          this.showAlert(res.message) ;
          const container = document.getElementById('container');
          if (container) container.classList.remove('active');
        } else {
          // alert('Lỗi: ' + res.message);
          this.showAlert('Lỗi: ' + res.message) ;
        }
      },
      error: (err) => {
        console.error(err);
        // alert('Đăng ký thất bại, vui lòng thử lại sau.');
        this.showAlert('Đăng ký thất bại, vui lòng thử lại sau.');
      }
    });
  }

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
      // alert('Đăng nhập thất bại')
      error: () => this.showAlert('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập của bạn.')
    });
  }
}
