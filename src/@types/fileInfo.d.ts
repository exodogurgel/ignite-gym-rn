import 'expo-file-system'

export declare module 'expo-file-system'{
  interface FileInfo {
    exists: boolean;
    uri: string;
    size: number;
    isDirectory: boolean;
    modificationTime: number;
    md5?: string | undefined;
  }
}