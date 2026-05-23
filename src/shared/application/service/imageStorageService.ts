export interface ImageStorageService {
    uploadImage(fileName: string, fileBuffer: Buffer, folder: string): Promise<string>;
    deleteImage(imageUrl: string): Promise<void>;
}