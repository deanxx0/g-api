import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultInfoController } from './result-info.controller';
import { ResultInfoService } from './result-info.service';
import { ResultInfo, ResultInfoSchema } from './schema/result-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResultInfo.name, schema: ResultInfoSchema }]),
  ],
  controllers: [ResultInfoController],
  providers: [ResultInfoService],
})
export class ResultInfoModule {}
