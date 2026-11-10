import "@testing-library/jest-dom";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (typeof window.matchMedia === "undefined") {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom no implementa object URLs: el visor de materiales las necesita.
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = () => "blob:mock";
}

if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = () => {};
}
