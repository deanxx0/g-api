import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectorService {
  updateInspectionStatus() {
    console.log(`Update requested.`);
  }
}
