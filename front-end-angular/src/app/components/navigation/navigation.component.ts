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
      label: 'Người dùng và quyền hạn',
      open: false,
      children: [
        { label: 'Quản lý người dùng', link: '/AdminLayout/user-management' },
        { label: 'Khiếu nại', link: '/AdminLayout/role-management' }
      ]
    },
    {
      label: 'Sản phẩm',
      open: true,
      children: [
        { label: 'Danh sách', link: '/AdminLayout/Product-management' },
        { label: 'Tạo mới', link: '/AdminLayout/Product-create' },
        { label: 'Danh mục / Bộ sưu tập', link: '/AdminLayout/Category-collection-management' },
        { label: 'Rating', link: '/AdminLayout/Product-detail' }
      ]
    },
    {
      label: 'Đơn hàng',
      open: false,
      children: [
        { label: 'Quản lý đơn hàng', link: '/AdminLayout/page-list' },
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
