import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { get } from 'http';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit {

  productId: string | null = null;
  product: any = null;
  items: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  currentIndex = 0;
  slideWidth = 500; // Chiều rộng mỗi ảnh
  isLoading = false;

  newProducts: any[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.getDetailProduct(id);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    })  
    this.get4NewProducts();
  }

  getDetailProduct(id: string) {
    this.productService.getProductById(id).subscribe(
      (data) =>{
        this.product = data;
        this.isLoading = false;
        // console.log("Chi tiết sản phẩm: ", this.product);
      },
      (error)=>{
        console.error("Lỗi khi lấy chi tiết sản phẩm: ", error);
        this.isLoading = false;
      }
    )
  }

  @ViewChild('slideContainer', { static: false }) slideContainer!: ElementRef;

  next() {
    if (!this.product?.image_urls) return;
    const length = this.product.image_urls.length;
    this.currentIndex = (this.currentIndex + 1) % length;
  }
  
  prev() {
    if (!this.product?.image_urls) return;
    const length = this.product.image_urls.length;
    this.currentIndex = (this.currentIndex - 1 + length) % length;
  }

  get4NewProducts() {
    this.productService.get4NewProduct().subscribe(
      (data) =>{
        this.newProducts = data;
        // console.log("Sản phẩm mới: ", this.newProducts);
        this.isLoading = false;
      },(error)=>{
        console.error("Lỗi khi lấy sản phẩm mới: ", error);
        this.isLoading = false;
      }
    )
  }

  goToDetailProduct(productId:string){
    this.router.navigate([`/DetailProduct/${productId}`]);
  }

}
