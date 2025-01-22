import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    private readonly mailService: MailService,
    private mailerService: MailerService,
  ) { }

  @Cron(CronExpression.EVERY_30_SECONDS)
  testCron() {
    console.log('call me >>>>')
  }

  @Get()
  @Public()
  @ResponseMessage('Test send email')
  async handleTestMail() {
    const subscribers = await this.subscriberModel.find({})
    for (const subs of subscribers) {
      const subsSkills = subs.skills
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } })

      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company,
            salary: item.salary,
            skills: item.skills
          }
        })

        await this.mailerService.sendMail({
          to: "quattrinh@gmail.com",
          from: '"Support Team" <support@example.com>',
          subject: "Welcome to ...",
          template: "job",
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        })
      }

    }
  }
}
