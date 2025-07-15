import { Canvas } from "./clientConfiguration"

export interface FetchOptions {
    authKey: string,
    apiUrl?: string,
    client?: {
        name: string,
        version: string
    },
    video: {
        maxBitrateKbps?: number,
        maxTracks?: number
        supportedCodecs?: string[],
    },
    canvases: Canvas[]
}