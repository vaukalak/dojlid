export interface Config {
    basePath: string;
    fileCasing: (body: string, qualifier: string) => string;
}