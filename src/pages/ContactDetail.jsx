import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import InteractionModal from '../components/InteractionModal';
import { format } from 'date-fns';

const { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiPhone, FiBriefcase, FiCalendar, FiPlus, FiMessageSquare } = FiIcons;

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact, getContactInteractions } = useContacts();
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);

  const contact = contacts.find(c => c.id === id);
  const interactions = getContactInteractions(id);

  if (!contact) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact not found</h2>
          <Link to="/contacts" className="text-primary-600 hover:text-primary-700">
            ← Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/contacts"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Details</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="text-center mb-6">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">{contact.position}</p>
              <p className="text-sm text-gray-500">{contact.company}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                <a
                  href={`tel:${contact.phone}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <SafeIcon icon={FiBriefcase} className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{contact.company}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Last contact: {format(contact.lastContact, 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Priority</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.priority === 'high' ? 'bg-red-100 text-red-800' :
                  contact.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {contact.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Interactions and Notes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {contact.notes || 'No notes available.'}
            </p>
          </motion.div>

          {/* Interactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Interactions</h3>
              <button
                onClick={() => setIsInteractionModalOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add Interaction</span>
              </button>
            </div>

            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${
                      interaction.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      interaction.type === 'call' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{interaction.subject}</h4>
                        <span className="text-sm text-gray-500">
                          {format(interaction.date, 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{interaction.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500 capitalize">{interaction.type}</span>
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          interaction.outcome === 'positive' ? 'bg-green-500' :
                          interaction.outcome === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-xs text-gray-500 capitalize">{interaction.outcome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No interactions recorded yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Interaction Modal */}
      <InteractionModal
        isOpen={isInteractionModalOpen}
        onClose={() => setIsInteractionModalOpen(false)}
        contactId={contact.id}
      />
    </div>
  );
};

export default ContactDetail;