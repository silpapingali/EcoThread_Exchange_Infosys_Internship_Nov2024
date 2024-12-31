import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradecardComponent } from './tradecard.component';

describe('TradecardComponent', () => {
  let component: TradecardComponent;
  let fixture: ComponentFixture<TradecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradecardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
