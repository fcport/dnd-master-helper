import { TestBed } from '@angular/core/testing';

import { AppwriteBackendService } from './appwrite-backend.service';

describe('AppwriteBackendService', () => {
  let service: AppwriteBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppwriteBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
