import { TestBed } from '@angular/core/testing';

import { LookbookService } from './lookbook.service';

describe('LookbookService', () => {
  let service: LookbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
