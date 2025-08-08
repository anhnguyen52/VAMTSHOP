import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../../../service/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({});
  messageSignup: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
  ) { }


  ngOnInit(): void{
    this.initFormSignup();

  }

  initFormSignup() {
    this.signupForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      gender: [''],
      date_of_birth: [''],
      phone: [''],
      address: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
    })
  }

  onSignup(){
    if(this.signupForm.valid){
      const {first_name, last_name,gender, date_of_birth, phone, address, email, password, confirmPassword} = this.signupForm.value;
      if(password !== confirmPassword){
        this.messageSignup = "Mật khẩu không khớp. Vui lòng kiểm tra lại."
      }

      this.authService.signup(first_name, last_name, gender, address, date_of_birth, phone, email, password).subscribe(
        (data) => {
          // console.log("Access token: ", data.data.access_token);
          // console.log("Refresh token: ", data.data.refresh_token);

          this.authService.getUserProfile(data.data.response._id).subscribe(
            (userData) => {
              localStorage.setItem('user', JSON.stringify(userData.data));
              console.log("Thông tin người dùng: ", userData.data);
              this.router.navigate(['/Home'])
            },
            (error) => {
              console.error("Lỗi khi lấy thông tin người dùng: ", error);
            }
          )
        },
        (error) => {
          console.error("Lỗi đăng ký: ", error);
          alert("Đăng ký không thành công. Vui lòng kiểm tra lại thông tin đăng ký.");
        }
      )
    }else{
      this.messageSignup = "Vui lòng điền đầy đủ và chính xác thông tin"
    }
  }

  gotoLogin() {
    this.router.navigate(['/Login']);
  }
}
