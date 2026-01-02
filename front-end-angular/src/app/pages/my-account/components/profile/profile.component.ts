import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface User {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {};
  originalUser: User = {}; // Để so sánh khi hủy chỉnh sửa
  isEditing = false;
  isSaving = false;

  @Output() profileUpdated = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.originalUser = { ...this.user }; // Copy để reset khi hủy
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      // Hủy chỉnh sửa → khôi phục dữ liệu cũ
      this.user = { ...this.originalUser };
    }
    this.isEditing = !this.isEditing;
  }

  async saveProfile() {
    if (this.isSaving) return;

    this.isSaving = true;

    try {
      // TODO: Gọi API update user ở đây nếu có backend
      // Ví dụ: await this.userService.updateProfile(this.user);

      // Hiện tại chỉ lưu vào localStorage (demo)
      localStorage.setItem('user', JSON.stringify(this.user));

      this.originalUser = { ...this.user };
      this.isEditing = false;
      this.profileUpdated.emit();

      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi khi cập nhật. Vui lòng thử lại.');
    } finally {
      this.isSaving = false;
    }
  }

  get fullName(): string {
    return `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim() || 'Chưa có tên';
  }
}