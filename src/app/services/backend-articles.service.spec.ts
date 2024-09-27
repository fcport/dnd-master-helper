import { TestBed } from '@angular/core/testing';

import { BackendArticlesService } from './backend-articles.service';

describe('BackendArticlesService', () => {
  let service: BackendArticlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendArticlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
