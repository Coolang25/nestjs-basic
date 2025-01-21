import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @ResponseMessage('Test send email')
  async handleTestMail() {
    await this.mailerService.sendMail({
      to: "quattrinh@gmail.com",
      from: '"Support Team" <support@example.com>',
      subject: "Welcome to ...",
      template: "test"
    })
  }
}
