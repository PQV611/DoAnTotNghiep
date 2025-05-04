import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  searchTerm: string = '';
  selectedRole: string = '';
  isModalOpen: boolean = false;
  accountToEdit: any = null;

  isEditMode: boolean = false;
  modalFullName = '';
  modalEmail = '';
  modalUsername = '';
  modalPassword = '';
  modalConfirmPassword = '';
  modalRole = 'user';
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  errors: any = {};

  isDeleteModalOpen: boolean = false;
  accountToDelete: any = null;

  isChangePasswordModalOpen: boolean = false;
  accountToChangePassword: any = null;
  changePasswordErrors: any = {};

  openChangePasswordModal(account: any) {
    this.accountToChangePassword = account;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.changePasswordErrors = {};
    this.isChangePasswordModalOpen = true;
  }
  
  changePassword() {
    this.changePasswordErrors = {};
  
    if (!this.newPassword) {
      this.changePasswordErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    }
  
    if (this.newPassword !== this.confirmNewPassword) {
      this.changePasswordErrors.confirm = 'Mật khẩu không khớp';
    }
  
    if (Object.keys(this.changePasswordErrors).length > 0) return;
  
    // Giả lập thay đổi mật khẩu
    console.log(`Đã đổi mật khẩu cho ${this.accountToChangePassword.username}: ${this.newPassword}`);
  
    this.isChangePasswordModalOpen = false;
  }
  

  accounts = [
    { id: 'TK01', fullName: 'Nguyễn Văn A', email: 'a@gmail.com', username: 'nguyena', createdAt: '2024-05-01', role: 'admin' },
    { id: 'TK02', fullName: 'Trần Thị B', email: 'b@gmail.com', username: 'tranb', createdAt: '2024-05-03', role: 'staff' },
    { id: 'TK03', fullName: 'Lê Văn C', email: 'c@gmail.com', username: 'lec', createdAt: '2024-04-21', role: 'user' },
  ];

  get filteredAccounts() {
    return this.accounts.filter(acc =>
      (acc.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       acc.username.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedRole === '' || acc.role === this.selectedRole)
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.accountToEdit = null;

    this.modalFullName = '';
    this.modalEmail = '';
    this.modalUsername = '';
    this.modalPassword = '';
    this.modalConfirmPassword = '';
    this.errors = {};

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.errors = {};
  }

  editAccount(account: any) {
    this.isEditMode = true;
    this.accountToEdit = account;
  
    this.modalFullName = account.fullName;
    this.modalEmail = account.email;
    this.modalUsername = account.username;
    this.modalRole = account.role;
  
    this.errors = {};
    this.isModalOpen = true;
  }
  

  confirmDelete(account: any) {
    this.accountToDelete = account;
    this.isDeleteModalOpen = true;
  }
  
  cancelDelete() {
    this.accountToDelete = null;
    this.isDeleteModalOpen = false;
  }
  
  deleteAccount() {
    this.accounts = this.accounts.filter(acc => acc !== this.accountToDelete);
    this.isDeleteModalOpen = false;
  }
  

  saveAccount() {
    this.errors = {};
  
    if (!this.modalFullName) this.errors.fullName = 'Vui lòng nhập họ tên';
    if (!this.modalEmail) this.errors.email = 'Vui lòng nhập email';
    if (!this.modalUsername) this.errors.username = 'Vui lòng nhập tên đăng nhập';
  
    if (!this.isEditMode) {
      if (!this.modalPassword) this.errors.password = 'Vui lòng nhập mật khẩu';
      if (this.modalPassword !== this.modalConfirmPassword)
        this.errors.confirm = 'Mật khẩu không khớp';
    }
  
    if (Object.keys(this.errors).length > 0) return;
  
    if (this.isEditMode) {
      this.accountToEdit.fullName = this.modalFullName;
      this.accountToEdit.email = this.modalEmail;
      this.accountToEdit.username = this.modalUsername;
      this.accountToEdit.role = this.modalRole;
    } else {
      const newAccount = {
        id: 'TK' + (this.accounts.length + 1).toString().padStart(2, '0'),
        fullName: this.modalFullName,
        email: this.modalEmail,
        username: this.modalUsername,
        createdAt: new Date().toISOString().split('T')[0],
        role: 'user'
      };
      this.accounts.push(newAccount);
    }
  
    this.isModalOpen = false;
  }
  

  
}
