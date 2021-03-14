import { TestBed } from '@angular/core/testing';

import { ListBinService } from './list-bin.service';

describe('ListBinService', () => {
  let service: ListBinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListBinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
