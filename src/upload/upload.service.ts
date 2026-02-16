import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async handleUpload(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No files sent.');

    const maxFileSize = 900 * 1024;
    if (file.size > maxFileSize)
      throw new BadRequestException('File size exceeds the 900KB limit.');

    const fileType = await fileTypeFromBuffer(file.buffer);
    if (
      !fileType ||
      !['image/png', 'image/jpeg', 'image/webp'].includes(fileType.mime)
    ) {
      throw new BadRequestException(
        'Only PNG, JPEG, and WEBP image formats are allowed.'
      );
    }

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'blog-posts' },
          (error, result) => {
            if (error) return reject(new Error(error.message));

            if (!result)
              return reject(
                new Error('No response from Cloudinary after upload.')
              );

            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      return {
        url: result.secure_url,
      };
    } catch (err) {
      this.logger.error('Upload to Cloudinary failed:', err);
      throw new BadRequestException(
        'Failed to upload image. Please try again later.'
      );
    }
  }
}
