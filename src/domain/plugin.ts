import { Config } from "./config";

export interface Plugin {
    defaultAction: string;
    actions: {
        [key: string]: (...args: any[]) => any;
    }
}