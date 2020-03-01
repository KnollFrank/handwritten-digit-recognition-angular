import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { KnnWorkerREST } from './knnWorkerREST';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KnnWorkersService {

  knnWorkers = [];

  constructor(http: HttpClient) {
    this.knnWorkers.push(new KnnWorkerREST(http));
    for (let i = 0; i < environment.maxNumWorkers - 1; i++) {
      this.knnWorkers.push(new Worker('./knn.worker', { type: 'module' }));
    }
  }
}
