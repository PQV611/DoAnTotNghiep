import { Component, OnInit } from '@angular/core';
import { AdminAccountService, UserDTO, UserUpdateDTO, ChangePasswordDTO, PageResponse } from 'src/app/services/admin-account.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accounts: UserDTO[] = [];
  currentPage = 0;
  totalPages = 0;
  searchTerm = '';
  selectedRole = 'all';
  pageSize = 6;
  isModalOpen = false;
  isEditMode = false;

  modalFullName = '';
  modalEmail = '';
  modalUsername = '';
  modalPassword = '';
  modalConfirmPassword = '';
  modalRole = 'user';
  errors: any = {};

  accountToEdit: UserDTO | null = null;

  // Delete
  isDeleteModalOpen = false;
  accountToDelete: UserDTO | null = null;

  // Password
  isChangePasswordModalOpen = false;
  accountToChangePassword: UserDTO | null = null;
  newPassword = '';
  confirmNewPassword = '';
  changePasswordErrors: any = {};

  constructor(private accountService: AdminAccountService, private toastr: ToastrService, public authService: AuthService) { }

  // private role = this.authService.getRoleFromToken();

  ngOnInit(): void {
    this.loadAccounts();
  }

  alertMessage: string = '';

showAlert(message: string) {
  this.alertMessage = message;
  setTimeout(() => {
    this.alertMessage = '';
  }, 4000); // 4 giây tự ẩn
}

  

  getRoleLabel(role: string): string {
    switch (role) {
      case 'user':
        return 'Khách hàng';
      case 'staff':
        return 'Nhân viên';
      case 'admin':
        return 'Quản trị viên';
      default:
        return role;
    }
  }
  

  loadAccounts(page = 0): void {
    this.accountService.getAccounts(this.searchTerm, this.selectedRole, page, this.pageSize).subscribe({
      next: res => {
        this.accounts = res.content;
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
      },
      error: () => {
        this.showAlert('Lỗi tải danh sách tài khoản');
      }
    });
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadAccounts(page);
    }
  }

  onSearchChange(): void {
    this.loadAccounts(0);
  }

  onRoleChange(): void {
    this.loadAccounts(0);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.modalFullName = '';
    this.modalEmail = '';
    this.modalUsername = '';
    this.modalPassword = '';
    this.modalConfirmPassword = '';
    this.errors = {};
    this.isModalOpen = true;
  }

  editAccount(account: UserDTO): void {
    this.isEditMode = true;
    this.accountToEdit = account;
    this.modalFullName = account.fullName;
    this.modalEmail = account.email;
    this.modalUsername = account.username;
    this.modalRole = account.nameRole?.toLowerCase() || 'user';
    this.errors = {};
    this.isModalOpen = true;
  }

  saveAccount(): void {
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

    if (this.isEditMode && this.accountToEdit) {
      const payload: UserUpdateDTO = {
        fullName: this.modalFullName,
        nameRole: this.modalRole
      };
      this.accountService.updateAccount(this.accountToEdit.idUser!, payload).subscribe(() => {
        this.showAlert('Cập nhật tài khoản thành công');
        this.closeModal();
        this.loadAccounts(this.currentPage);
      });
    } else {
      const newUser: UserDTO = {
        fullName: this.modalFullName,
        email: this.modalEmail,
        username: this.modalUsername,
        password: this.modalPassword,
        createAt: '',
        nameRole: 'user'
      };
      this.accountService.createAccount(newUser).subscribe(() => {
        this.showAlert('Tạo tài khoản thành công');
        this.closeModal();
        this.loadAccounts(this.currentPage);
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.errors = {};
  }

  confirmDelete(account: UserDTO): void {
    this.accountToDelete = account;
    this.isDeleteModalOpen = true;
  }

  deleteAccount(): void {
    if (this.accountToDelete) {
      this.accountService.deleteAccount(this.accountToDelete.idUser!).subscribe(() => {
        this.showAlert('Xoá tài khoản thành công');
        this.loadAccounts(this.currentPage);
        this.isDeleteModalOpen = false;
      });
    }
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.accountToDelete = null;
  }

  openChangePasswordModal(account: UserDTO): void {
    this.accountToChangePassword = account;
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.changePasswordErrors = {};
    this.isChangePasswordModalOpen = true;
  }

  changePassword(): void {
    this.changePasswordErrors = {};
    if (!this.newPassword) this.changePasswordErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    if (this.newPassword !== this.confirmNewPassword)
      this.changePasswordErrors.confirm = 'Mật khẩu không khớp';
    if (Object.keys(this.changePasswordErrors).length > 0) return;

    const dto: ChangePasswordDTO = {
      newPassword: this.newPassword,
      confirmPassword: this.confirmNewPassword
    };
    if (this.accountToChangePassword) {
      this.accountService.changePassword(this.accountToChangePassword.idUser!, dto).subscribe(() => {
        this.showAlert('Đổi mật khẩu thành công');
        this.isChangePasswordModalOpen = false;
      });
    }
  }

}
