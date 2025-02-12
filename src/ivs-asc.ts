import * as si from 'systeminformation';
import { FetchOptions } from './types/fetchOptions';
import { ClientConfiguration } from './types/clientConfiguration';
import { Response } from './types/response';

const SERVICE = 'IVS';
const SCHEMA_VERSION = '2024-06-04';
const DEFAULT_API_URL = 'https://ingest.contribute.live-video.net/api/v3/GetClientConfiguration';
const DEFAULT_MAX_VIDEO_TRACKS = 5;
const API_CALL_TIMEOUT_MS = 5000;


export async function getClientConfiguration(options: FetchOptions): Promise<ClientConfiguration> {

    const cpu = await si.cpu();
    const mem = await si.mem();
    const graphics = await si.graphics();

    return {
        "authentication": options.authKey,
        "client": {
            "name": options.client ? options.client.name : 'github.com/anttiai/ivs-asc',
            "version": options.client ? options.client.version : '0.1.0',
            "supported_codecs": options.video.supportedCodecs
        },
        "capabilities": {
            "cpu": {
                "name": cpu.manufacturer + " " + cpu.brand
            },
            "gaming_features": {},
            "gpu": [
                {
                    "device_id": 10168,
                    "model": "AD104GL [L4]",
                    "vendor_id": 4318,
                    "driver_version": "565.57.01",
                }
            ],
            "memory": {
                "free": mem.free,
                "total": mem.total
            },
            "system": {
                "build": 1,
                "name": "Ubuntu",
                "release": "24.04",
                "revision": "1",
                "version": "1"
            }
        },
        "preferences": {
            "canvas_height": options.video.height,
            "canvas_width": options.video.width,
            "framerate": {
                "denominator": 1,
                "numerator": options.video.fps
            },
            "height": options.video.height,
            "vod_track_audio": false,
            "width": options.video.width,
            "maximum_video_tracks": options.video.maxTracks ? options.video.maxTracks : DEFAULT_MAX_VIDEO_TRACKS,
            "maximum_streaming_bandwidth": options.video.maxBitrateKbps
        },
        "schema_version": SCHEMA_VERSION,
        "service": SERVICE,
        "stream_attempt_start_time": new Date().toISOString()
    };
}

export async function fetchStreamConfiguration(options: FetchOptions): Promise<Response> {
    const clientConfiguration: ClientConfiguration = await getClientConfiguration(options);

    const resp = await fetch(options.apiUrl ? options.apiUrl : DEFAULT_API_URL, {
        signal: AbortSignal.timeout(API_CALL_TIMEOUT_MS),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientConfiguration)
    });
    const response: Response = await resp.json();
    return response;
}