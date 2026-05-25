import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { ImageStorageService } from "../../application/service/imageStorageService";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudinaryServiceImpl implements ImageStorageService {
    
   constructor(private readonly configService: ConfigService) {
    cloudinary.config({
        cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
}

async uploadImage(fileName: string, fileBuffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `kfe/${folder}`,
                public_id: fileName,
                overwrite: true,
            },
            (error, result) => {
                if (error || !result) {
                    return reject(new Error(error?.message ?? 'Upload failed'));
                }
                resolve(result.secure_url);
            }
        );

        stream.end(fileBuffer);
    });
}

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const urlParts = imageUrl.split('/');
            const fileNameWithExtension = urlParts.at[urlParts.length - 1];
            const folderPath = urlParts.slice(-3, -1).join('/'); 
            const publicId = `${folderPath}/${fileNameWithExtension.split('.')[0]}`;

            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error al eliminar imagen de Cloudinary:", error);
        }
    }
}