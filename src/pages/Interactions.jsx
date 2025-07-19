import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import InteractionModal from '../components/InteractionModal';
import { format } from 'date-fns';

const { FiPlus, FiSearch, FiFilter, FiMessageSquare, FiMail, FiPhone, FiUsers } = FiIcons;

const Interactions = () => {
  const { interactions, contacts } = useContacts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredInteractions = interactions.filter(interaction => {
    const contact = contacts.find(c => c.id === interaction.contactId);
    const matchesSearch = interaction.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || interaction.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'email': return FiMail;
      case 'call': return FiPhone;
      case 'meeting': return FiUsers;
      default: return FiMessageSquare;
    }
  };

  const getInteractionColor = (type) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-600';
      case 'call': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactions</h1>
            <p className="text-gray-600">Track all your communications and activities</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Interaction</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search interactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Interactions List */}
      <div className="space-y-4">
        {filteredInteractions.map((interaction, index) => {
          const contact = contacts.find(c => c.id === interaction.contactId);
          return (
            <motion.div
              key={interaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getInteractionColor(interaction.type)}`}>
                  <SafeIcon icon={getInteractionIcon(interaction.type)} className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {interaction.subject}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="capitalize">{interaction.type}</span>
                        <span>•</span>
                        <span>{format(interaction.date, 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{format(interaction.date, 'h:mm a')}</span>
                      </div>
                      {contact && (
                        <Link
                          to={`/contacts/${contact.id}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {contact.name}
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${
                        interaction.outcome === 'positive' ? 'bg-green-500' :
                        interaction.outcome === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm text-gray-500 capitalize">{interaction.outcome}</span>
                    </div>
                  </div>
                  
                  {interaction.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {interaction.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredInteractions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <SafeIcon icon={FiMessageSquare} className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add First Interaction
          </button>
        </motion.div>
      )}

      {/* Interaction Modal */}
      <InteractionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedContactId('');
        }}
        contactId={selectedContactId}
      />
    </div>
  );
};

export default Interactions;