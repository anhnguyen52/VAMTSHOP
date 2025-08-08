import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { get } from 'http';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../service/cart.service';
import { ToastService } from '../../../service/toast.service';
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
  slideWidth = 500; 
  isLoading = false;
  cartItems: any[] = [];
  newProducts: any[] = [];
  

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService
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

  addProductToCart(productId: string) {
    const user = localStorage.getItem('user');
  
    if (user) {
      const userId = JSON.parse(user)._id;
      this.cartService.addToCart(userId, productId, 1).subscribe(
        (data) => {
          console.log("Thêm sản phẩm vào giỏ hàng thành công: ", data);
          this.toastService.show('Đã thêm vào giỏ hàng!');
        },
        (error) => {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng: ", error);
          alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
        }
      );
    } else {
      // Lấy lại cartItems từ localStorage để đảm bảo đồng bộ
      const cartItemsString = localStorage.getItem('cartItems');
      this.cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
  
      const index = this.cartItems.findIndex(item => item.product_id === productId);
  
      if (index !== -1) {
        this.cartItems[index].quantity += 1;
        console.log("Cập nhật số lượng sản phẩm trong giỏ hàng: ", this.cartItems);
      } else {
        this.cartItems.push({ product_id: productId, quantity: 1 });
        console.log("Thêm sản phẩm mới vào giỏ hàng: ", this.cartItems);
      }
  
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this.toastService.show('Đã thêm vào giỏ hàng!');
    }
  }
  

  goToDetailProduct(productId:string){
    this.router.navigate([`/DetailProduct/${productId}`]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

}
