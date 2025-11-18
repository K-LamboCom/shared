import { Injectable, Logger } from '@nestjs/common';
import { BucketItem } from 'minio';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { MinioService } from './min-io.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly minioService: MinioService) {}

  async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string> {
    await this.minioService.ensureBucket(bucketName);

    try {
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      const maxFileSize = 10 * 1024 * 1024;

      if (!allowedMimeTypes.includes(contentType)) {
        throw new Error('Unsupported file type');
      }

      if (buffer.length > maxFileSize) {
        throw new Error('File too large');
      }

      const uuidName = uuidv4();

      await this.minioService.minioClient.putObject(
        bucketName,
        uuidName,
        buffer,
        buffer.length,
        {
          'Content-Type': contentType,
        },
      );

      return uuidName;
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err.message || 'Failed to upload file');
    }
  }

  async getFile(bucketName: string, fileName: string): Promise<Buffer> {
    try {
      return await this.minioService.getFile(bucketName, fileName);
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err.message || 'Failed to get file');
    }
  }

  async getFileStream(bucketName: string, fileName: string): Promise<Readable> {
    const buffer = await this.getFile(bucketName, fileName);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.minioService.minioClient.removeObject(bucketName, fileName);
      this.logger.log(`File ${fileName} deleted from bucket ${bucketName}`);
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err.message || 'Failed to delete file');
    }
  }

  async listFiles(bucketName: string): Promise<BucketItem[]> {
    try {
      return await this.minioService.listFiles(bucketName);
    } catch (err: any) {
      this.logger.error(err);
      throw new Error(err.message || 'Failed to list files');
    }
  }
}
