import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { ProfileComponent } from './pages/authentication/profile/profile.component';
import { HomeComponent } from './pages/home/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './pages/authentication/auth.interceptor';
import { TokenInterceptor } from './pages/authentication/token.interceptor';
import { ShopAllComponent } from './pages/product/shop-all/shop-all.component';
import { DetailProductComponent } from './pages/product/detail-product/detail-product.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CartComponent } from './pages/product/cart/cart.component';
import { ToastComponent } from './components/toast/toast.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {MatTreeModule} from '@angular/material/tree';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    ShopAllComponent,
    DetailProductComponent,
    SpinnerComponent,
    CartComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTreeModule,
    MatExpansionModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
