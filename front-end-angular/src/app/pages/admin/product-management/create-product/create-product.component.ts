import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../service/product.service';
import { Router } from '@angular/router';
import { CollectionService } from '../../../../service/collection.service';
import { CategoryService } from '../../../../service/category.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {
  product_name = '';
  category_id = '';
  collection_id = '';
  price: number | null = null;
  stock: number = 0;
  description = '';
  sizes: { size: string; quantity: number }[] = [];
  tags: string[] = [];
  images: File[] = [];
  imagePreviews: string[] = [];
  availableSizes = ['S', 'M', 'L', 'XL', '2XL'];

  categories: any[] = [];
  collections: any[] = [];

  constructor(
    private productService: ProductService,
    private collectionService: CollectionService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.addSize();
    this.loadCategories();
    this.loadCollection();
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Danh mục đã được tải:', this.categories);
      },
      error: (err) => console.error(err)
    });
  }

  loadCollection() {
    this.collectionService.getAllCollection().subscribe({
      next: (data) => {
        this.collections = data;
        console.log('Bộ sưu tập đã được tải:', this.collections);
      },
      error: (err) => console.error(err)
    });
  }

  updateStock() {
    this.stock = this.sizes.reduce((total, s) => total + (s.quantity || 0), 0);
  }

  onFileChange(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.images.push(...files);
      this.imagePreviews.push(...files.map(file => URL.createObjectURL(file)));
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  addSize() {
    this.sizes.push({ size: 'S', quantity: 0 });
  }

  removeSize(index: number) {
    this.sizes.splice(index, 1);
    this.updateStock();
  }

  addTag(tag: string) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  submitForm() {
    if (!this.product_name || !this.category_id || !this.collection_id || !this.price || !this.description) {
      alert('Vui lòng nhập đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('product_name', this.product_name);
    formData.append('category_id', this.category_id);
    formData.append('collection_id', this.collection_id);
    formData.append('price', String(this.price));
    formData.append('stock', String(this.stock));
    formData.append('description', this.description);
    formData.append('sizes', JSON.stringify(this.sizes));
    formData.append('tags', JSON.stringify(this.tags));
    this.images.forEach(file => formData.append('image_urls', file));

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('Tạo sản phẩm thành công');
        this.router.navigate(['/AdminLayout/Product-management']);
      },
      error: err => console.error('Lỗi khi tạo sản phẩm:', err)
    });
  }

  cancel() {
    this.router.navigate(['/AdminLayout/Product-management']);
  }
}
