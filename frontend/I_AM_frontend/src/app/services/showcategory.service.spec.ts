import { TestBed } from '@angular/core/testing';

import { ShowcategoryService } from './showcategory.service';

describe('ShowcategoryService', () => {
  let service: ShowcategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowcategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
