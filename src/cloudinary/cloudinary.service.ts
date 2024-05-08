import { Injectable } from '@nestjs/common';
import {  v2  } from 'cloudinary';
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
    constructor() {
        v2.config({
            cloud_name: 'daems2brc', 
            api_key: '783312164345195', 
            api_secret: 'lwut7XvSSFrF2ze1eaac4XrSBiY'
        })
    }

    async uploadImage(file): Promise<string> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream({ folder: 'tea' },(error, result) => {
                if (error) reject (error);
                resolve(result.secure_url);
            })
            streamifier.createReadStream(file.buffer).pipe(upload)
        });
    }
    
}




