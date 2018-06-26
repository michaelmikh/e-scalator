// @flow

const fs = require('fs');
const glob = require('glob');
const sharp = require('sharp');
const util = require('util');

const { resolvePath } = require('./helpers/path');

module.exports = class EScalator {
    // is DEBUG mode active
    DEBUG: boolean;

    // popular extensions describing image files
    IMAGE_EXTENSIONS: Array<any> = ['png', 'jpg', 'jpeg'];

    DESTINATION_DIR: string;
    SOURCE_DIR: string;

    HEIGHT: number;
    WIDTH: number;

    // flag to determine if we're looking for images recursively in SOURCE_DIR
    SEARCH_RECURSIVELY: boolean;

    constructor(options: Object) {
        this.DEBUG = options.debug;

        this.SOURCE_DIR = options.source || process.env.ES_SOURCE_DIR || resolvePath('Pictures');
        this.DESTINATION_DIR =
            options.destination || process.env.ES_DESTINATION_DIR || resolvePath('Pictures', 'e-scalated');

        this.HEIGHT = options.height;
        this.WIDTH = options.width;

        this.SEARCH_RECURSIVELY = options.recursive;

        if (this.DEBUG) {
            console.log('DESTINATION_DIR:', this.DESTINATION_DIR);
            console.log('SOURCE_DIR:', this.SOURCE_DIR);
            console.log('WIDTH:', this.WIDTH);
            console.log('HEIGHT:', this.HEIGHT);
            console.log('SEARCH_RECURSIVELY:', this.SEARCH_RECURSIVELY);
        }
    }

    grabImages = (fromPath: string): Promise<string[]> => {
        if (this.SEARCH_RECURSIVELY && fromPath === this.SOURCE_DIR) {
            fromPath += '**/';
        }

        return new Promise((resolve, reject) => {
            glob(util.format(fromPath + '*.{%s}', this.IMAGE_EXTENSIONS), (error, files) => {
                if (error) {
                    reject(error);
                }

                resolve(files);
            });
        });
    };

    // grab images from SOURCE_DIR and DESTINATION_DIR
    grabAllImagesFromPaths = (...paths: Array<string>): Promise<Array<string[]>> => {
        let funcs: Array<Promise<string[]>> = [];
        paths.forEach(path => funcs.push(this.grabImages(path)));
        return Promise.all(funcs);
    };

    // get already existing images
    differentiateArrays = (newItems: Array<string>, oldItems: Array<string>): Array<string> => {
        return newItems.filter(newItem => {
            return !oldItems.some(oldItem => {
                return oldItem.endsWith(newItem.substring(newItem.lastIndexOf('/') + 1));
            }); // && this.IMAGE_EXTENSIONS.some(ext => newItem.endsWith(ext))
        });
    };

    resize = (images: Array<string>): void => {
        images.forEach(file => {
            // trim filename in order to get its name only
            let rawFile = file.substring(file.lastIndexOf('/') + 1);

            const image: sharp.Sharp = sharp(file);
            image.metadata().then(data => {
                console.log('\t FILE: %s', rawFile);
                console.log('Width  :: %d px', data.width);
                console.log('Height :: %d px', data.height);

                if (data.width < this.WIDTH || data.height < this.HEIGHT) {
                    console.warn('Inappropriate source image size');
                    return;
                }
            });

            if (this.DEBUG) {
                return;
            }

            image
                .resize(this.WIDTH, this.HEIGHT)
                .toFile(this.DESTINATION_DIR + rawFile)
                .catch(error => {
                    console.error(rawFile, '::', error);
                });
        });
    };

    run = async () => {
        if (!fs.existsSync(this.DESTINATION_DIR)) {
            fs.mkdirSync(this.DESTINATION_DIR);
        }

        let sourceImages: Array<string> = [];
        let existingImages: Array<string> = [];

        try {
            [sourceImages, existingImages] = await this.grabAllImagesFromPaths(this.SOURCE_DIR, this.DESTINATION_DIR);
        } catch (error) {
            console.error('Error ocurred:', error);
            return;
        }

        const images: Array<string> = this.differentiateArrays(sourceImages, existingImages);

        console.log('Images to resize:\n\t', images);

        this.resize(images);
    };
};
