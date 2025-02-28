
import { EmergencyContact } from './simulationUtils';
import { toast } from 'sonner';

/**
 * Simulates sending an alert message to emergency contacts
 * In a real application, this would integrate with SMS and email APIs
 */
export const sendAlertToContacts = async (
  contacts: EmergencyContact[],
  message: string
): Promise<EmergencyContact[]> => {
  if (!contacts || contacts.length === 0) {
    return [];
  }

  console.log(`Simulating sending alerts to ${contacts.length} contacts`);
  
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter for contacts with notification enabled
  const enabledContacts = contacts.filter(contact => contact.notify);
  
  // Show toast notifications for each contact
  for (const contact of enabledContacts) {
    const method = contact.contactType === 'phone' ? 'SMS' : 'Email';
    const icon = contact.contactType === 'phone' ? '📱' : '📧';
    
    // First notify that we're sending
    if (contact.contactType === 'email') {
      toast.info(`📧 Sending email to ${contact.value}...`, {
        duration: 2000,
        className: "alert-toast"
      });
      
      // Simulate email delivery delay (emails take longer than SMS)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate email content that would be sent
      console.log(`
========== SIMULATED EMAIL ==========
To: ${contact.value}
From: health-monitor@example.com
Subject: HEALTH ALERT - Abnormal Heart Rate Detected

Dear ${contact.name},

${message}

This is an automated alert from your Health Monitoring System.
Please take appropriate action immediately.

Best regards,
Health Monitoring System Team
=====================================
      `);
    } else {
      // Simulate SMS sending
      toast.info(`📱 Sending SMS to ${contact.value}...`, {
        duration: 2000,
        className: "alert-toast"
      });
      
      // Simulate SMS delivery delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Log SMS content
      console.log(`
========== SIMULATED SMS ==========
To: ${contact.value}
URGENT: ${message}
=================================
      `);
    }
    
    // Then show success notification
    toast.success(`${icon} Alert sent via ${method} to ${contact.name} (${contact.value})`, {
      duration: 5000,
      className: "alert-toast sms-send-animation"
    });
    
    // In a real application, this would call an API to send the actual SMS or email
    console.log(`${method} alert successfully delivered to ${contact.name} (${contact.value})`);
  }
  
  return enabledContacts;
};
