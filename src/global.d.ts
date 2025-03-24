export {}

declare global {
  interface Window {
    mountChatWidget: ({
      containerId,
      apiEndpoint,
      agentId,
      shopUrl,
      shopToken,
      buttonPosition
    }: {
      containerId: string;
      apiEndpoint: string;
      agentId: string;
      shopUrl: string;
      shopToken: string;
      buttonPosition: string;
    }) => void;
  }
}