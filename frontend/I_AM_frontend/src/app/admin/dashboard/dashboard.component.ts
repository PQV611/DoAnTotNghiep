import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  topUserAvatar: string = '';
  topUserName: string = '';
  topUserTotal: number = 0;

  summary: {
    totalRevenue: number;
    codOrders: number;
    transferOrders: number;
  } | null = null;

  isDaySelected: boolean = false;
  isMonthSelected: boolean = false;
  isWeekSelected: boolean = true;

  topProducts: any[] = [];

  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  constructor(private http: HttpClient) { }
    
  

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  months = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
  ];
  years: number[] = [];

  chart: Chart | null = null;

  ngOnInit(): void {
    for (let y = 2020; y <= this.selectedYear; y++) {
      this.years.push(y);
    }
    this.loadChartByMonthYear();
    // this.loadPieChartCategoryOrders();
    this.loadProductQuantityPieChart();

    // Lấy người mua hàng nhiều nhất
    this.getTopUserPaid();

    // 3 label
    this.http.get<any>('http://localhost:8080/api/dashboard/summary-payment')
    .subscribe({
      next: (res) => {
        this.summary = res;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thống kê tổng thanh toán', err);
      }
    });

    this.loadTopProducts();
  }

  getTopUserPaid() {
  this.http.get<any>('http://localhost:8080/api/dashboard/top-user-paid').subscribe({
    next: (data) => {
      this.topUserAvatar = data.avatar[0] || 'default-avatar.png'; // fallback nếu không có ảnh
      this.topUserName = data.fullname[1] || 'Không rõ';
      this.topUserTotal = data.totalPaid[2] || 0;
      console.log('Người dùng trả nhiều nhất:', data);
    },
    error: (err) => {
      console.error('Lỗi khi lấy thông tin người dùng trả nhiều nhất:', err);
    }
  });
}

loadTopProducts() {
  this.http.get<any[]>('http://localhost:8080/api/dashboard/top-products')
    .subscribe({
      next: (data) => {
        this.topProducts = data;
        console.log('Top sản phẩm bán chạy:', this.topProducts);
      },
      error: (err) => {
        console.error("Lỗi khi lấy top sản phẩm bán chạy:", err);
      }
    });
}

//   loadChartByMonthYear() {
//   const url = `http://localhost:8080/api/dashboard/revenue?month=${this.selectedMonth}&year=${this.selectedYear}`;

//   this.http.get<any>(url).subscribe(data => {
//     const labels = [data.label];
//     const values = [data.value];

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = this.canvasRef.nativeElement.getContext('2d');
//     if (!ctx) return;

//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [{
//           label: `Doanh thu tháng ${this.selectedMonth}/${this.selectedYear}`,
//           data: values,
//           backgroundColor: '#42A5F5'
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'bottom'
//           }
//         }
//       }
//     });
//   });
// }

