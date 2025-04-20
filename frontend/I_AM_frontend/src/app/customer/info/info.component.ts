import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent {
  showModal = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Mật khẩu mới không trùng khớp');
      return;
    }

    // TODO: Gọi API đổi mật khẩu ở đây
    console.log('Đổi mật khẩu:', this.currentPassword, this.newPassword);

    alert('Đổi mật khẩu thành công!');
    this.closeModal();
  }

  resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  // Chỉnh sửa

  showEditModal = false;

editUser = {
  fullName: 'Phạm Quốc Việt',
  birthDate: '2003-11-06',
  email: 'quocviet@gmail.com',
  phone: '0123456789',
  gender: 'Nam',
  address: 'Kim Thiều'
};

openEditModal() {
  this.showEditModal = true;
}

closeEditModal() {
  this.showEditModal = false;
}

saveChanges() {
  // TODO: Gọi API hoặc xử lý cập nhật thông tin người dùng ở đây
  console.log('Thông tin đã cập nhật:', this.editUser);
  alert('Cập nhật thành công!');
  this.closeEditModal();
}
}
