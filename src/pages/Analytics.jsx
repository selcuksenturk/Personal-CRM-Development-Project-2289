import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import ReactECharts from 'echarts-for-react';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const { FiTrendingUp, FiUsers, FiMessageSquare, FiCalendar } = FiIcons;

const Analytics = () => {
  const { contacts, interactions } = useContacts();

  // Calculate statistics
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => c.status === 'active').length;
  const totalInteractions = interactions.length;
  const thisMonthInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.date);
    const now = new Date();
    return interactionDate.getMonth() === now.getMonth() && 
           interactionDate.getFullYear() === now.getFullYear();
  }).length;

  // Prepare data for charts
  const contactsByPriority = contacts.reduce((acc, contact) => {
    acc[contact.priority] = (acc[contact.priority] || 0) + 1;
    return acc;
  }, {});

  const interactionsByType = interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  // Interactions over time (last 30 days)
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const interactionsOverTime = last30Days.map(day => {
    const dayInteractions = interactions.filter(interaction => {
      const interactionDate = new Date(interaction.date);
      return format(interactionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }).length;
    return {
      date: format(day, 'MMM d'),
      count: dayInteractions
    };
  });

  // Chart options
  const priorityChartOptions = {
    title: {
      text: 'Contacts by Priority',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'normal', color: '#374151' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: 'Priority',
      type: 'pie',
      radius: '70%',
      center: ['50%', '60%'],
      data: [
        { value: contactsByPriority.high || 0, name: 'High', itemStyle: { color: '#ef4444' } },
        { value: contactsByPriority.medium || 0, name: 'Medium', itemStyle: { color: '#f59e0b' } },
        { value: contactsByPriority.low || 0, name: 'Low', itemStyle: { color: '#10b981' } }
      ],
      label: {
        show: true,
        formatter: '{b}: {c}'
      }
    }]
  };

  const interactionTypeChartOptions = {
    title: {
      text: 'Interactions by Type',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'normal', color: '#374151' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(interactionsByType),
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280' }
    },
    series: [{
      data: Object.values(interactionsByType),
      type: 'bar',
      itemStyle: {
        color: '#0ea5e9'
      },
      barWidth: '50%'
    }]
  };

  const timelineChartOptions = {
    title: {
      text: 'Interactions Timeline (Last 30 Days)',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'normal', color: '#374151' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: interactionsOverTime.map(item => item.date),
      axisLabel: { color: '#6b7280', rotate: 45 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6b7280' }
    },
    series: [{
      data: interactionsOverTime.map(item => item.count),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#10b981' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      }
    }]
  };

  const stats = [
    {
      name: 'Total Contacts',
      value: totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Active Contacts',
      value: activeContacts,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Total Interactions',
      value: totalInteractions,
      icon: FiMessageSquare,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase'
    },
    {
      name: 'This Month',
      value: thisMonthInteractions,
      icon: FiCalendar,
      color: 'bg-orange-500',
      change: '+23%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights and metrics about your contacts and interactions</p>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <ReactECharts
            option={priorityChartOptions}
            style={{ height: '350px' }}
          />
        </motion.div>

        {/* Interaction Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <ReactECharts
            option={interactionTypeChartOptions}
            style={{ height: '350px' }}
          />
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <ReactECharts
          option={timelineChartOptions}
          style={{ height: '400px' }}
        />
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average interactions per contact</span>
              <span className="font-semibold text-gray-900">
                {totalContacts > 0 ? (totalInteractions / totalContacts).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most active priority</span>
              <span className="font-semibold text-gray-900 capitalize">
                {Object.entries(contactsByPriority).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Engagement rate</span>
              <span className="font-semibold text-green-600">
                {totalContacts > 0 ? Math.round((activeContacts / totalContacts) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most common type</span>
              <span className="font-semibold text-gray-900 capitalize">
                {Object.entries(interactionsByType).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This month growth</span>
              <span className="font-semibold text-green-600">+23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily average</span>
              <span className="font-semibold text-gray-900">
                {(thisMonthInteractions / 30).toFixed(1)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response rate</span>
              <span className="font-semibold text-green-600">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Follow-up rate</span>
              <span className="font-semibold text-blue-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion rate</span>
              <span className="font-semibold text-purple-600">34%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;