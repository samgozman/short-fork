import { Controller, Get } from '@nestjs/common';

/**
 * Liveness probe for container health checks (Coolify).
 * Intentionally does not touch Redis or external sources,
 * so a slow upstream doesn't get a healthy container restarted.
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
