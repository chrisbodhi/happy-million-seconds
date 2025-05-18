// This file is responsible for loading and initializing the WebAssembly module

// The path to our compiled wasm module
const wasmPath = "./wasm/happy_million_seconds_bg.wasm";

// This will hold our wasm module instance once it's loaded
let wasmModule = null;

// Load the wasm module and initialize it
async function initWasm() {
  try {
    // Dynamic import of the wasm-bindgen generated JS glue code
    const {
      default: init,
      calculate_seconds_diff,
      format_milestone_date,
      get_all_timezones,
    } = await import("./happy_million_seconds.js");

    console.log("Loading WASM from path:", wasmPath);

    // Initialize the wasm module
    await init(wasmPath);

    // Store the module API for later use
    wasmModule = {
      calculate_seconds_diff,
      format_milestone_date,
      get_all_timezones,
    };

    // Signal that wasm is loaded and ready
    document.dispatchEvent(new Event("wasm-loaded"));

    return wasmModule;
  } catch (error) {
    console.error("Failed to load WebAssembly module:", error);
    document.getElementById("birthday-form").innerHTML = `
      <div class="error-message">
        <p>Failed to load the calculator. Please try refreshing the page.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

// Start loading the WASM module immediately
const wasmReady = initWasm();

// Export a function to get the module when it's ready
export async function getWasmModule() {
  if (wasmModule) {
    return wasmModule;
  }

  return await wasmReady;
}
