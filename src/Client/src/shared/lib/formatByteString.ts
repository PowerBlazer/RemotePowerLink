export function formatByteString (fileSize: number): string {
    const byteConversion = 1024;
    const bytes = fileSize;

    if (bytes >= Math.pow(byteConversion, 3)) { // Гигабайты
        return `${(bytes / Math.pow(byteConversion, 3)).toFixed(2)} GB`;
    } else if (bytes >= Math.pow(byteConversion, 2)) { // Мегабайты
        return `${(bytes / Math.pow(byteConversion, 2)).toFixed(2)} MB`;
    } else if (bytes >= byteConversion) { // Килобайты
        return `${(bytes / byteConversion).toFixed(2)} KB`;
    } else { // Байты
        return `${bytes} bytes`;
    }
}