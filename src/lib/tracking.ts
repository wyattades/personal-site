declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    umami?: {
      track: (
        event: string,
        properties: Record<string, string | boolean | number | null>,
      ) => void;
    };
  }
}

export function trackEvent(
  event: string,
  properties: Record<string, string | boolean | number | null>,
) {
  if (typeof window !== "undefined" && window.umami?.track) {
    window.umami.track(event, properties);
  }
}
