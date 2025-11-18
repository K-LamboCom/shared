// src/minio/minio.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { BucketItem, Client as MinioClient } from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  public readonly minioClient: MinioClient;

  constructor() {
    this.minioClient = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true' || false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async ensureBucket(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
      this.logger.log(`Bucket ${bucketName} created`);
    }
  }

  async getFile(bucketName: string, fileName: string): Promise<Buffer> {
    const stream = await this.minioClient.getObject(bucketName, fileName);
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  async listFiles(bucketName: string): Promise<BucketItem[]> {
    const files: BucketItem[] = [];
    return new Promise<BucketItem[]>((resolve, reject) => {
      const stream = this.minioClient.listObjectsV2(bucketName, '', true);
      stream.on('data', (item) => files.push(item));
      stream.on('end', () => resolve(files));
      stream.on('error', (err) => reject(err));
    });
  }
}
