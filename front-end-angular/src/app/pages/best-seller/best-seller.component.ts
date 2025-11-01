import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { CollectionService } from '../../service/collection.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements OnInit {

  products: any[] = [];
  filterProduct :any[] = [];  
  selectedFilter: string = '';
  selectedCategory: string = '';
  selectedCollection: string = '';
  isLoading = false;
  categories: any[] = [];
  collections: any[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCollections();
    this.loadCategories();
  }

  loadProducts(){
    this.productService.getAllProduct().subscribe({
      next:(data) => {
        this.products = data;
        this.applyFilterProducts();
      },
      error:(err) => {
        console.error("Lỗi khi lấy sản phẩm: ", err);
      }
    })
  }

  loadCategories(){
    this.categoryService.getCategory().subscribe({
      next:(data) => {
        this.categories = data;
      },
      error:(err) => {
        console.error("Lỗi khi lấy danh mục: ", err);
      }
    })
  }

  loadCollections(){
    this.collectionService.getAllCollection().subscribe({
      next:(data) => {
        this.collections = data;
      },
      error:(err) => {
        console.error("Lỗi khi lấy bộ sưu tập: ", err);
      }
    })
  }

  selectCategory(name:string){
    if(this.selectedCategory === name){
      this.selectedCategory = '';
    }else{
      this.selectedCategory = name;
    }
    console.log(this.selectedCategory);
    this.applyFilterProducts();
  }

  selectCollection(name:string){
    if(this.selectedCollection === name){
      this.selectedCollection = '';
    }else{
      this.selectedCollection = name;
    }
    this.applyFilterProducts();
  }

  applyFilterProducts() {
    this.filterProduct = this.products.filter((product) => {
      const matchCategory = this.selectedCategory ? 
      product.category_id?.category_name === this.selectedCategory : true;
      const matchCollection = this.selectedCollection ? 
      product.collection_id?.collection_name === this.selectedCollection : true;
      return matchCategory && matchCollection;
    });
  }

  gotoDetailProduct(productId: any) {
    this.router.navigate(['/DetailProduct', productId]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }
}
