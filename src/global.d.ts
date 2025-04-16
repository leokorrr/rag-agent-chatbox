export {}

declare global {
  interface Window {
    mountChatWidget: ({
      containerId,
      apiEndpoint,
      agentId,
      shopUrl,
      shopToken,
      buttonPosition,
      header,
      footer,
      placeholder,
      initialMessage
    }: {
      containerId: string;
      apiEndpoint: string;
      agentId: string;
      shopUrl: string;
      shopToken: string;
      buttonPosition: string;
      header: string;
      footer: string;
      placeholder: string;
      initialMessage: string;
    }) => void;
  }
}