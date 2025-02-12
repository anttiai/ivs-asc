export interface FetchOptions {
    authKey: string,
    apiUrl?: string,
    client?: {
        name: string,
        version: string
    },
    video: {
        width: number,
        height: number,
        fps: 24 | 25 | 30 | 48 | 50 | 60,
        maxBitrateKbps?: number,
        maxTracks?: number
        supportedCodecs?: string[],
    }
}