import { Component, OnInit } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  user: any;
  userId: string | undefined;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ){}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
          this.userId = this.user._id;
        } catch (e) {
          console.error("Lỗi khi parse user từ localStorage:", e);
        }
    }
  }}

  logout(id: string | undefined) {
    if (!id) {
      console.error("Không có ID người dùng để đăng xuất");
      return;
    }

    this.authService.logout(id).subscribe(
      (response) => {
        console.log("Đăng xuất thành công: ", response);
        this.router.navigate(['/Login']);
      },
      (error) => {
        console.error("Lỗi đăng xuất: ", error);
      }
    );
  }
}
