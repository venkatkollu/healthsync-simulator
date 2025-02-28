
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
  enabledContacts.forEach(contact => {
    const method = contact.contactType === 'phone' ? 'SMS' : 'Email';
    const icon = contact.contactType === 'phone' ? '📱' : '📧';
    
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-medium">Alert sent via {method}</div>
        <div className="text-xs opacity-80">To: {contact.name} ({contact.value})</div>
      </div>,
      {
        icon: <span className="text-xl">{icon}</span>,
        duration: 5000,
        className: "alert-toast"
      }
    );
    
    // In a real application, this would call an API to send the actual SMS or email
    console.log(`${method} alert to ${contact.name} (${contact.value}): ${message}`);
  });
  
  return enabledContacts;
};
