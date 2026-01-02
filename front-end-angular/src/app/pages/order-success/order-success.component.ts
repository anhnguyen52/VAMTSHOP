import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  orderId: string | null = null;
  totalPrice: number = 0;
  name: string = '';
  phoneNumber: string = '';
  address: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Lấy dữ liệu từ query params (nếu bạn truyền qua URL)
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
    this.totalPrice = Number(this.route.snapshot.queryParamMap.get('total')) || 0;
    this.name = this.route.snapshot.queryParamMap.get('name') || '';
    this.phoneNumber = this.route.snapshot.queryParamMap.get('phoneNumber') || '';
    this.address = this.route.snapshot.queryParamMap.get('address') || '';

    // Nếu không có dữ liệu (truy cập trực tiếp), redirect về home hoặc cart
    // if (!this.orderId) {
    //   this.router.navigate(['/']); // hoặc '/cart'
    // }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }

  continueShopping() {
    this.router.navigate(['/']); // hoặc trang sản phẩm
  }
}