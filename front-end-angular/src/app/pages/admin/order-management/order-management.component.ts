import { Component, OnInit } from '@angular/core';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../service/user.service';
import { ToastService } from '../../../service/toast.service';
import { Product } from '../../../model/product.model';
import { ProductService } from '../../../service/product.service';
import { OrderService } from '../../../service/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  users: any[] = []; 
  products: any[] = [];
  
  searchTerm: string = '';
  statusFilter: string = 'all';
  shippingFilter: string = 'all';
  orderPage: number = 1;
  
  openModal: boolean = false;
  openViewModal: boolean = false;
  editingOrder: boolean = false;
  selectedOrder: any = {};
  viewingOrder: any = null;

  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  constructor(
    private OrderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.OrderService.getAllOrder().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        console.log('Danh sách don hang:', this.orders);
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange() {
    this.applyFilters();
  }
    clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }


  onStatusFilterChange() {
    this.applyFilters();
  }

  onShippingFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    // Implement filter logic
  }

  // Methods cho CRUD
  createOrder() {
    this.editingOrder = false;
    this.selectedOrder = {
      shippingInfo: {},
      items: [{ product: '', quantity: 1, price: 0 }],
      boxInfo: { weight: 0, length: 0, width: 0, height: 0 }
    };
    this.openModal = true;
  }

  editOrder(order: any) {
    this.editingOrder = true;
    this.selectedOrder = { ...order };
    this.openModal = true;
  }

  viewOrder(order: any) {
    this.viewingOrder = order;
    this.openViewModal = true;
  }

  saveOrder() {
    // Implement save logic
    this.closeModal();
  }

  deleteOrder(order: any) {
    // Implement delete logic
  }

  // Helper methods
  calculateTotal(order: any): number {
    let total = 0;
    order.items.forEach((item: any) => {
      total += item.quantity * item.price;
    });
    return total + (order.shippingInfo?.fee || 0) - (order.pointUsed || 0);
  }

  getOrderStatusText(status: string): string {
    const statusMap: any = {
      'Pending': 'Chờ xử lý',
      'Processing': 'Đang xử lý', 
      'Cancelled': 'Đã hủy',
      'Completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  }

  getShippingStatusText(status: string): string {
    const statusMap: any = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang chuẩn bị',
      'ready_to_pick': 'Sẵn sàng lấy hàng',
      'delivering': 'Đang giao',
      'delivered': 'Đã giao',
      'returned': 'Đã trả',
      'waiting_to_return': 'Chờ trả hàng',
      'cancelled': 'Đã hủy',
      'lost': 'Thất lạc'
    };
    return statusMap[status] || status;
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  }

  // Methods cho items management
  addItem() {
    this.selectedOrder.items.push({ product: '', quantity: 1, price: 0 });
  }

  removeItem(index: number) {
    this.selectedOrder.items.splice(index, 1);
  }

  // Modal methods
  closeModal() {
    this.openModal = false;
    this.selectedOrder = {};
  }

  closeViewModal() {
    this.openViewModal = false;
    this.viewingOrder = null;
  }
}