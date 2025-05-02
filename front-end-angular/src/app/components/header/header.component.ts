import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { faCartShopping, faBars,faBagShopping, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { clear } from 'node:console';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  faCart = faCartShopping;
  faBars = faBars;
  faBag = faBagShopping
  faXmark = faXmark;
  faGlass = faMagnifyingGlass
  user: any;
  userId: string | null = null;
  menuOpen = false;
  isLogin: boolean = false;

  isShrink: boolean = false;
  isShowWelcome = true;
  isHiddenAfterAnimation = false;

  timeOut: any;

  private scrollPosition: number = 0;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
          this.isLogin = true;
          this.userId = this.user._id;
        } catch (e) {
          console.error("Lỗi khi parse user từ localStorage:", e);
          this.isLogin = false;
        }
      } else {
        this.isLogin = false;
      }
    } else {
      this.isLogin = false;
    }
  
    console.log("User: ", this.user);
  
    if (typeof document !== 'undefined' && this.menuOpen === false) {
      document.body.style.overflow = 'auto';
    }

  }
  
  // Theo dõi cuộn trang
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > this.scrollPosition && currentScroll > 50) {
      this.isShrink = true; // cuộn xuống
      // console.log("Cuộn xuống: ", currentScroll , "isShrink: ", this.isShrink);
    } else if (currentScroll < this.scrollPosition) {
      this.isShrink = false; // cuộn lên
      // console.log("Cuộn lên: ", currentScroll, "isShrink: ", this.isShrink);
    }

    this.scrollPosition = currentScroll;
  }


  onLogout(id: string | null) {
    if (!id) {
      console.error("User ID is null. Cannot logout.");
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }
  }
  gotoHome(){
    this.router.navigate(['/']);
  }

  goToCart() {
    this.router.navigate(['/Cart']);
  }
}
