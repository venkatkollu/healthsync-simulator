
import React, { useState } from 'react';
import { Phone, Mail, X, Plus, Send, Check, Info } from 'lucide-react';
import { EmergencyContact } from '../utils/simulationUtils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendAlertToContacts } from '@/utils/alertUtils';
import { toast } from 'sonner';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  updateContacts: (contacts: EmergencyContact[]) => void;
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts, updateContacts }) => {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    contactType: 'phone',
    value: '',
    notify: true
  });
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleToggleNotify = (id: string) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === id ? { ...contact, notify: !contact.notify } : contact
    );
    updateContacts(updatedContacts);
  };

  const handleRemoveContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    updateContacts(updatedContacts);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.value) return;
    
    const contact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      contactType: newContact.contactType || 'phone',
      value: newContact.value,
      notify: newContact.notify || true
    };
    
    updateContacts([...contacts, contact]);
    setNewContact({
      name: '',
      contactType: 'phone',
      value: '',
      notify: true
    });
    setIsAddingContact(false);
    
    toast.success(`New ${contact.contactType} contact added: ${contact.name}`);
  };

  const handleSendTestAlert = async () => {
    const enabledContacts = contacts.filter(contact => contact.notify);
    
    if (enabledContacts.length === 0) {
      toast.warning('No enabled contacts to send test alerts to');
      return;
    }
    
    setIsSendingTest(true);
    try {
      toast.info('Sending test alerts to all enabled contacts...');
      
      await sendAlertToContacts(
        enabledContacts,
        "TEST ALERT: This is a test message from the health monitoring system."
      );
      
      toast.success(`Test alerts sent to ${enabledContacts.length} contact(s)`);
      
      // Show additional help info
      if (enabledContacts.some(c => c.contactType === 'email')) {
        toast.info(
          'Note: This is a simulation - no real emails are sent. Check browser console (F12) to see the email content.',
          { duration: 8000 }
        );
      }
    } catch (error) {
      console.error('Failed to send test alerts:', error);
      toast.error('Failed to send test alerts. Please try again.');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border shadow-sm animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            <p className="text-sm text-muted-foreground">People to notify during critical events</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={handleSendTestAlert}
              disabled={isSendingTest || contacts.filter(c => c.notify).length === 0}
            >
              <Send className="w-4 h-4" />
              {isSendingTest ? 'Sending...' : 'Test Alert'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1"
              onClick={() => setIsAddingContact(true)}
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[240px] pr-4 -mr-4">
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No emergency contacts added</p>
                <p className="text-xs mt-1">Add contacts to be notified during health emergencies</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div 
                  key={contact.id}
                  className="p-4 rounded-xl border bg-card flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                      {contact.contactType === 'phone' ? (
                        <Phone className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={contact.notify ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-2 gap-1"
                      onClick={() => handleToggleNotify(contact.id)}
                    >
                      {contact.notify ? (
                        <>
                          <Check className="w-3 h-3" />
                          Notifying
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Not Notifying
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            {isAddingContact && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h3 className="text-sm font-medium mb-3">Add New Contact</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Contact Type</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={newContact.contactType === 'phone' ? "default" : "outline"}
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setNewContact({...newContact, contactType: 'phone'})}
                      >
                        <Phone className="w-3 h-3" />
                        Phone
                      </Button>
                      <Button
                        type="button"
                        variant={newContact.contactType === 'email' ? "default" : "outline"}
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setNewContact({...newContact, contactType: 'email'})}
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {newContact.contactType === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <input
                      type={newContact.contactType === 'phone' ? 'tel' : 'email'}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder={newContact.contactType === 'phone' ? '+1 (555) 123-4567' : 'example@email.com'}
                      value={newContact.value}
                      onChange={(e) => setNewContact({...newContact, value: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      type="button" 
                      size="sm"
                      className="gap-1"
                      onClick={handleAddContact}
                    >
                      <Plus className="w-3 h-3" />
                      Add Contact
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddingContact(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <div className="flex gap-2 items-start">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div>
              <p className="mb-1">
                <strong>Simulation Mode:</strong> This demo simulates sending alerts. No real SMS or emails are sent.
              </p>
              <p>
                Try adding your own email address and selecting the "Critical" scenario before starting the simulation 
                or click the "Test Alert" button to see how notifications would be sent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
