import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  messageLogin: string = '';


  constructor( private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ){}

  ngOnInit(): void {
    this.initFormLogin();
  }

  initFormLogin() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  onLogin() {
    if(this.loginForm.valid){
      const {email, password} = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (data) => {
          // console.log("Access token: ", data.data.access_token);
          // console.log("Refresh token: ", data.data.refresh_token);

          this.authService.getUserProfile(data.data.id).subscribe(
            (userData) => {
              localStorage.setItem('user', JSON.stringify(userData.data));
              // console.log("Thông tin người dùng: ",userData.data);
              if(userData.data.role === 'ADMIN'){
                this.router.navigate(['/AdminLayout/Dashboard']);
              }else if(userData.data.role === 'USER'){
                this.router.navigate(['/'])
              }
            },
            (error) => {
              console.error("Lỗi khi lấy thông tin người dùng: ", error);
            }
          )
        },
        (error) => {
          console.error("Lỗi đăng nhập: ", error);
          alert("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.");
        }
      )
    }else{
      this.messageLogin = "Vui lòng điền đầy đủ và chính xác thông tin"
    }
  }


  gotoSignup() {
    this.router.navigate(['/SignUp']);
  }

}
