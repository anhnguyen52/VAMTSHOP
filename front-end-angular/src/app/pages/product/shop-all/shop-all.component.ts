import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { CategoryService } from '../../../service/category.service';
import { CollectionService } from '../../../service/collection.service';
import { forkJoin } from 'rxjs';


interface CategoryNode {
  name: string;
  type: 'category' | 'collection';
  children?: CategoryNode[];
}

@Component({
  selector: 'app-shop-all',
  templateUrl: './shop-all.component.html',
  styleUrls: ['./shop-all.component.css']
})
export class ShopAllComponent implements OnInit {
  Products: any[] = [];
  isShrink: boolean = false;
  isShowMenu = true;
  isShowSort = false;
  statusMenu = 'Hide filter';
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  private scrollPosition: number = 0;
  filteredProducts: any[] = []; 
  selectedNodeName: string = 'All'; 
  sortOptions: string = 'default'; // mặc định không sắp xếp

  visibleProducts: any[] = []; // sản phẩm hiển thị
  itemsToShow = 8; // số lượng sản phẩm hiển thị
  loadStep = 8; // số lượng sản phẩm tải thêm mỗi lần

  // Tree
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private collectionService: CollectionService,
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.loadCategoryOrCollection();
  }

  getAllProducts() {
    this.productService.getAllProduct().subscribe(
      (data) => {
        this.Products = data;
        // console.log("Tất cả sản phẩm: ", this.Products);
        this.filteredProducts = this.Products; 
        this.visibleProducts = this.filteredProducts.slice(0, this.itemsToShow);
      },
      (error) => {
        console.error("Lỗi khi lấy sản phẩm mới: ", error);
      }
    );
  }

  loadCategoryOrCollection(){
    forkJoin({
      categories: this.categoryService.getCategory(),
      collections: this.collectionService.getAllCollection()
    }).subscribe({
      next: ({categories, collections}) => {
        const treeData : CategoryNode[] = [
          {name: "All", type: 'category'},
          ...categories.map((cat:any) => ({name: cat.category_name, type: 'category'})),
          {name: 'Collections', type: 'category',
            children: collections.map((col:any) => ({name: col.collection_name, type: 'collection'}))
          }
        ]
        this.dataSource.data = treeData;
      }, 
      error: (err) => {
        console.error("Lỗi khi lấy danh mục hoặc bộ sưu tập: ", err);
      }
    });
  }

  filterProduct(node: CategoryNode) {
    this.selectedNodeName = node.name; 
      if (node.name === 'All' || node.name === 'Collections') {
        this.filteredProducts = this.Products;
      } else if (node.type === 'category') {
        this.filteredProducts = this.Products.filter(
          product => product.category_id?.category_name === node.name
        );
      } else if (node.type === 'collection') {
        this.filteredProducts = this.Products.filter(
          product => product.collection_id?.collection_name === node.name
        );
      } 

      this.visibleProducts = this.filteredProducts.slice(0, this.itemsToShow);

      this.sortProduct()
  }

  loadMoreProducts() {
    this.itemsToShow += this.loadStep; // Tăng số lượng sản phẩm hiển thị
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsToShow); // Cập nhật danh sách sản phẩm hiển thị
  }

  goToDetailProduct(productId: any) {
    console.log('productId:', productId);
    this.router.navigate([`/DetailProduct/${productId}`]);
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;
    this.isShrink = currentScroll > this.scrollPosition && currentScroll > 50;
    this.scrollPosition = currentScroll;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

  toggleMenu() {
    this.isShowMenu = !this.isShowMenu;
    this.statusMenu = this.isShowMenu ? 'Hide filter' : 'Show filter';
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  toggleSort() {
    this.isShowSort = !this.isShowSort;
  }

  sortProduct(){
    switch( this.sortOptions){
      case 'new':
        this.filteredProducts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'old':
        this.filteredProducts.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); 
        break;
      case 'low':
        this.filteredProducts.sort((a,b) => a.price - b.price);
        break;
      case 'high':
        this.filteredProducts.sort((a,b) => b.price - a.price);
        break;
    }
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsToShow); 
  }

  applySort(option: string){
    this.sortOptions = option;
    this.sortProduct()
    this.isShowSort = false; 
  }
}
