import { SetMetadata } from '@nestjs/common';

export const THROTTLE_CUSTOM_KEY = 'throttle_custom';

export interface ThrottleOptions {
  limit: number;
  ttl: number; // Time window in seconds
}

export const CustomThrottle = (options: ThrottleOptions) =>
  SetMetadata(THROTTLE_CUSTOM_KEY, options);
