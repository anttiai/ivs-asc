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
    preferences?: {
        vod_track_audio?: boolean
    },
    canvases: Canvas[]
}