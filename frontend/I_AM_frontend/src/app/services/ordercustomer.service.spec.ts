import { TestBed } from '@angular/core/testing';

import { OrdercustomerService } from './ordercustomer.service';

describe('OrdercustomerService', () => {
  let service: OrdercustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdercustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
