import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageComponent } from './admin-message.component';

describe('AdminMessageComponent', () => {
  let component: AdminMessageComponent;
  let fixture: ComponentFixture<AdminMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMessageComponent]
    });
    fixture = TestBed.createComponent(AdminMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
