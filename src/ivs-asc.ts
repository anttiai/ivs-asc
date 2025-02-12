import { FetchOptions } from './types/fetchOptions';
import { ClientConfiguration, GpuDescription } from './types/clientConfiguration';
import { Response } from './types/response';
import * as si from 'systeminformation';
import * as util from 'util';
import * as child_process from 'child_process';
const exec = util.promisify(child_process.exec);

const SERVICE = 'IVS';
const SCHEMA_VERSION = '2024-06-04';
const DEFAULT_API_URL = 'https://ingest.contribute.live-video.net/api/v3/GetClientConfiguration';
const DEFAULT_MAX_VIDEO_TRACKS = 5;
const API_CALL_TIMEOUT_MS = 5000;

const GPU_VENDORS = {
    Apple: 'Apple',
    Nvidia: 'NVIDIA Corporation',
}

async function constructGpusArray(): Promise<GpuDescription[]> {
    const graphics = await si.graphics();

    const gpuPromises = graphics.controllers.map(async (controller) => {
        let gpu: GpuDescription = {
            device_id: controller.deviceId ? parseInt(controller.deviceId, 16) : 0,
            vendor_id: controller.vendorId ? parseInt(controller.vendorId, 16) : 0,
            model: controller.model,
            driver_version: ''
        };

        // Vendor-specifc heuristic to find out GPU driver version, device id, and vendor id
        // With Nvidia, nvidia-smi is required as si.graphics() doesn't return sufficient information
        if (controller.vendor === GPU_VENDORS.Nvidia) {
            try {
                const { stdout } = await exec("nvidia-smi --query-gpu=driver_version,pci.device_id --format=csv,noheader");
                const [driverVersion, deviceAndVendorIdStr] = stdout.trim().split(", "); // e.g. 565.57.01, 0x27B810DE
                const deviceAndVendorId = parseInt(deviceAndVendorIdStr, 16);
                gpu.driver_version = driverVersion;
                gpu.device_id = (deviceAndVendorId >>> 16) & 0xFFFF; // Upper 16 bits
                gpu.vendor_id = deviceAndVendorId & 0xFFFF; // Lower 16 bits
            } catch (error) {
                console.error("Error executing nvidia-smi:", error);
            }
            return gpu;
        }

        // With Mac, si.graphics() returns corrent vendorId and IVS accepts device_id=0
        else if (controller.vendor === GPU_VENDORS.Apple) {
            return gpu;
        }
    });

    const gpus = await Promise.all(gpuPromises);
    return gpus.filter((gpu): gpu is GpuDescription => gpu !== undefined);
}


export async function getClientConfiguration(options: FetchOptions): Promise<ClientConfiguration> {

    const cpu = await si.cpu();
    const mem = await si.mem();
    const os = await si.osInfo();
    const gpus: GpuDescription[] = await constructGpusArray();

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
            "gpu": gpus,
            "memory": {
                "free": mem.free,
                "total": mem.total
            },
            "system": {
                "build": parseInt(os.build, 16),
                "name": os.distro,
                "release": os.release,
                "revision": os.release,
                "version": os.release
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