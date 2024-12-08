import { init } from '@wasmer/sdk';
// path to the Wasm module
//@ts-ignore
import WasmModule from '@wasmer/sdk/wasm?url';

let wasmerInitialized = false;

export const initializeWasmer = async () => {
  if (!wasmerInitialized) {
    await await init({ module: WasmModule, sdkUrl: `${window.location.href}/sdk/index.mjs` });
    wasmerInitialized = true;
    console.log('Wasmer SDK initialized');
  }
};
