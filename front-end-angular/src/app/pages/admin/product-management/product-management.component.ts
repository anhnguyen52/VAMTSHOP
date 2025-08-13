import { Component } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../model/product.model';
import { Router } from '@angular/router';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
  
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent {
products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  faPenToSquare = faPenToSquare;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProduct().subscribe({
      next: (data) => {
        console.log('Sản phẩm đã được tải:', data);
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error(err)
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.product_name.toLowerCase().includes(term) ||
      (p.sku && p.sku.toLowerCase().includes(term))
    );
  }

  
}
