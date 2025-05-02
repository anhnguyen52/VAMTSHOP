import { Component, OnInit } from '@angular/core';
import { faCartShopping, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../../service/authentication.service';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  faCart = faCartShopping;
  faUser = faUser;
  faHeart = faHeart;
  newProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.get4NewProducts();
  }

  get4NewProducts() {
    this.productService.get4NewProduct().subscribe(
      (data) =>{
        this.newProducts = data;
        // console.log("Sản phẩm mới: ", this.newProducts);
      },(error)=>{
        console.error("Lỗi khi lấy sản phẩm mới: ", error);
      }
    )
  }

  goToDetailProduct(productId:string){
    this.router.navigate([`/DetailProduct/${productId}`]);
  }
}
