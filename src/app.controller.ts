import { Controller, Get } from '@nestjs/common';
import { ErrorHandling } from './configs/error-handling';

@Controller('')
export class AppController {
  @Get()
  async ping() {
    try {
      return { response: 'pong' };
    } catch (error) {
      new ErrorHandling(error);
    }
  }
}
