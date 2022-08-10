import { Module } from "@nestjs/common";
import { YeoConfigService } from "./config.service";

@Module({
  providers: [YeoConfigService],
  exports: [YeoConfigService],
})
export class YeoConfigModule {}
