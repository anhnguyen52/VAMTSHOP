import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { ProfileComponent } from './pages/authentication/profile/profile.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { AuthGuard } from './pages/authentication/auth.guard';
import { DetailProductComponent } from './pages/product/detail-product/detail-product.component';
import { CartComponent } from './pages/product/cart/cart.component';
import { SpinnerComponent } from '../app/components/spinner/spinner.component';
import { ShopAllComponent } from './pages/product/shop-all/shop-all.component';
const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'Login', component: LoginComponent},
  {path: 'SignUp', component:SignupComponent},
  {path: 'Profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {path: 'DetailProduct/:id', component: DetailProductComponent },
  {path: 'Cart', component: CartComponent },
  {path: 'ShopAll', component: ShopAllComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
