import { TestBed } from '@angular/core/testing';

import { ReorderService } from './reorder.service';

describe('ReorderService', () => {
  let service: ReorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
