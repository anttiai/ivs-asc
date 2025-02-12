# Automatic Stream Configuration for AWS IVS.

Use `getClientConfiguration` to generate a `ClientConfiguration` object by analyzing the user's hardware and software setup and combining it with the desired streaming options. Use `fetchStreamConfiguration` to query AWS IVS REST API for the optimal streaming setup.

> Automatic stream configuration helps users get started quickly and automatically improves the quality of streams over time. Instead of users manually choosing settings (e.g., bitrate, resolution, framerate) that are set once and rarely tweaked, automatic stream configuration considers current software settings, hardware configuration, and platform support every time the user starts a new stream. For example, when a user upgrades the setup (e.g., with a new GPU), installs a new GPU driver, or the destination starts to support a new codec (e.g., H.265/HEVC), automatic stream configuration reacts and improves the quality of the user's next stream.

AWS documentation at [docs.aws.amazon.com](https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/multitrack-video-sw-integration.html#multitrack-video-sw-integration-auto-stream).

## Supported GPUs
- Nvidia: Requires *nvidia-smi*
- Apple silicon: No additional software required
- AMD: PRs welcome for device_id and vendor_id [heuristics](https://github.com/anttiai/ivs-asc/blob/main/src/ivs-asc.ts#L33)

## Installation
npm install ivs-asc --save

## Usage
Construct stream configuration without sending it to IVS
```ts
import { getClientConfiguration, FetchOptions } from 'ivs-asc';

const options: FetchOptions = {
    authKey: 'authkey',
    video: { width: 1920, height: 1080, fps: 60 }
}
getClientConfiguration(options).then(console.log);
```

Fetch optimal streaming configuration from IVS
```ts
import { fetchStreamConfiguration, FetchOptions, Response } from 'ivs-asc';

async function automaticStreamConfiguration() {
    const options: FetchOptions = {
        authKey: 'authkey',
        video: {
            width: 1920,
            height: 1080,
            fps: 60,
            maxBitrateKbps: 4000,
            maxTracks: 3,
            supportedCodecs: ["h264", "h265", "av1"]
        }
    }

    const response: Response = await fetchStreamConfiguration(options);
    if (response.status?.result === 'error') {
        console.log(response.status.html_en_us);
    }
    else {
        console.log(response);
    }
}
automaticStreamConfiguration();
```