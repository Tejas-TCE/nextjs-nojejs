import sendEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmailSending = async () => {
  try {
    console.log('Attempting to send a test email...');
    
    const testEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3498db; text-align: center;">Test Email</h2>
          <p>Hello User,</p>
          <p>This is a test email to verify that the email sending functionality is working properly.</p>
          <p>Current timestamp: ${new Date().toISOString()}</p>
          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa;">
              <p>Best regards,<br>The OneBoss Team</p>
          </div>
      </div>
    `;
    
    // Send test email
    const result = await sendEmail(
      'welcome-test@example.com', // Replace with your test email
      'OneBoss Email Test',
      testEmailHTML
    );
    
    if (result) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.log('❌ Failed to send test email.');
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
};

// Run the test
testEmailSending(); 