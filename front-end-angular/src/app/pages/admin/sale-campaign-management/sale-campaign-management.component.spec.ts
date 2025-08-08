import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCampaignManagementComponent } from './sale-campaign-management.component';

describe('SaleCampaignManagementComponent', () => {
  let component: SaleCampaignManagementComponent;
  let fixture: ComponentFixture<SaleCampaignManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleCampaignManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleCampaignManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
