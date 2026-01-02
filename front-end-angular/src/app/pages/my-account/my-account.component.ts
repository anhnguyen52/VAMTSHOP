import { Component } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  activeTab: 'profile' | 'orders' = 'profile'; // Tab mặc định
    setTab(tab: 'profile' | 'orders') {
      this.activeTab = tab;
    }

    // Nhận event từ con (nếu cần reload orders sau khi update profile)
    onProfileUpdated() {
      // Có thể emit event xuống MyOrders để reload
      console.log('Profile updated → có thể reload orders nếu cần');
    }
}
