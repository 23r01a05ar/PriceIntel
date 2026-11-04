import { ProviderConfig } from './providerTypes';
import * as configs from './providerConfig';

export const PROVIDER_REGISTRY: Record<string, ProviderConfig> = {
  amazon: configs.amazon,
  flipkart: configs.flipkart,
  walmart: configs.walmart,
  realtimeproductsearch: configs.realtimeproductsearch,
  websearch: configs.websearch,
  chatgptvision: configs.chatgptvision,
};
