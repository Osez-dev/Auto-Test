import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailService {
  private ses: AWS.SES;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    });

    this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
  
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<h1>Email Verification</h1>
                   <p>Please click the link to verify your email: 
                   <a href="${verificationLink}">Verify Email</a></p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Verify Your Email Address',
        },
      },
      Source: process.env.SES_VERIFIED_EMAIL, // Ensure this email is verified in SES
    };
  
    await this.ses.sendEmail(params).promise();
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    const params = {
        Destination: { ToAddresses: [email] },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<h1>Reset Your Password</h1>
                           <p>Click the link below to reset your password:</p>
                           <a href="${resetLink}">Reset Password</a>`
                }
            },
            Subject: { Charset: 'UTF-8', Data: 'Password Reset Request' }
        },
        Source: process.env.SES_VERIFIED_EMAIL
    };

    await this.ses.sendEmail(params).promise();
}

}