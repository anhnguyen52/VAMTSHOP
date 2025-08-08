import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isVisible = false;
  private hideTimeout: any;

  ngOnInit() {
    // Show spinner by default when component is initialized
    this.isVisible = true;

    // Set a timeout to hide the spinner after 1 minute (60,000 ms)
    this.hideTimeout = setTimeout(() => {
      this.isVisible = false;
    }, 60000); // 1 minute
  }

  ngOnDestroy() {
    // Clear timeout if the component is destroyed before timeout completes
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
