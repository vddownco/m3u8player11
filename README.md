# M3U8 Player

A simple M3U8 video player for playing HLS format video streams.

## Features

- Play M3U8 format video streams
- Support for most modern browsers
- Clean and responsive user interface
- Tools for parsing M3U8 files and downloading or creating test TS files
- Local proxy for remote files - automatically forwards M3U8 and TS file requests, solving CORS limitations
- Multiple CORS handling modes - Standard, Compatible, and Proxy modes available
- Support for both local and remote M3U8 files
- Dark/Light theme toggle for better viewing experience
- Drag and drop file upload functionality
- Flexible base URL configuration for relative paths in local M3U8 files

## Usage

1. Start the server:

```bash
npm start
```

2. Open your browser and visit: http://localhost:3000

## Directory Structure

```
/
├── index.html        # Player webpage
├── server.js         # HTTP server
├── package.json      # Project configuration
└── README.md         # Documentation
```

## Tech Stack

- HTML5 Video
- HLS.js (for browsers without native HLS playback support)
- Node.js (simple HTTP server)

## Notes

- M3U8 files and TS files must be in the same directory
- Due to browser security restrictions, these files must be served via an HTTP server

## Extended Features

- You can modify the styles in `index.html` to customize player appearance
- You can edit `server.js` to add more functionality, such as CORS settings, cache control, etc. 

### Build Docker Image

```bash
docker build -t m3u8-player .
```

### Run Docker Container

```bash
docker run -d -p 3000:3000 --name m3u8-player-container m3u8-player
```

## Acknowledgement

- https://bento.me/wushihong
- https://onee.page/wushihong
- https://www.f6s.com/shihong-wu
- https://ramen.tools/@shihongwu
- https://www.behance.net/wushihong
- https://tap.bio/@wushihong
- https://peerlist.io/wushihong
