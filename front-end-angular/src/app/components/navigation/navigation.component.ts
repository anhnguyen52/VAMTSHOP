import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  menuGroups = [
    {
      label: "Thống kê",
      link: '/AdminLayout/Dashboard',
    },
    {
      label: 'Sản phẩm',
      open: true,
      children: [
        { label: 'Danh sách', link: '/AdminLayout/Product-management' },
        { label: 'Tạo mới', link: '/AdminLayout/product-create' },
        { label: 'Danh mục', link: '/AdminLayout/category' }
      ]
    },
    {
      label: 'Trang',
      open: false,
      children: [
        { label: 'Danh sách', link: '/AdminLayout/page-list' },
        { label: 'Page Builder', link: '/AdminLayout/page-builder' }
      ]
    },
    {
      label: 'Khuyến mãi',
      open: false,
      children: [
        { label: 'Mã giảm giá', link: '/AdminLayout/discount' },
        { label: 'Chương trình khuyến mãi', link: '/AdminLayout/promotion' }
      ]
    }
  ];

  toggleGroup(group: any) {
    group.open = !group.open;
  }
}
