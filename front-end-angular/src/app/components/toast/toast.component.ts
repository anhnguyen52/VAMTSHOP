import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  isVisible = false;
  message = '';

  constructor(private toastService: ToastService,
    private Router: Router,
  ) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe(({ message, duration }) => {
      this.message = message;
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, duration || 5000);
    });
  }

  goToCart(){
    this.Router.navigate(['/Cart']);
  }
}
