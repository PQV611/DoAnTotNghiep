import { Component, OnInit } from '@angular/core';
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
}
