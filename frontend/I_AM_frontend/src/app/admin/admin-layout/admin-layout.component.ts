import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isSubmenuOpen: boolean = false;
  fullName: string = '';
  constructor(public authService: AuthService) { }

  role = this.authService.getRoleFromToken();

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        this.fullName = res.fullName;
        console.log("Fullname: ", this.fullName);
      },
      error: (err) => {
        this.fullName = 'Không xác định'
        console.error(err);
      }
    });
  }

  logout() {
    // window.location.reload();
    this.authService.logout();
    window.location.href = '/login';
    // window.location.reload();
  }

  toggleSubmenu(): void {
    
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}
