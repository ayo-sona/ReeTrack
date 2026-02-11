import { ApiProperty } from '@nestjs/swagger';

export class SendCustomEmailDto {
  @ApiProperty({
    description: 'Recipient email addresses',
    example: ['user1@example.com', 'user2@example.com'],
    isArray: true,
  })
  to: string[];

  @ApiProperty({
    description: 'Email subject',
    example: 'Important Update About Your Subscription',
  })
  subject: string;

  @ApiProperty({
    description: 'Name of the email template to use',
    example: 'event_notification',
  })
  template: string;

  @ApiProperty({
    description: 'Context variables for the email template',
    example: {
      eventName: 'Annual Conference',
      eventDate: '2025-03-15',
      eventLocation: 'Virtual',
      additionalNotes: 'Please join us for our annual conference.',
    },
    type: 'object',
    additionalProperties: true,
  })
  context: Record<string, any>;
}
