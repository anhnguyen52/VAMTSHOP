import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;

  cartItems: any[] = [];
  listItems: any[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  totalPrice: number = 0;
  userId: string = '';
  isLoading = false;
  isEmpty = false;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loadCart();
  }

  loadCart() {
    if (typeof window === 'undefined') return;
  
    const user = localStorage.getItem('user');
    const localCartJson = localStorage.getItem('cartItems');
    const localCart = localCartJson ? JSON.parse(localCartJson) : [];
    console.log("Giỏ hàng trên localStorage: ", localCart);
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData._id;
      this.isLoggedIn = true;

      if(localCart?.length > 0){
        this.cartService.mergeCart(this.userId, localCart).subscribe({
          next:() => {
            localStorage.removeItem('cartItems');
            this.loadCartFromServer();
          },
          error:(err) => {
            console.error("Lỗi khi gửi giỏ hàng: ", err);
            console.log()
            this.loadCartFromServer();
          }
        })
      }else{
        this.loadCartFromServer();
      }
  
     
    } else {
      this.isLoggedIn = false;
      const storedItems = localStorage.getItem('cartItems');
      this.cartItems = storedItems ? JSON.parse(storedItems) : [];
      console.log("Giỏ hàng trên localStorage CartItems: ", this.cartItems);
      this.fetchProductDetails();
    }
  }

  loadCartFromServer(){
    this.cartService.getCartByUserId(this.userId).subscribe({
          next: (data) => {
            this.cartItems = data?.items || [];
            console.log("Giỏ hàng từ API cartItems: ", this.cartItems);
            this.fetchProductDetails();
          },
          error: (err) => {
            console.error("Lỗi khi lấy giỏ hàng từ API: ", err);
            this.cartItems = [];
            this.fetchProductDetails();
          }
        });
  }
  

  fetchProductDetails() {
    this.isLoading = true;
    this.listItems = [];
    this.subtotal = 0;

    const requests = this.cartItems.map(item =>
      this.productService.getProductById(item.product_id).toPromise().then(data => ({
        data,
        quantity: item.quantity
      }))
    );


    Promise.all(requests)
      .then(results => {
        this.listItems = results;
        this.calculateTotal();
      })
      .catch(error => console.error("Lỗi khi lấy sản phẩm:", error))
      .finally(() => this.isLoading = false);
  }

  calculateTotal() {
    this.subtotal = this.listItems.reduce(
      (sum, item) => sum + item.data.price * item.quantity, 0
    );

    const isCartEmpty = this.listItems.length === 0;
    this.shipping = (isCartEmpty || this.subtotal >= 2000000) ? 0 : 50000;
    this.totalPrice = this.subtotal + this.shipping;
  }

  updateLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  updateQuantity(product: any) {
    const item = this.cartItems.find(i => i.product_id === product.data._id);
    if (item) {
      item.quantity = product.quantity;
    }

    if(!this.isLoggedIn) {
      this.updateLocalStorage();
    }

    this.calculateTotal();
  }

  increaseQuantity(product: any) {
    product.quantity++; 
    this.updateQuantity(product);
  
    if (this.isLoggedIn) {
      const productId = product.data?._id;
      if (!productId) {
        console.error("Không tìm thấy productId để cập nhật giỏ hàng.");
        return;
      }
  
      this.cartService.addToCart(this.userId, productId, 1).subscribe({
        next: (data) => {
          // console.log("Đã tăng số lượng sản phẩm trong giỏ hàng (API):", data);
        },
        error: (error) => {
          console.error("Lỗi khi tăng số lượng sản phẩm qua API:", error);
        }
      });
    }
  }
  

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.updateQuantity(product);
    }

    if (this.isLoggedIn) {
      const productId = product.data?._id;
      if (!productId) {
        console.error("Không tìm thấy productId để cập nhật giỏ hàng.");
        return;
      }
  
      this.cartService.removeFromCart(this.userId, productId).subscribe({
        next: (data) => {
          // console.log("Đã giamr số lượng sản phẩm trong giỏ hàng (API):", data);
        },
        error: (error) => {
          console.error("Lỗi khi gimar số lượng sản phẩm qua API:", error);
        }
      });
    }
  }

  removeItem(product: any) {
    if (!this.isLoggedIn) {
      this.cartItems = this.cartItems.filter(item => item.product_id !== product.data._id);
      this.listItems = this.listItems.filter(item => item.data._id !== product.data._id);
      this.updateLocalStorage();
    }else{
      this.cartService.deleteFromCart(this.userId, product.data._id).subscribe({
        next: (data) => {
          // console.log("Đã xóa sản phẩm khỏi giỏ hàng (API):", data);
          this.cartItems = this.cartItems.filter(item => item.product_id !== product.data._id);
          this.listItems = this.listItems.filter(item => item.data._id !== product.data._id);
        },
        error: (error) => {
          console.error("Lỗi khi xóa sản phẩm qua API:", error);
        }
      });
    }
    this.calculateTotal();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

  goBackHome(){
    this.router.navigate(['/']);
  }
  
  goToLogin(){
    this.router.navigate(['/Login']);
  }
}
