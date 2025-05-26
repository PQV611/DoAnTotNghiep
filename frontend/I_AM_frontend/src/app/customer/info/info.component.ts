import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserProfile, UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit{
  showModal = false;
  fullName: string = '';
  avatar: string = '';
  address: string = '';
  birth:string = '';
  phone:string ='';
  email:string ='';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  avatarFile: File | null = null;
  submitted: boolean = false;

  user: UserProfile = {
    fullName: '',
    birth: '',
    phone: '',
    address: '',
    email: '',
    avatar: ''
  };

  validationErrors = {
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: ''
  };

  alertMessage: string = '';

  showAlert(message: string) {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 4000); // 4 giây tự ẩn
  }

  constructor(private authService: AuthService, private userService: UserProfileService){}

  ngOnInit(): void {
    // Gọi API để hiển thị USER
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.user = res;
        this.fullName = res.fullName;
        this.avatar = res.avatar;
        this.address = res.address;
        this.birth = res.birth;
        this.phone = res.phone;
        this.email = res.email;
        console.log("Email: " + res.email);
        console.log('Thông tin user:', res);
        console.log('Dữ liệu nhận được: ' + this.user) ;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  changePassword() {

    this.submitted = true;

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      return; // có trường bị bỏ trống
    }

    if (this.newPassword !== this.confirmPassword) {
      // alert('Mật khẩu mới không trùng khớp');
      return;
    }

    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        // alert('Đổi mật khẩu thành công!');
        this.showAlert('Đổi mật khẩu thành công !') ;
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        alert('Đổi mật khẩu thất bại!');
        this.showAlert('Đổi mật khẩu thất bại !') ;
        console.error(err);
      }
    });
  }

  resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Chỉnh sửa

  showEditModal = false;

editUser = {
  fullName: this.fullName,
  birthDate: this.birth,
  email: this.email,
  phone: this.phone,
  // gender: 'Nam',
  address: this.address
};

onFileSelected(event: any): void {
    this.avatarFile = event.target.files[0];

    if (this.avatarFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const preview = document.getElementById('preview') as HTMLImageElement;
        preview.src = reader.result as string;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(this.avatarFile);
    }
  }

openEditModal() {
  this.editUser = {
    fullName: this.user.fullName,
    birthDate: this.user.birth,
    email: this.user.email,
    phone: this.user.phone,
    address: this.user.address
  };
  this.showEditModal = true;
}

closeEditModal() {
  this.showEditModal = false;
}

saveChanges() {
    // Reset lỗi trước
  this.validationErrors = {
    fullName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: ''
  };

  let hasError = false;

  // RÀNG BUỘC
  if (!this.editUser.fullName.trim()) {
    this.validationErrors.fullName = 'Họ tên không được để trống';
    hasError = true;
  }

  if (!this.editUser.birthDate) {
    this.validationErrors.birthDate = 'Ngày sinh không được để trống';
    hasError = true;
  } else {
    const birth = new Date(this.editUser.birthDate);
    const today = new Date();
    if (birth > today) {
      this.validationErrors.birthDate = 'Ngày sinh không được lớn hơn ngày hiện tại';
      hasError = true;
    }
  }

  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!this.editUser.email.trim()) {
    this.validationErrors.email = 'Email không được để trống';
    hasError = true;
  } else if (!emailPattern.test(this.editUser.email)) {
    this.validationErrors.email = 'Email không đúng định dạng';
    hasError = true;
  }

  const phonePattern = /^\d{10}$/;
  if (!this.editUser.phone.trim()) {
    this.validationErrors.phone = 'Số điện thoại không được để trống';
    hasError = true;
  } else if (!phonePattern.test(this.editUser.phone)) {
    this.validationErrors.phone = 'Số điện thoại phải đủ 10 số';
    hasError = true;
  }

  if (!this.editUser.address.trim()) {
    this.validationErrors.address = 'Địa chỉ không được để trống';
    hasError = true;
  }

  if (hasError) return; // Không gửi form nếu có lỗi

    const formData = new FormData();
    formData.append('fullName', this.editUser.fullName);
    formData.append('birth', this.editUser.birthDate); // yyyy-MM-dd
    formData.append('email', this.editUser.email);
    formData.append('phone', this.editUser.phone);
    formData.append('address', this.editUser.address);
    if (this.avatarFile) {
      formData.append('avatarFile', this.avatarFile);
    }

    this.userService.updateUserProfile(formData).subscribe({
      next: () => {
        // alert('Cập nhật thông tin thành công!');
        this.showAlert('Cập nhật thông tin thành công!')
        this.closeEditModal();
        this.ngOnInit(); // reload lại thông tin sau khi cập nhật
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        // alert('Cập nhật thất bại!');
        this.showAlert('Cập nhật thất bại !') ;
      }
    });
  }
}
