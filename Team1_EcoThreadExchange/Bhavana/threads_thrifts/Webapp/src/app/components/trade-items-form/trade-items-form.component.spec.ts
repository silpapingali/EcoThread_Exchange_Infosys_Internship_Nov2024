import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeItemsFormComponent } from './trade-items-form.component';

describe('TradeItemsFormComponent', () => {
  let component: TradeItemsFormComponent;
  let fixture: ComponentFixture<TradeItemsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeItemsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeItemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
