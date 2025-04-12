
interface EmailNotification {
  to: string;
  subject: string;
  content: {
    title: string;
    message: string;
    details?: Record<string, string>;
    callToAction?: {
      text: string;
      url: string;
    };
  };
}

/**
 * Sends an email notification (mock implementation)
 */
export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  console.log('Sending email notification:', notification);
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};
