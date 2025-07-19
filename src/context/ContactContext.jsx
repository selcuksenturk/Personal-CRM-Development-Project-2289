import React, { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleContacts = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        tags: ['client', 'tech'],
        status: 'active',
        priority: 'high',
        notes: 'Key contact for the mobile app project. Very responsive and technical.',
        createdAt: new Date('2024-01-15'),
        lastContact: new Date('2024-01-20'),
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9ad3b71?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@startup.com',
        phone: '+1 (555) 987-6543',
        company: 'StartupXYZ',
        position: 'CEO',
        tags: ['prospect', 'startup'],
        status: 'active',
        priority: 'medium',
        notes: 'Interested in our consulting services. Follow up next week.',
        createdAt: new Date('2024-01-10'),
        lastContact: new Date('2024-01-18'),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@designstudio.com',
        phone: '+1 (555) 456-7890',
        company: 'Creative Design Studio',
        position: 'Art Director',
        tags: ['partner', 'design'],
        status: 'active',
        priority: 'high',
        notes: 'Collaborating on the new brand identity project.',
        createdAt: new Date('2024-01-05'),
        lastContact: new Date('2024-01-19'),
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const sampleInteractions = [
      {
        id: '1',
        contactId: '1',
        type: 'email',
        subject: 'Project Update',
        description: 'Discussed project timeline and deliverables',
        date: new Date('2024-01-20'),
        outcome: 'positive'
      },
      {
        id: '2',
        contactId: '2',
        type: 'call',
        subject: 'Initial Consultation',
        description: 'First call to understand their needs',
        date: new Date('2024-01-18'),
        outcome: 'neutral'
      },
      {
        id: '3',
        contactId: '3',
        type: 'meeting',
        subject: 'Design Review',
        description: 'Reviewed initial design concepts',
        date: new Date('2024-01-19'),
        outcome: 'positive'
      }
    ];

    setContacts(sampleContacts);
    setInteractions(sampleInteractions);
  }, []);

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastContact: new Date()
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id, updates) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    setInteractions(prev => prev.filter(interaction => interaction.contactId !== id));
  };

  const addInteraction = (interaction) => {
    const newInteraction = {
      ...interaction,
      id: Date.now().toString(),
      date: new Date()
    };
    setInteractions(prev => [...prev, newInteraction]);
    
    // Update last contact date for the contact
    updateContact(interaction.contactId, { lastContact: new Date() });
  };

  const getContactInteractions = (contactId) => {
    return interactions.filter(interaction => interaction.contactId === contactId);
  };

  const value = {
    contacts,
    interactions,
    addContact,
    updateContact,
    deleteContact,
    addInteraction,
    getContactInteractions
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};