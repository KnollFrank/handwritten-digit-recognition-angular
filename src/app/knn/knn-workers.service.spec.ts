import { TestBed } from '@angular/core/testing';

import { KnnWorkersService } from './knn-workers.service';

describe('KnnWorkersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KnnWorkersService = TestBed.get(KnnWorkersService);
    expect(service).toBeTruthy();
  });
});
