import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import { format } from 'date-fns';

const { FiUsers, FiTrendingUp, FiMessageSquare, FiCalendar, FiPlus, FiArrowRight } = FiIcons;

const Dashboard = () => {
  const { contacts, interactions } = useContacts();

  const stats = [
    {
      name: 'Total Contacts',
      value: contacts.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'This Month',
      value: interactions.length,
      icon: FiMessageSquare,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Active Contacts',
      value: contacts.filter(c => c.status === 'active').length,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'This Week',
      value: 12,
      icon: FiCalendar,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const recentContacts = contacts.slice(0, 5);
  const recentInteractions = interactions.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your contacts.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.change}</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Contacts</h2>
              <Link
                to="/contacts"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <SafeIcon icon={FiArrowRight} className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  to={`/contacts/${contact.id}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      contact.priority === 'high' ? 'bg-red-500' :
                      contact.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Interactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Interactions</h2>
              <Link
                to="/interactions"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <SafeIcon icon={FiArrowRight} className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentInteractions.map((interaction) => {
                const contact = contacts.find(c => c.id === interaction.contactId);
                return (
                  <div key={interaction.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-lg ${
                      interaction.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      interaction.type === 'call' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{interaction.subject}</p>
                      <p className="text-sm text-gray-500">{contact?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(interaction.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contacts"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Contact</span>
            </Link>
            <Link
              to="/interactions"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
              <span>Log Interaction</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;