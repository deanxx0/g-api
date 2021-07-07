import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';
import { Inspection, InspectionSchema } from './schema/inspection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inspection.name, schema: InspectionSchema }]),
  ],
  controllers: [InspectionController],
  providers: [InspectionService],
})
export class InspectionModule {}
