// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-homepage',
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.css']
// })
// export class HomepageComponent implements OnInit{
  
//   constructor() {}
//   ngOnInit() {
//     const listImage = document.querySelector('.list-image') as HTMLElement;
//     const imgs = document.getElementsByTagName('img');
//     const btnLeft = document.querySelector('.btn-left') as HTMLElement;
//     const btnRight = document.querySelector('.btn-right') as HTMLElement;
//     let lengthImgs = imgs.length ;
//     let current = 0 ;

//     const handleBanner = () => {
//       if(current == lengthImgs - 1){
//         current = 0;
//         let width = imgs[0].offsetWidth
//         listImage.style.transform = `translateX(0px)`
//       }else{
//         current++
//         let width = imgs[0].offsetWidth
//         listImage.style.transform = `translateX(${width * -1 * current}px)`
//       }
//     }

//     let handleChangeSlide = setInterval(handleBanner,3000);

//     btnRight.addEventListener('click',()=>{
//       clearInterval(handleChangeSlide);
//       handleBanner();
//       handleChangeSlide = setInterval(handleBanner,3000); 
//     });

//     btnLeft.addEventListener('click', () => {
//       clearInterval(handleChangeSlide);
//       if(current == 0 ){
//         current = lengthImgs - 1;
//         let width = imgs[0].offsetWidth
//         listImage.style.transform = `translateX(${width * -1 * current}px)`
//       }else{
//         current -- 
//         let width = imgs[0].offsetWidth
//         listImage.style.transform = `translateX(${width * -1 * current}px)`
//       }
//       handleChangeSlide = setInterval(handleBanner,3000); 
//     })
//   }
// }

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  @ViewChild('slider') sliderRef!: ElementRef;
  @ViewChild('image') imageRef!: ElementRef;
  @ViewChild('productSliderWomen') productSliderWomen!: ElementRef;
  @ViewChild('productSliderMen') productSliderMen!: ElementRef;
  
  current = 0;
  slideInterval: any;
  imageCount = 4; // Số lượng ảnh
  currentIndex = 0;
  visibleCount = 5;
  itemWidth = 236 + 30; // Width + margin
  totalItems = 10;

  activeTab: string = 'women';
  showTab(tab: string) {
    this.activeTab = tab;
  }
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.startAutoSlide();
  }

  getImageWidth(): number {
    return this.imageRef.nativeElement.offsetWidth;
  }

  moveSlide(index: number): void {
    const width = this.getImageWidth();
    this.sliderRef.nativeElement.style.transform = `translateX(-${width * index}px)`;
  }

  handleNext(): void {
    this.stopAutoSlide();
    this.current = (this.current + 1) % this.imageCount;
    this.moveSlide(this.current);
    this.startAutoSlide();
  }

  handlePrev(): void {
    this.stopAutoSlide();
    this.current = (this.current - 1 + this.imageCount) % this.imageCount;
    this.moveSlide(this.current);
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.current = (this.current + 1) % this.imageCount;
      this.moveSlide(this.current);
    }, 3000);
  }

  stopAutoSlide(): void {
    clearInterval(this.slideInterval);
  }

  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  isSizeListOpen = false;

  toggleSizeList() {
    this.isSizeListOpen = !this.isSizeListOpen;
  }

  // slide in IAM women
  scrollNext() {
    if (this.currentIndex + this.visibleCount < this.totalItems) {
      this.currentIndex++;
      this.updateScroll();
    }
  }

  scrollPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateScroll();
    }
  }

  updateScroll() {
    const scrollAmount = this.currentIndex * this.itemWidth;
    this.productSliderWomen.nativeElement.style.transform = `translateX(-${scrollAmount}px)`;
  }

  // cái này cho IAM Men
  scrollNext2() {
    if (this.currentIndex + this.visibleCount < this.totalItems) {
      this.currentIndex++;
      this.updateScroll2();
    }
  }

  scrollPrev2() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateScroll2();
    }
  }

  updateScroll2() {
    const scrollAmount = this.currentIndex * this.itemWidth;
    this.productSliderMen.nativeElement.style.transform = `translateX(-${scrollAmount}px)`;
  }
}
