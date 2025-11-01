import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaleCampaignService } from '../../service/sale-campaign.service';

@Component({
  selector: 'app-sale-campaign',
  templateUrl: './sale-campaign.component.html',
  styleUrl: './sale-campaign.component.css'
})
export class SaleCampaignComponent implements OnInit {

  saleCampaigns: any[] = [];
  isLoading = false;
  products: any[] = [];
  hoveredIndex: number | null = null;

  constructor(
    private router: Router,
    private saleCampaignService: SaleCampaignService
  ) { }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loadSaleCampaigns();
  }

  shrinkBanner(index: number) {
    this.hoveredIndex = index;
  }

  resetBanner() {
    this.hoveredIndex = null;
  }

  loadSaleCampaigns() {
    this.isLoading = true;
    this.saleCampaignService.getAllCampaigns().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.saleCampaigns = data.data;
        console.log("Chiến dịch khuyến mãi: ", this.saleCampaigns);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Lỗi khi lấy chiến dịch khuyến mãi: ", err);
      }
    });
  }

  goToShopAll() {
    this.router.navigate(['/ShopAll']);
  }

  goToProductDetail(productId: any) {
    this.router.navigate(['/DetailProduct', productId]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }
}