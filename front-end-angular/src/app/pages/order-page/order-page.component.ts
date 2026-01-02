  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { CartService } from '../../service/cart.service';
  import { ProductService } from '../../service/product.service';
  import { OrderService } from '../../service/order.service';
  import { NgForm } from '@angular/forms';
  import { ToastService } from '../../service/toast.service';

  @Component({
    selector: 'app-order-page',
    templateUrl: './order-page.component.html',
    styleUrls: ['./order-page.component.css']
  })
  export class OrderPageComponent implements OnInit {
    cartItems: any[] = [];
    listItems: any[] = [];
    subtotal = 0;
    shipping = 0;
    totalPrice = 0;
    userId = '';
    isLoading = true;
    isSubmitting = false;
    isCalculatingFee = false;

    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];

    orderData = {
      name: '',
      phoneNumber: '',
      provinceId: '',
      districtId: '',
      wardCode: '',
      address: '',
      note: '',
      paymentMethod: 'COD' as 'COD' | 'Online'
    };

    constructor(
      private router: Router,
      private cartService: CartService,
      private productService: ProductService,
      private orderService: OrderService,
      private toastService: ToastService
    ) {}

    ngOnInit(): void {
      this.checkLoginAndLoadCart();
      this.loadProvinces();
    }

    checkLoginAndLoadCart() {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      const user = localStorage.getItem('user');
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      const userData = JSON.parse(user);
      this.userId = userData._id;

      this.cartService.getCartByUserId(this.userId).subscribe({
        next: (data) => {
          this.cartItems = data?.items || [];
          this.fetchProductDetails();
        },
        error: () => {
          this.cartItems = [];
          this.fetchProductDetails();
        }
      });
    }

    fetchProductDetails() {
      this.isLoading = true;
      this.listItems = [];

      if (this.cartItems.length === 0) {
        this.isLoading = false;
        return;
      }

      const requests = this.cartItems.map(item =>
        this.productService.getProductById(item.product_id).toPromise().then(data => ({
          data,
          size: item.size,
          quantity: item.quantity
        }))
      );

      Promise.all(requests)
        .then(results => {
          this.listItems = results;
          this.calculateSubtotal();
        })
        .finally(() => this.isLoading = false);
    }

    calculateSubtotal() {
      this.subtotal = this.listItems.reduce((sum, item) => {
        const price = item.data.saledPrice || item.data.price;
        return sum + price * item.quantity;
      }, 0);
      this.totalPrice = this.subtotal + this.shipping;
    }

    loadProvinces() {
      this.orderService.getProvinces().subscribe({
        next: (data) => this.provinces = data,
        error: (err) => console.error('Lỗi load tỉnh:', err)
      });
    }

    onProvinceChange() {
      this.districts = [];
      this.wards = [];
      this.orderData.districtId = '';
      this.orderData.wardCode = '';
      this.shipping = 0;
      this.totalPrice = this.subtotal;

      if (this.orderData.provinceId) {
        this.orderService.getDistricts(this.orderData.provinceId).subscribe({
          next: (data) => this.districts = data,
          error: () => alert('Không tải được quận/huyện')
        });
      }
    }

    onDistrictChange() {
      this.wards = [];
      this.orderData.wardCode = '';
      this.shipping = 0;
      this.totalPrice = this.subtotal;

      console.log('District changed:', this.orderData.districtId);

      if (this.orderData.districtId) {
        this.orderService.getWards(this.orderData.districtId).subscribe({
          next: (data) => this.wards = data,
          error: () => alert('Không tải được phường/xã')
        });
      }
    }

    calculateShippingFee() {
      if (!this.orderData.wardCode || !this.orderData.districtId) return;

      this.isCalculatingFee = true;
      const weight = this.listItems.reduce((sum, item) => sum + (item.quantity * 500), 0); 
      const insurance_value = this.subtotal;

      // console.log('Calculating shipping fee with:', {
      //   to_ward_code: this.order.wardCode,
      //   to_district_id: +this.order.districtId,
      //   weight: weight > 100 ? weight : 500,
      //   insurance_value
      // });

      this.orderService.calculateShippingFee({
        to_ward_code: this.orderData.wardCode,
        to_district_id: +this.orderData.districtId,
        weight: weight > 100 ? weight : 500,
        insurance_value
      }).subscribe({
        next: (res) => {
          this.shipping = res.data?.service_fee || 0;
          this.totalPrice = this.subtotal + this.shipping;
        },
        error: () => {
          this.shipping = 35000; // fallback phí cố định
          this.totalPrice = this.subtotal + this.shipping;
          alert('Không tính được phí ship chính xác, áp dụng phí mặc định 35.000đ');
        },
        complete: () => this.isCalculatingFee = false
      });
    }

    formatCurrency(value: number): string {
      return new Intl.NumberFormat('vi-VN').format(value);
    }

    onSubmit(form: NgForm) {
      if (!form.valid || this.isSubmitting || !this.orderData.wardCode) return;

      this.isSubmitting = true;

      const selectedProvince = this.provinces.find(p => p.ProvinceID === +this.orderData.provinceId);
      const selectedDistrict = this.districts.find(d => d.DistrictID === +this.orderData.districtId);
      const selectedWard = this.wards.find(w => w.WardCode === this.orderData.wardCode);

      const orderData = {
        userId: this.userId,
        items: this.listItems.map(item => ({
          productId: item.data._id,
          productName: item.data.product_name,
          size: item.size,
          quantity: item.quantity,
          price: item.data.saledPrice || item.data.price,
          image: item.data.image_urls[0]?.url
        })),
        shippingInfo: {
          name: this.orderData.name,
          phoneNumber: this.orderData.phoneNumber,
          provinceName: selectedProvince?.ProvinceName || '',
          districtName: selectedDistrict?.DistrictName || '',
          wardName: selectedWard?.WardName || '',
          address: this.orderData.address,
          note: this.orderData.note,
          fee: this.shipping
        },
        paymentMethod: this.orderData.paymentMethod,
        subtotal: this.subtotal,
        shippingFee: this.shipping,
        status: 'pending'
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (response: any) => {
          this.toastService.show('Đặt hàng thành công!', 3000);
          console.log('Order created with ID:', response);
          this.router.navigate(['/OrderSuccess'], {
            queryParams: {
              orderId: response.orderCode,
              total: response.data.totalAmount,
              name: response.data.shippingInfo.name,
              phoneNumber: response.data.shippingInfo.phoneNumber,
              address: `${response.data.shippingInfo.address}, ${response.data.shippingInfo.wardName}, ${response.data.shippingInfo.districtName}, ${response.data.shippingInfo.provinceName}`
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.toastService.show('Đặt hàng thất bại. Vui lòng thử lại.', 3000);
          this.isSubmitting = false;
        }
      });
    }
  }