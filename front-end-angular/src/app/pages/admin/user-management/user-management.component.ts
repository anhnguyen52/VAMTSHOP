// Component TypeScript Code
import { Component, OnInit } from '@angular/core';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../service/user.service';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'] 
})
export class UserManagementComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faEye = faEye;

  searchTerm: string = '';
  users: any[] = []; 
  admins: any[] = [];
  filteredUsers: any[] = [];
  filteredAdmins: any[] = []; 
  selectedUser: any = null;

  statusFilter: string = 'all'; 
  userPage = 1;
  adminPage = 1;

  constructor(
    private userService: UserService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: res => {
        this.users = res.data.filter((u: any) => u.role === 'USER');
        this.admins = res.data.filter((u: any) => u.role === 'ADMIN');
        
        this.applyFilters();
      },
      error: err => {
        console.error('Error loading users:', err);
      }
    });
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase().trim();

    let userResult = [...this.users];

    if (term) {
      userResult = userResult.filter((user) => {
        const firstName = (user.first_name || '').toLowerCase();
        const lastName = (user.last_name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phone || '').toString().toLowerCase();
        
        const matches = firstName.includes(term) || 
                       lastName.includes(term) || 
                       email.includes(term) || 
                       phone.includes(term);
        
        return matches;
      });
    }

    if (this.statusFilter === 'active') {
      userResult = userResult.filter(u => u.is_active === true);
    } else if (this.statusFilter === 'inactive') {
      userResult = userResult.filter(u => u.is_active === false);
    } else if (this.statusFilter === 'newest') {
      userResult = [...userResult].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    let adminResult = [...this.admins]; 

    if (term) {
      adminResult = adminResult.filter((admin) => {
        const firstName = (admin.first_name || '').toLowerCase();
        const lastName = (admin.last_name || '').toLowerCase();
        const email = (admin.email || '').toLowerCase();
        const phone = (admin.phone || '').toString().toLowerCase();
        
        const matches = firstName.includes(term) || 
                       lastName.includes(term) || 
                       email.includes(term) || 
                       phone.includes(term);
        
        return matches;
      });
    }

    if (this.statusFilter === 'active') {
      adminResult = adminResult.filter(a => a.is_active === true);
    } else if (this.statusFilter === 'inactive') {
      adminResult = adminResult.filter(a => a.is_active === false);
    } else if (this.statusFilter === 'newest') {
      adminResult = [...adminResult].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    this.filteredUsers = userResult;
    this.filteredAdmins = adminResult;

    this.userPage = 1;
    this.adminPage = 1;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  editUser(user: any) {
    this.selectedUser = user;
  }

  setInactive(user: any) {
    this.userService.updateUser(user._id, { is_active: false }).subscribe({
      next: () => {
        user.is_active = false;
        this.applyFilters();
        this.toast.show('User set to inactive'); 
      },
      error: err => {
        console.error('Error setting inactive:', err);
        this.toast.show('Failed to set user as inactive');
      }
    });
  }

  deleteUser(user: any) {
    if (!user.is_active) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          // Xóa khỏi array gốc
          this.users = this.users.filter(u => u._id !== user._id);
          this.admins = this.admins.filter(a => a._id !== user._id);
          
          this.applyFilters(); // Áp dụng lại filter
          this.selectedUser = null; // Đóng modal
          this.toast.show('User deleted successfully');
        },
        error: err => {
          console.error('Error deleting user:', err);
          this.toast.show('Failed to delete user');
        }
      });
    } else {
      this.toast.show('Chỉ có thể xóa tài khoản khi đã Inactive');
    }
  }

  toggleStatus(user: any) {
    const newStatus = !user.is_active;
    this.userService.updateUser(user._id, { is_active: newStatus }).subscribe({
      next: () => {
        user.is_active = newStatus;
        this.applyFilters();
        this.toast.show(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      },
      error: err => {
        console.error('Error toggling status:', err);
        this.toast.show('Failed to update user status');
      }
    });
  }

  closeModal() {
    this.selectedUser = null;
  }
}