import { Component, OnInit } from '@angular/core';
import { SaleCampaignService } from '../../../service/sale-campaign.service';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../../../service/toast.service';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-sale-campaign-management',
  templateUrl: './sale-campaign-management.component.html',
  styleUrl: './sale-campaign-management.component.css'
})
export class SaleCampaignManagementComponent implements OnInit {
    campaigns: any[] = [];
    filteredCampaigns: any[] = [];
    allProducts: any[] = [];
    searchTerm: string = '';
    statusFilter: string = 'all';
    campaignPage: number = 1;
    editingCampaign: any = null;
    selectedCampaign = {
      name: '',
      images: [] as File[],
      description: '',
      products: [] as any[],
      percentage: 0,
      startDate: new Date(),
      endDate: new Date(),
      isActive: false
    };
    imagePreviews: string[] = [];
    openModal: boolean = false;
    faPenToSquare = faPenToSquare;
    faTrash = faTrash;

  constructor(private saleCampaignService: SaleCampaignService,
    private toast: ToastService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadSaleCampaigns();
    this.loadProducts();
  }

  loadSaleCampaigns(){
    this.saleCampaignService.getAllCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data.data;
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  clearSearch(){
    this.searchTerm = '';
    this.applyFilters();  
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.campaigns];

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

    this.filteredCampaigns = result;
  }

  createCampaign() {
    this.openModal = true;
    this.editingCampaign = null;
    this.selectedCampaign = {
      name: '',
      images: [] as File[],
      description: '',
      products: [] as any[],
      percentage: 0,
      startDate: new Date(),
      endDate: new Date(),
      isActive: true
    };
  }

  editCampaign(campaign: any) {
    this.openModal = true;
    this.editingCampaign = campaign;
    this.selectedCampaign = { 
      ...campaign,
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '', 
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      products: campaign.products ? campaign.products.map((p: any) => p._id || p) : []
    };
  }


  deleteCampaign(campaign: any){
    this.saleCampaignService.deleteCampaign(campaign._id).subscribe({
      next: () => {
        this.loadSaleCampaigns();
        this.toast.show('Campaign deleted successfully');
      },
      error: (err) => console.error(err)
    })
  }

  closeModal(){
    this.openModal = false;
  }

  saveCampaign() {
    if (!this.editingCampaign) {
      const formData = new FormData();

      formData.append('name', this.selectedCampaign.name);
      formData.append('description', this.selectedCampaign.description);

      // gửi products dưới dạng JSON string
      formData.append('products', JSON.stringify(this.selectedCampaign.products));

      this.selectedCampaign.images.forEach(file => {
        formData.append('image_urls', file);
      });

      formData.append('percentage', this.selectedCampaign.percentage.toString());
      formData.append('startDate', this.selectedCampaign.startDate.toString());
      formData.append('endDate', this.selectedCampaign.endDate.toString());
      formData.append('isActive', this.selectedCampaign.isActive.toString());

      this.saleCampaignService.createCampaign(formData).subscribe({
        next: () => {
          this.loadSaleCampaigns();
          this.closeModal();
          this.toast.show('Campaign created successfully');
        },
        error: (err) => console.error(err)
      });
    }
  }

  changeActive(){
    this.selectedCampaign.isActive = !this.selectedCampaign.isActive;
    console.log(this.selectedCampaign);
    this.saleCampaignService.updateCampaign(this.editingCampaign._id, this.selectedCampaign).subscribe({
      next: () => {
        this.toast.show(`Campaign ${this.selectedCampaign.isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadSaleCampaigns();
      },error: (err) => {
        console.error('Lỗi cập nhật trạng thái campaign:', err);
        this.toast.show('Cập nhật trạng thái campaign thất bại');
      }
    })
  }

  loadProducts(){
    this.productService.getAllProduct().subscribe({
      next: (products) => {
        this.allProducts = products;
        console.log(this.allProducts);
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
      }
    })
  }
  

  onFileChange(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.selectedCampaign.images.push(...files);
      this.imagePreviews.push(...files.map(file => URL.createObjectURL(file)));
    }
  }

  removeImage(index: number) {
    this.selectedCampaign.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

}