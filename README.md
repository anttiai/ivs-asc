# ivs-asc
Automatic Stream Configuration for AWS IVS. Requirements can be found at [docs.aws.amazon.com](https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/multitrack-video-sw-integration.html#multitrack-video-sw-integration-auto-stream).

## Examples
Print out the configuration that will be sent to IVS
```ts
import { getClientConfiguration } from "./src/ivs-asc";
import { FetchOptions } from "./src/types/fetchOptions";

const options: FetchOptions = {
    authKey: 'authkey123',
    video: {
        width: 1920,
        height: 1080,
        fps: 60
    }
}
getClientConfiguration(options).then(console.log);
```

Fetch stream configuration from IVS
```ts
import { fetchStreamConfiguration } from "./src/ivs-asc";
import { FetchOptions } from "./src/types/fetchOptions";
import { Response } from "./src/types/response";

async function automaticStreamConfiguration() {
    const options: FetchOptions = {
        authKey: 'authkey123',
        video: {
            width: 1920,
            height: 1080,
            fps: 60
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