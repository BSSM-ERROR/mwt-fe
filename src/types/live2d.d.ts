declare module 'pixi-live2d-display/cubism4' {
    import { DisplayObject, IPointData } from 'pixi.js';

    export class Live2DModel extends DisplayObject {
        static from(source: string, options?: any): Promise<Live2DModel>;
        static registerTicker(ticker: any): void;

        anchor: {
            set(x: number, y: number): void;
        };

        interactive: boolean;
        width: number;
        height: number;

        position: {
            set(x: number, y: number): void;
            x: number;
            y: number;
        };

        scale: {
            set(value: number): void;
            x: number;
            y: number;
        };

        internalModel?: InternalModel;

        on(event: string, fn: (e?: any) => void): this;
        destroy(): void;
    }

    export interface CoreModel {
        _parameterIds?: string[];
        _parameterValues?: number[];
        setParameterValueById?(id: string, value: number): void;
        [key: string]: any;
    }

    export interface InternalModel {
        eyeBlink?: any | null;
        coreModel?: CoreModel;
        [key: string]: any;
    }
}

declare module 'pixi.js' {
    interface Application {
        static registerPlugin?(plugin: any): void;
    }
}

declare global {
    interface Window {
        Live2DCubismCore?: any;
        PIXI?: any;
    }
}

export { };
