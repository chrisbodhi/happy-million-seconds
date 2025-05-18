# Million Seconds Club

A static web application to celebrate your million, billion, and trillion second birthdays, using Rust compiled to WebAssembly for calculations!

## Original Website
http://www.happymillionseconds.club/

## About

This is a rewrite of the Happy Million Seconds Club website using Rust compiled to WebAssembly. This application calculates exactly when your millionth, billionth, and trillionth second birthdays occur.

Key features:
- Static site (no server required)
- Rust/WebAssembly for reliable calculations
- Deep-linking via URL parameters
- Timezone support
- Responsive design

## Implementation Details

### Technology Stack

- **Rust** - Core calculation logic
- **WebAssembly (Wasm)** - Compiles Rust to run in the browser
- **JavaScript** - UI logic and WebAssembly integration
- **HTML/CSS** - User interface

### How It Works

1. The user enters their birth date, time, and timezone
2. The JavaScript code captures the current date, time, and timezone
3. This data is passed to Rust functions (compiled to WebAssembly)
4. Rust calculates:
   - Seconds difference between birth date and current time
   - Time until/since million, billion, and trillion second milestones
5. Results are displayed on the page
6. URL parameters are updated to enable deep-linking

## Development Setup

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- A local web server for testing

### Building the WebAssembly Module

1. Build the WebAssembly module:
   ```
   wasm-pack build --target web --out-dir ./wasm
   ```

2. Copy the generated JS glue file to the js directory:
   ```
   cp ./wasm/happy_million_seconds.js ./js/
   ```

3. Start a local web server:
   ```
   # Using Python 3
   python -m http.server
   
   # Or using Node.js
   npx serve
   ```

4. Open your browser and navigate to `http://localhost:8000`

## Deployment

This application can be deployed to any static hosting service, such as:
- GitHub Pages
- Netlify
- Vercel
- AWS S3

Simply build the WebAssembly module and deploy all the files together.

## Project Structure

```
.
├── Cargo.toml             # Rust project configuration
├── src/
│   └── lib.rs             # Rust WebAssembly implementation
├── index.html             # Main HTML page
├── css/
│   └── styles.css         # Styling
├── js/
│   ├── app.js             # Main application logic
│   └── wasm_loader.js     # WebAssembly loading utility
└── wasm/                  # WebAssembly compiled output (generated)
```

## License

[MIT](LICENSE)
