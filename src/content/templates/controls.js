export const getControls = (backId, forwardId) => `
    <span id="ext-vk-video-rewind-container" class="videoplayer_controls_item" style="display: flex; align-items: center;">
        <div id="${backId}" class="videoplayer_controls_item videoplayer_btn" role="button" tabindex="0" aria-label="Back 15s" style="cursor: pointer; opacity: 0.7; transition: opacity 0.2s;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7.33325V9.99992L8.66667 9.19436" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M6.25293 9.79399C6.78698 8.46245 7.78649 7.36307 9.07092 6.69442C10.3553 6.02578 11.84 5.83195 13.2567 6.14796C14.6734 6.46397 15.9288 7.26898 16.7961 8.41758C17.6634 9.56618 18.0853 10.9826 17.9858 12.4111C17.8863 13.8396 17.2718 15.1859 16.2534 16.2068C15.235 17.2277 13.8797 17.856 12.4325 17.9781C10.9852 18.1002 9.54141 17.7082 8.36177 16.8727" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
        </div>
        <div id="${forwardId}" class="videoplayer_controls_item videoplayer_btn" role="button" tabindex="0" aria-label="Forward 15s" style="cursor: pointer; opacity: 0.7; transition: opacity 0.2s;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 7.33325V9.99992L15.3333 9.19436" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M17.7471 9.79399C17.213 8.46245 16.2135 7.36307 14.9291 6.69442C13.6447 6.02578 12.16 5.83195 10.7433 6.14796C9.32655 6.46397 8.07118 7.26898 7.20391 8.41758C6.33665 9.56618 5.91466 10.9826 6.01419 12.4111C6.11371 13.8396 6.72818 15.1859 7.74661 16.2068C8.76503 17.2277 10.1203 17.856 11.5675 17.9781C13.0148 18.1002 14.4586 17.7082 15.6382 16.8727" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
        </div>
    </span>`;

