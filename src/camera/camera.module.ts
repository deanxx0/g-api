import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Camera, CameraSchema } from './schema/camera.schema';
import { CameraService } from './camera.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camera.name, schema: CameraSchema }]),
  ],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
