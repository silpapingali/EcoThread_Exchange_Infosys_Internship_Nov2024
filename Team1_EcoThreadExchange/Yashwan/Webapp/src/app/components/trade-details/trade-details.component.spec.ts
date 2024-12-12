import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDetailsComponent } from './trade-details.component';

describe('TradeDetailsComponent', () => {
  let component: TradeDetailsComponent;
  let fixture: ComponentFixture<TradeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
