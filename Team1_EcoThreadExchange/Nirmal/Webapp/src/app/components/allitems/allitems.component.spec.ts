import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllitemsComponent } from './allitems.component';

describe('AllitemsComponent', () => {
  let component: AllitemsComponent;
  let fixture: ComponentFixture<AllitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllitemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
