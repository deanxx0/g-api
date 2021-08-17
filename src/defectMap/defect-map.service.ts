import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camera, CameraDocument } from 'src/camera/schema/camera.schema';
import {
  InferenceResult,
  InferenceResultDocument,
} from 'src/inferenceResult/schema/inference-result.schema';

@Injectable()
export class DefectMapService {
  constructor(
    @InjectModel(InferenceResult.name)
    private inferenceResultModel: Model<InferenceResultDocument>,
    @InjectModel(Camera.name)
    private cameraModel: Model<CameraDocument>,
  ) {}

  async findAll(): Promise<InferenceResultDocument[]> {
    return this.inferenceResultModel.find().exec();
  }

  async findById(id: string): Promise<InferenceResultDocument> {
    return this.inferenceResultModel.findById(id);
  }

  async getList(inspectionId: string) {
    const inferenceResults: InferenceResultDocument[] =
      await this.inferenceResultModel
        .find({ inspectionId: inspectionId })
        .exec();

    const RESOLUTION_MODIFIER = 6;
    let finalPoints = [];
    for (let ir of inferenceResults) {
      if (ir.defects.length > 0) {
        const camera = await this.cameraModel
          .findOne({ name: ir.cameraName })
          .exec();
        for (let i = 0; i < ir.defects.length; i++) {
          const rotatedPoint = await this.rotate(ir.defects[i], camera);
          let finalX: number = 0;
          let finalY: number = 0;
          if (camera.groups[1] == 'LEFT' && camera.groups[2] == 'SIDE') {
            finalX =
              ir.grab.distance +
              rotatedPoint.x * camera.resolution * RESOLUTION_MODIFIER -
              camera.x * 10;
            finalY =
              camera.z * 10 -
              rotatedPoint.y * camera.resolution * RESOLUTION_MODIFIER;
          } else if (
            camera.groups[1] == 'RIGHT' &&
            camera.groups[2] == 'SIDE'
          ) {
            finalX =
              ir.grab.distance -
              rotatedPoint.x * camera.resolution * RESOLUTION_MODIFIER -
              camera.x * 10;
            finalY =
              8000 -
              camera.z * 10 +
              rotatedPoint.y * camera.resolution * RESOLUTION_MODIFIER;
          } else {
            finalX =
              ir.grab.distance +
              rotatedPoint.x * camera.resolution * RESOLUTION_MODIFIER -
              camera.x * 10;
            finalY =
              2666 +
              camera.y * 10 -
              rotatedPoint.y * camera.resolution * RESOLUTION_MODIFIER;
          }

          const imagePath: string = `${ir.inspectionNo}/${ir.cameraName}/${ir.grab.seq}_${i}_result.jpg`;
          finalPoints.push({ x: finalX, y: finalY, imagePath: imagePath});
        }
      }
    }
    console.log(`defect map list count: ${finalPoints.length}`);
    return finalPoints;
  }

  async rotate(defect, camera: CameraDocument) {
    const rotateDegree = camera.rotation;
    const frameWidth = camera.width;
    const frameHeight = camera.height;
    const flip = camera.flip;
    const originalX = defect.x;
    const originalY = defect.y;
    // console.log(`rotatedDegree: ${rotateDegree} / frameWidth: ${frameWidth} / frameHeight: ${flip} / originalX: ${defect.x} / originalY: ${defect.y}`);

    if (flip == false) {
      if (rotateDegree == 0) {
        const newX = originalX;
        const newY = originalY;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 90) {
        const newX = frameHeight - originalY;
        const newY = originalX;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 180) {
        const newX = frameWidth - originalX;
        const newY = frameHeight - originalY;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 270) {
        const newX = originalY;
        const newY = frameWidth - originalX;
        return { x: newX, y: newY };
      }
    }

    if (flip == true) {
      if (rotateDegree == 0) {
        const newX = frameWidth - originalX;
        const newY = originalY;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 90) {
        const newX = frameHeight - originalY;
        const newY = frameWidth - originalX;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 180) {
        const newX = originalX;
        const newY = frameHeight - originalY;
        return { x: newX, y: newY };
      }
      if (rotateDegree == 270) {
        const newX = originalY;
        const newY = originalX;
        return { x: newX, y: newY };
      }
    }
  }
}
