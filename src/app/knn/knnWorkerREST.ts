import { KNN } from './KNN';
import { HttpClient } from '@angular/common/http';

export class KnnWorkerREST {

    knn: KNN;
    onmessage;

    constructor(private http: HttpClient) {
    }

    postMessage({ type, params }) {
        switch (type) {
            case 'fit':
                {
                    const { X, y, k } = params;
                    this.http
                        .post('https://digit-recognition-0815.herokuapp.com/fit', { X, y, k })
                        .subscribe(
                            _ => { },
                            error => console.log('fit error:', error));
                    break;
                }
            case 'getKNearestNeighbors':
                {
                    const X = params.X;
                    this.http
                        .post('https://digit-recognition-0815.herokuapp.com/getKNearestNeighbors', { X, k: 4711 })
                        .subscribe(
                            kNearestNeighborss =>
                                this.onmessage({
                                    data: {
                                        type: 'result',
                                        value: kNearestNeighborss
                                    }
                                }),
                            error => console.log('getKNearestNeighbors error:', error));
                    break;
                }
        }
    }
}
