export const getSpeedLabel = (speed, id) => `
    <div id="${id}" 
         style="top: 0; right: 0; position: absolute; z-index: 9999999; margin: 10px 10px 10px 15px; padding: 0.5rem; opacity: 0.7; border-radius: 0.5rem; background: rgba(0,0,0,0.8); color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <span class="speed">${speed}x</span>
    </div>`;

