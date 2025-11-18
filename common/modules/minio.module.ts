import { Module } from '@nestjs/common';
import { MinioService } from '../services/min-io.service';
import { StorageService } from '../services/storage.service';

@Module({
  providers: [MinioService, StorageService],
  exports: [StorageService],
})
export class MinioModule {}
