export interface GpuDescription {
    dedicated_video_memory?: number,
    device_id: number,
    driver_version: string,
    luid?: string,
    model: string,
    shared_system_memory?: number,
    vendor_id: number // decimal
}

export interface Canvas {
    canvas_height: number,
    canvas_width: number,
    framerate: {
        denominator: 1,
        numerator: 24 | 25 | 30 | 48 | 50 | 60
    },
    height: number,
    width: number
}

export interface ClientConfiguration {
    authentication: string,
    capabilities: {
        cpu: {
            logical_cores?: number,
            name: string;
            physical_cores?: number,
            speed?: number
        },
        gaming_features: {
            game_dvr_allowed?: boolean,
            hags_enabled?: boolean
        },
        gpu: GpuDescription[],
        memory: {
            free: number,
            total: number
        },
        system: {
            arm?: boolean,
            arm_emulation?: boolean,
            bits?: 32 | 64,
            build: number,
            name: string,
            release: string,
            revision: string,
            version: string
        }
    },
    client: {
        name: string,
        supported_codecs?: string[],
        version: string
    },
    preferences?: {
        composition_gpu_index?: number,
        maximum_streaming_bandwidth?: number,
        maximum_resolution?: string,
        maximum_video_tracks?: number,
        vod_track_audio?: boolean,
        canvases: Canvas[]
    },
    service: string,
    schema_version: string,
    stream_attempt_start_time: string
}