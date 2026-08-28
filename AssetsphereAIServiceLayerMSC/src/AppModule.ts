import { Module } from '@nestjs/common';
import { HealthCheckModule } from './Features/HealthCheck/HealthCheckModule';

@Module({
  imports: [HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

export default AppModule;
