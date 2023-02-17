import type { ExternalProvider } from "@ethersproject/providers";

type ExtendedExternalProvder = ExternalProvider & {networkVersion: string};
declare global {
  interface Window {
    ethereum: ExtendedExternalProvder | undefined;
  }
}
