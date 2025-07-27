# Arogya Sahayak

This is an AI-powered medicine tracking and healthcare management platform.

## Development

1.  Install dependencies: `yarn install`
2.  Start the development server: `yarn dev`

## Deployment

This is a Single Page Application (SPA) built with React and Vite. When deploying, you need to configure your hosting provider to redirect all traffic to `index.html`. This allows `react-router-dom` to handle all the routing on the client-side.

-   **For Netlify**: A `public/_redirects` file has been included, which handles this automatically.
-   **For Vercel**: A `vercel.json` file has been included for the same purpose.
-   **For other providers (e.g., Nginx, Apache)**: You will need to configure the server to handle fallback routing. For Nginx, you would add `try_files $uri /index.html;` to your server block.
