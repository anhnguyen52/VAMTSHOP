import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../../service/order.service';
import { ToastService } from '../../../../service/toast.service';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  isLoading = true;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalOrders = 0;
  limit = 10; // Số đơn mỗi trang

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMyOrders(this.currentPage);
  }

  loadMyOrders(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;

    this.orderService.getMyOrders(page, this.limit).subscribe({
      next: (res: any) => {
        this.orders = res.data || [];
        this.totalOrders = res.pagination?.totalOrders || 0;
        this.totalPages = res.pagination?.totalPages || 1;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.show('Failed to load your orders.');
        this.isLoading = false;
      }
    });
  }

  // Chuyển trang
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.loadMyOrders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Trang trước/sau
  prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

  // Tạo mảng số trang để hiển thị (ví dụ: 1 2 3 ... 10)
  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Các hàm cũ giữ nguyên
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US').format(value) + ' ₫'; // hoặc 'vi-VN' nếu muốn dấu chấm
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  calculateSubtotal(order: any): number {
    if (!order) return 0;
    let subtotal = order.totalAmount;
    if (order.shippingInfo?.fee > 0) subtotal -= order.shippingInfo.fee;
    if (order.discountAmount > 0) subtotal += order.discountAmount;
    if (order.pointUsedAmount > 0) subtotal += order.pointUsedAmount;
    return subtotal;
  }

  getStatusText(status: string): string {
    const map: any = {
      'Pending': 'Awaiting Confirmation',
      'Processing': 'Processing',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  }

  openOrderDetailModal(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }

  goToShop() {
    this.router.navigate(['/']);
  }
}