import { TestBed, inject } from '@angular/core/testing';

import { DefaultInterceptorService } from './default-interceptor.service';

describe('DefaultInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultInterceptorService]
    });
  });

  it('should be created', inject([DefaultInterceptorService], (service: DefaultInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
