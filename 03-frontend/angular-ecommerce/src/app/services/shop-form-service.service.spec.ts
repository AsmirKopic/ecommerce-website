import { TestBed } from '@angular/core/testing';

import { ShopFormServiceService } from './shop-form-service.service';

describe('ShopFormServiceService', () => {
  let service: ShopFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
