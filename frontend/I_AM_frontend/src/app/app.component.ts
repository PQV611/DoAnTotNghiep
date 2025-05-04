import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
      $('#myButton').click(function() {
        alert('Bootstrap và jQuery đã hoạt động thành công!');
      });
  }

  isLoginPage: boolean = false;
  isAdminPage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // this.isLoginPage = this.router.url.includes('/login'); 
      this.isLoginPage = this.router.url.startsWith('/login');
      this.isAdminPage = this.router.url.startsWith('/admin');
    });
  }
}
