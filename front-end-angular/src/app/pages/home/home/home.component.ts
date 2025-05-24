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
  filterProducts: any[] = [];
  filterOption: string = 'default';
  Products: any[] = [];
  isLoading: boolean = false;


  constructor(
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.get4NewProducts();
    this.productService.getAllProduct().subscribe(
      (data) => {
        this.Products = data;
        this.isLoading = false;
      }
    );
  }

  get4NewProducts() {
    this.productService.get4NewProduct().subscribe(
      (data) =>{
        this.newProducts = data;
        this.filterProducts = this.newProducts;
        this.isLoading = false;
      },(error)=>{
        console.error("Lỗi khi lấy sản phẩm mới: ", error);
        this.isLoading = false;
      }
    )
  }

  filter(option: string){
    this.isLoading = true;
    if(option === 'Bags'){
      this.filterProducts = this.Products.filter(product => product.category_id?.category_name === 'Bags').slice(0, 4);
      this.isLoading = false;
    }else if(option === 'Accessories'){
      this.filterProducts = this.Products.filter(product => product.category_id?.category_name === 'Accessories').slice(0, 4);
      this.isLoading = false;
    }else if(option === 'Clothing'){
      this.filterProducts = this.Products.filter(product => product.category_id?.category_name === 'Clothing').slice(0, 4);
      this.isLoading = false;
    }else if(option === 'Jewelry'){
      this.filterProducts = this.Products.filter(product => product.category_id?.category_name === 'Jewelry').slice(0, 4);
      this.isLoading = false;
    }
  }

  goToDetailProduct(productId:string){
    this.router.navigate([`/DetailProduct/${productId}`]);
  }
}