// Doanh thu theo tháng trong năm
loadChartByMonthYear() {
  const url = `http://localhost:8080/api/dashboard/revenue?month=${this.selectedMonth}&year=${this.selectedYear}`;

  this.http.get<any[]>(url).subscribe(data => {
    const labels = data.map(item => item.label); // ['Tuần 1', 'Tuần 2', ...]
    const values = data.map(item => item.value); // [1000000, 2000000, ...]

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `Doanh thu tháng ${this.selectedMonth}/${this.selectedYear}`,
          data: values,
          backgroundColor: 'rgba(82, 227, 253, 0.5)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  });
}

// doanh thu theo năm
  @ViewChild('yearChartCanvas') yearChartCanvas!: ElementRef<HTMLCanvasElement>;
  selectedYearForYearlyChart = new Date().getFullYear();
  yearChart: Chart | null = null;

  loadYearlyChart() {
    const url = `http://localhost:8080/api/dashboard/revenue-by-year?year=${this.selectedYearForYearlyChart}`;
    this.http.get<any[]>(url).subscribe(data => {
      const labels = data.map(item => 'Tháng ' + item.month);
      const values = data.map(item => item.value);

      if (this.yearChart) this.yearChart.destroy();

      const ctx = this.yearChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      this.yearChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: `Doanh thu năm ${this.selectedYearForYearlyChart}`,
            data: values,
            backgroundColor: '#66BB6A'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    });
  }


  // Doanh thu tất cả các ngày trong tháng
  @ViewChild('dailyLineChart') dailyLineChartRef!: ElementRef<HTMLCanvasElement>;
  dailyLineChart: Chart | null = null;

  loadDailyLineChart() {
    const url = `http://localhost:8080/api/dashboard/revenue-by-day?month=${this.selectedMonth}&year=${this.selectedYear}`;

    this.http.get<any[]>(url).subscribe(data => {
      const labels = data.map(item => `Ngày ${item.day}`);
      const values = data.map(item => item.value);

      if (this.dailyLineChart) {
        this.dailyLineChart.destroy();
      }

      const ctx = this.dailyLineChartRef.nativeElement.getContext('2d');
      if (!ctx) return;

      this.dailyLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `Doanh thu từng ngày (${this.selectedMonth}/${this.selectedYear})`,
            data: values,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    });
  }

  // Hiển thị tổng số đơn hàng theo danh mục
//   @ViewChild('pieCanvas') pieCanvasRef!: ElementRef<HTMLCanvasElement>;
//   pieChart: Chart<'pie', number[], string> | null = null;


//   loadPieChartCategoryOrders() {
//   this.http.get<any>(`http://localhost:8080/api/dashboard/order-count-by-category`).subscribe(res => {
//     const data = res.data;
//     const total = res.total;

//     const labels = data.map((item: any) => item.category);
//     const values = data.map((item: any) => item.count);

//     if (this.pieChart) {
//       this.pieChart.destroy();
//     }

//     const ctx = this.pieCanvasRef.nativeElement.getContext('2d');
//     if (!ctx) return;

//     this.pieChart = new Chart(ctx, {
//       type: 'pie',
//       data: {
//         labels: labels,
//         datasets: [{
//           data: values,
//           backgroundColor: [
//             'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
//             'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
//             'rgba(201, 203, 207, 0.6)', 'rgba(255, 87, 34, 0.6)', 'rgba(63, 81, 181, 0.6)',
//             'rgba(0, 188, 212, 0.6)', 'rgba(139, 195, 74, 0.6)', 'rgba(205, 220, 57, 0.6)',
//             'rgba(255, 193, 7, 0.6)', 'rgba(96, 125, 139, 0.6)', 'rgba(233, 30, 99, 0.6)',
//             'rgba(0, 150, 136, 0.6)', 'rgba(121, 85, 72, 0.6)', 'rgba(158, 158, 158, 0.6)',
//             'rgba(3, 169, 244, 0.6)', 'rgba(255, 138, 101, 0.6)', 'rgba(255, 234, 0, 0.6)',
//             'rgba(124, 179, 66, 0.6)', 'rgba(186, 104, 200, 0.6)', 'rgba(100, 181, 246, 0.6)',
//             'rgba(255, 112, 67, 0.6)', 'rgba(224, 224, 224, 0.6)', 'rgba(174, 213, 129, 0.6)',
//             'rgba(255, 171, 145, 0.6)', 'rgba(179, 157, 219, 0.6)', 'rgba(255, 204, 128, 0.6)',
//             'rgba(144, 202, 249, 0.6)', 'rgba(77, 208, 225, 0.6)', 'rgba(240, 98, 146, 0.6)',
//             'rgba(255, 255, 141, 0.6)', 'rgba(149, 117, 205, 0.6)', 'rgba(255, 245, 157, 0.6)',
//             'rgba(255, 204, 188, 0.6)', 'rgba(128, 222, 234, 0.6)', 'rgba(255, 138, 128, 0.6)',
//             'rgba(129, 212, 250, 0.6)', 'rgba(197, 225, 165, 0.6)', 'rgba(213, 0, 249, 0.6)',
//             'rgba(179, 229, 252, 0.6)', 'rgba(244, 143, 177, 0.6)', 'rgba(255, 110, 64, 0.6)',
//             'rgba(224, 247, 250, 0.6)', 'rgba(128, 203, 196, 0.6)', 'rgba(255, 202, 40, 0.6)',
//             'rgba(183, 28, 28, 0.6)', 'rgba(41, 182, 246, 0.6)'
//           ]
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'bottom'
//           },
//           title: {
//             display: true,
//             text: `Tổng đơn hàng: ${total}`
//           }
//         }
//       }
//     });
//   });
// }

chooseDay() {
  this.isDaySelected = true;
  this.isMonthSelected = false;
  this.isWeekSelected = false;
  this.loadDailyLineChart();
}

chooseWeek() {
  this.isDaySelected = false;
  this.isMonthSelected = false;
  this.isWeekSelected = true;
  this.loadChartByMonthYear();
}

chooseMonth() {
  this.isDaySelected = false;
  this.isMonthSelected = true;
  this.isWeekSelected = false;
  this.loadYearlyChart();
}

selectedType: string = 'week';

chooseType(type: string): void {
  this.selectedType = type;

  // Tuỳ chọn: gọi hàm xử lý tương ứng
  if (type === 'day') this.chooseDay();
  else if (type === 'week') this.chooseWeek();
  else if (type === 'month') this.chooseMonth();
}



// test
@ViewChild('productQuantityPieCanvas') productQuantityPieRef!: ElementRef<HTMLCanvasElement>;
productQuantityPieChart: Chart<'pie', number[], string> | null = null;

loadProductQuantityPieChart() {
  this.http.get<any>('http://localhost:8080/api/dashboard/product-quantity-by-category').subscribe(res => {
    const data = res.data;
    const total = res.totalQuantity;

    const labels = data.map((item: any) => item.category);
    const values = data.map((item: any) => item.quantity);

    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)', 'rgba(83, 102, 255, 0.6)', 'rgba(255, 102, 204, 0.6)', 'rgba(102, 255, 178, 0.6)',
      'rgba(178, 255, 102, 0.6)', 'rgba(102, 178, 255, 0.6)', 'rgba(255, 178, 102, 0.6)', 'rgba(255, 102, 102, 0.6)', 'rgba(178, 102, 255, 0.6)',
      'rgba(102, 255, 255, 0.6)', 'rgba(255, 255, 102, 0.6)', 'rgba(192, 192, 192, 0.6)', 'rgba(255, 153, 153, 0.6)', 'rgba(153, 255, 153, 0.6)',
      'rgba(153, 153, 255, 0.6)', 'rgba(255, 204, 153, 0.6)', 'rgba(204, 255, 204, 0.6)', 'rgba(204, 204, 255, 0.6)', 'rgba(255, 255, 204, 0.6)',
      'rgba(255, 204, 204, 0.6)', 'rgba(204, 255, 255, 0.6)', 'rgba(229, 204, 255, 0.6)', 'rgba(255, 229, 204, 0.6)', 'rgba(204, 229, 255, 0.6)',
      'rgba(204, 255, 229, 0.6)', 'rgba(229, 255, 204, 0.6)', 'rgba(255, 204, 229, 0.6)', 'rgba(229, 229, 255, 0.6)', 'rgba(255, 229, 229, 0.6)',
      'rgba(204, 204, 229, 0.6)', 'rgba(229, 204, 229, 0.6)', 'rgba(204, 229, 204, 0.6)', 'rgba(229, 229, 204, 0.6)', 'rgba(204, 229, 229, 0.6)',
      'rgba(229, 204, 204, 0.6)', 'rgba(204, 204, 204, 0.6)', 'rgba(178, 178, 178, 0.6)', 'rgba(160, 160, 160, 0.6)', 'rgba(140, 140, 140, 0.6)',
      'rgba(120, 120, 120, 0.6)', 'rgba(100, 100, 100, 0.6)', 'rgba(80, 80, 80, 0.6)', 'rgba(60, 60, 60, 0.6)', 'rgba(40, 40, 40, 0.6)',
      'rgba(20, 20, 20, 0.6)', 'rgba(10, 10, 10, 0.6)'
    ];

    if (this.productQuantityPieChart) {
      this.productQuantityPieChart.destroy();
    }

    const ctx = this.productQuantityPieRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.productQuantityPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors.slice(0, values.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: `Tổng số lượng sản phẩm: ${total}`
          }
        }
      }
    });
  });
}

}
