import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltradesComponent } from './alltrades.component';

describe('AlltradesComponent', () => {
  let component: AlltradesComponent;
  let fixture: ComponentFixture<AlltradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlltradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlltradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
