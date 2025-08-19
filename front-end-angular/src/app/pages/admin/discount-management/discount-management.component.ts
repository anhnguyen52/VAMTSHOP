import { Component, OnInit } from '@angular/core';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DiscountService } from '../../../service/discount.service';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-discount-management',
  templateUrl: './discount-management.component.html',
  styleUrls: ['./discount-management.component.css']
})
export class DiscountManagementComponent implements OnInit {
  discounts: any[] = [];
  filteredDiscounts: any[] = [];

  searchTerm: string = '';
  statusFilter: string = 'all';
  discountPage: number = 1;
  editingDiscount: any = null;
  selectedDiscount = {
    code: '',
    type: 'percentage',
    value: 0,
    usageLimit: 1,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
    conditions: {
      minPurchase: 0,
      minOrders: 0,
      minItemsInCart: 0
    }
  };
  openModal: boolean = false;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  constructor(private discountService: DiscountService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.discountService.getAllDiscounts().subscribe({
      next: (res) => {
        this.discounts = res;
        this.applyFilters();
      },
      error: (err) => console.error('Lỗi load discounts:', err)
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

  applyFilters() {
    let result = [...this.discounts];

    if (this.searchTerm.trim()) {
      const keyword = this.searchTerm.toLowerCase();
      result = result.filter((d) =>
        d.code.toLowerCase().includes(keyword) ||
        d.type.toLowerCase().includes(keyword) ||
        (d.isActive ? 'active' : 'inactive').includes(keyword)
      );
    }

    if (this.statusFilter === 'active') {
      result = result.filter((d) => d.isActive);
    } else if (this.statusFilter === 'inactive') {
      result = result.filter((d) => !d.isActive);
    } else if (this.statusFilter === 'newest') {
      result = result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    this.filteredDiscounts = result;
  }

  createDiscount() {
    this.selectedDiscount = {
      code: '',
      type: 'percentage',
      value: 0,
      usageLimit: 1,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true,
      conditions: {
        minPurchase: 0,
        minOrders: 0,
        minItemsInCart: 0
      }
    };
    this.editingDiscount = null;
    this.openModal = true;
  }

  editDiscount(discount: any) {
    this.selectedDiscount = {
      ...discount,
      startDate: discount.startDate ? discount.startDate.split('T')[0] : '', 
      endDate: discount.endDate ? discount.endDate.split('T')[0] : '',
      conditions: {
        minPurchase: discount.conditions?.minPurchase || 0,
        minOrders: discount.conditions?.minOrders || 0,
        minItemsInCart: discount.conditions?.minItemsInCart || 0
      }
    };
    this.editingDiscount = discount;
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  saveDiscount(){
    if(this.editingDiscount){
      this.discountService.updateDiscount(this.editingDiscount._id, this.selectedDiscount).subscribe({
        next: () => {
          this.toast.show('Discount updated successfully');
          this.loadDiscounts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi cập nhật discount:', err);
          this.toast.show('Cập nhật discount thất bại');
        }
      })
    }

    if(!this.editingDiscount){
      this.discountService.createDiscount(this.selectedDiscount).subscribe({
        next: () => {
          this.toast.show('Discount created successfully');
          this.loadDiscounts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Lỗi tạo discount:', err);
          this.toast.show('Tạo discount thất bại');
        }
      })
    }
  }

  changeActive(){
    this.selectedDiscount.isActive = !this.selectedDiscount.isActive;
    this.discountService.updateDiscount(this.editingDiscount._id, this.selectedDiscount.isActive).subscribe({
      next: () => {
        this.toast.show(`Discount ${this.selectedDiscount.isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadDiscounts();
      },error: (err) => {
        console.error('Lỗi cập nhật trạng thái discount:', err);
        this.toast.show('Cập nhật trạng thái discount thất bại');
      }
    })
  }

  deleteDiscount(discount: any) {
    if (!confirm(`Bạn có chắc muốn xóa discount "${discount.code}"?`)) return;
    this.discountService.deleteDiscount(discount._id).subscribe({
      next: () => {
        this.loadDiscounts();
        this.closeModal();
      },
      error: (err) => console.error('Lỗi xóa discount:', err)
    });
  }
}
