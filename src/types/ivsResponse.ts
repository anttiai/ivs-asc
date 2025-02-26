export interface AudioTrackConfiguration {
    channels: number,
    codec: string,
    settings: {
        bitrate: number
    },
    track_id: number
}


export interface EncoderConfiguration {
    bitrate_interpolation_points: number[],
    framerate: {
        denominator: 1,
        numerator: 24 | 25 | 30 | 48 | 50 | 60
    }
    gpu_scale_type: string,
    height: number,
    settings: {
        bf?: number,
        bitrate: number,
        keyint_sec: number,
        lookahead?: boolean,
        preset2: string,
        profile: string,
        psycho_aq?: boolean,
        rate_control: string,
        tune?: string
    },
    type?: string,
    width: number
}


interface IngestEndpoint {
    authentication: string,
    protocol: string,
    url_template: string
}


export interface IVSResponse {
    audio_configurations: {
        live: AudioTrackConfiguration[],
        vod?: AudioTrackConfiguration[]
    },
    encoder_configurations: EncoderConfiguration[],
    ingest_endpoints: IngestEndpoint[],
    meta: {
        config_id: string,
        schema_version: string,
        service: string
    },
    status?: {
        html_en_us: string,
        result: string
    }
}