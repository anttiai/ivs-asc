# Automatic Stream Configuration for AWS IVS.

Use `createClientConfiguration` to generate a `ClientConfiguration` object by combining the user's hardware and software setup analysis with the desired streaming options. Use `fetchStreamConfiguration` to query the AWS IVS REST API for the optimal streaming configuration.

> Automatic stream configuration helps users get started quickly and automatically improves the quality of streams over time. Instead of users manually choosing settings (e.g., bitrate, resolution, framerate) that are set once and rarely tweaked, automatic stream configuration considers current software settings, hardware configuration, and platform support every time the user starts a new stream. For example, when a user upgrades the setup (e.g., with a new GPU), installs a new GPU driver, or the destination starts to support a new codec (e.g., H.265/HEVC), automatic stream configuration reacts and improves the quality of the user's next stream.

AWS documentation at [docs.aws.amazon.com](https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/multitrack-video-sw-integration.html#multitrack-video-sw-integration-auto-stream).

## Supported GPUs
- Nvidia: Requires *nvidia-smi*
- Apple silicon: No additional software required
- AMD: PRs welcome for device_id and vendor_id [heuristics](https://github.com/anttiai/ivs-asc/blob/main/src/index.ts#L33)

## Installation
npm install ivs-asc --save

## Usage
Create and print out the client configuration
```ts
import { createClientConfiguration, FetchOptions } from 'ivs-asc';

const options: FetchOptions = {
    authKey: 'authkey',
    video: { width: 1920, height: 1080, fps: 60 }
}
createClientConfiguration(options).then(console.log);
```

Fetch optimal streaming configuration from IVS
```ts
import { fetchStreamConfiguration, FetchOptions, IVSResponse } from 'ivs-asc';

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

    const clientConfiguration = await createClientConfiguration(options);
    const response: IVSResponse = await fetchStreamConfiguration(clientConfiguration);
    if (response.status?.result === 'error') {
        console.log(response.status.html_en_us);
    }
    else {
        console.log(response);
    }
}
automaticStreamConfiguration();
```