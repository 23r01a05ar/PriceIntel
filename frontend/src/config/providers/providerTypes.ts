export interface ProviderConfig {
  id: string;
  host: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  payloadTemplate?: string;
  enabled: boolean;
}
