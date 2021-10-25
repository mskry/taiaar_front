import { TestBed } from '@angular/core/testing';

import { CartInitService } from './cart-init.service';

describe('CartInitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartInitService = TestBed.get(CartInitService);
    expect(service).toBeTruthy();
  });
});
