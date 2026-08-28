import { Module } from '@nestjs/common';
import { HealthCheckController } from './HealthCheckController';
import { HealthCheckService } from './Services/HealthCheckService';

@Module({
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
  exports: [HealthCheckService],
})
export class HealthCheckModule {}

export default HealthCheckModule;
