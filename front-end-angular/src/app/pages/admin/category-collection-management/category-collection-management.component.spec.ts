import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollectionManagementComponent } from './category-collection-management.component';

describe('CategoryCollectionManagementComponent', () => {
  let component: CategoryCollectionManagementComponent;
  let fixture: ComponentFixture<CategoryCollectionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryCollectionManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryCollectionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
