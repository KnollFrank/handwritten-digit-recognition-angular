import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ImageAlgosService } from '../image-algos.service';
import { CanvasImageService } from '../canvas-image.service';
import { Src2DstFitterUsingBoundingBox } from './src2DstFitterUsingBoundingBox';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit, AfterViewInit {

  @Input() knnClassifier;
  @Input() kernelWidthAndHeight;

  digitClassifier: (digit: any, receivePredictionsForDigit: any) => any;

  @Input() datasetDescription;

  @ViewChild('digitCanvasSmall', { static: false }) public canvasSmallRef: ElementRef<HTMLCanvasElement>;
  canvasSmall: HTMLCanvasElement;

  @ViewChild('freeHandDrawingTool', { static: false }) public freeHandDrawingTool;

  @ViewChild('digitCanvasBigResultOfPrediction', { static: false })
  public digitCanvasBigResultOfPredictionRef: ElementRef<HTMLCanvasElement>;
  digitCanvasBigResultOfPrediction: HTMLCanvasElement;

  private imageWidth: number;
  private imageHeight: number;

  digitDataset: any;
  src2DstFitter: any;

  constructor(private imageAlgosService: ImageAlgosService, private canvasImageService: CanvasImageService) {
  }

  ngOnInit() {
    // this.src2DstFitter = new Src2DstFitter(this.imageAlgosService, this.canvasImageService, this.kernelWidthAndHeight);
    this.src2DstFitter = new Src2DstFitterUsingBoundingBox(this.imageAlgosService, this.canvasImageService, this.kernelWidthAndHeight);

    this.digitClassifier = this.getDigitClassifier(this.knnClassifier);
    this.imageWidth = this.datasetDescription.imageWidth;
    this.imageHeight = this.datasetDescription.imageHeight;
  }

  ngAfterViewInit(): void {
    this.canvasSmall = this.canvasSmallRef.nativeElement;
    this.digitCanvasBigResultOfPrediction = this.digitCanvasBigResultOfPredictionRef.nativeElement;
    this.canvasSmall.width = this.imageWidth;
    this.canvasSmall.height = this.imageHeight;
  }

  private getDigitClassifier(classifier) {
    return (digit, receivePredictionsForDigit) =>
      classifier({
        rows: [digit],
        receivePredictionsForRows: kNearestNeighborsWithPredictions => receivePredictionsForDigit(kNearestNeighborsWithPredictions[0])
      });
  }

  public predictDrawnDigit(digitImageData) {
    this.digitClassifier(
      this.getPixels(digitImageData),
      kNearestNeighborsWithPrediction => {
        this.setPrediction(kNearestNeighborsWithPrediction.prediction);
        this.digitDataset =
          kNearestNeighborsWithPrediction.kNearestNeighbors.map(({ x, y }) =>
            ({
              width: this.imageWidth,
              height: this.imageHeight,
              figcaption: y,
              image: x.concat(y)
            }));
      });
  }

  private setPrediction(predictedValue) {
    this.canvasImageService.clearCanvas(this.digitCanvasBigResultOfPrediction);
    this.printCenteredTextIntoCanvas(this.digitCanvasBigResultOfPrediction, predictedValue);
  }

  private printCenteredTextIntoCanvas(canvas, text) {
    const ctx = canvas.getContext('2d');
    const fontSize = Math.min(canvas.width, canvas.height);
    ctx.font = `${fontSize}px Verdana`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  public prepareNewPrediction() {
    this.clearCanvases();
    this.digitDataset = [];
    this.setPrediction('');
  }

  private clearCanvases() {
    this.freeHandDrawingTool.clearCanvas();
    this.canvasImageService.clearCanvas(this.canvasSmall);
  }

  private getPixels(digitImageData) {
    this.src2DstFitter.fitSrc2Dst({ srcImageData: digitImageData, dstCanvas: this.canvasSmall });
    const ctxSmall = this.canvasSmall.getContext('2d');
    const imageData = ctxSmall.getImageData(0, 0, this.canvasSmall.width, this.canvasSmall.height);
    return this.canvasImageService.imageData2Pixels(imageData);
  }
}
