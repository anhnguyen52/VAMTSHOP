import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCampaignComponent } from './sale-campaign.component';

describe('SaleCampaignComponent', () => {
  let component: SaleCampaignComponent;
  let fixture: ComponentFixture<SaleCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaleCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
