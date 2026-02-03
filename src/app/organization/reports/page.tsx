'use client';

import { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet, Table } from 'lucide-react';
import { ExportFormat, ExportType } from '../../../types/organization';

export default function ReportsPage() {
  const [exportConfig, setExportConfig] = useState({
    type: 'members' as ExportType,
    format: 'csv' as ExportFormat,
    dateFrom: '',
    dateTo: '',
  });

  const exportTypes = [
    {
      id: 'members' as ExportType,
      name: 'Members List',
      description: 'Export all member data with subscription details',
      icon: Table,
    },
    {
      id: 'payments' as ExportType,
      name: 'Payment History',
      description: 'Export payment transactions and history',
      icon: FileText,
    },
    {
      id: 'revenue' as ExportType,
      name: 'Revenue Report',
      description: 'Export revenue analytics and trends',
      icon: FileSpreadsheet,
    },
    {
      id: 'plans' as ExportType,
      name: 'Plans Report',
      description: 'Export subscription plans and member distribution',
      icon: FileDown,
    },
  ];

  const formats = [
    { id: 'csv' as ExportFormat, name: 'CSV', description: 'Comma-separated values' },
    { id: 'excel' as ExportFormat, name: 'Excel', description: 'Microsoft Excel format' },
    { id: 'pdf' as ExportFormat, name: 'PDF', description: 'Printable document' },
  ];

  const handleExport = () => {
    console.log('Exporting:', exportConfig);
    // TODO: Implement actual export logic
    alert(`Exporting ${exportConfig.type} as ${exportConfig.format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reports & Export
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Export your data in various formats
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Report Type */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Report Type
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {exportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = exportConfig.type === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setExportConfig({ ...exportConfig, type: type.id })}
                    className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isSelected
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {type.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Date Range (Optional)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  value={exportConfig.dateFrom}
                  onChange={(e) => setExportConfig({ ...exportConfig, dateFrom: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <input
                  id="dateTo"
                  type="date"
                  value={exportConfig.dateTo}
                  onChange={(e) => setExportConfig({ ...exportConfig, dateTo: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Select Format */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Export Format
            </h3>
            <div className="space-y-3">
              {formats.map((format) => {
                const isSelected = exportConfig.format === format.id;
                
                return (
                  <label
                    key={format.id}
                    className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={isSelected}
                      onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value as ExportFormat })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isSelected
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {format.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {format.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Export Summary
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Report Type
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {exportConfig.type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Format
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {exportConfig.format.toUpperCase()}
                </p>
              </div>
              {(exportConfig.dateFrom || exportConfig.dateTo) && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Date Range
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {exportConfig.dateFrom || 'Start'} to {exportConfig.dateTo || 'Now'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleExport}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <FileDown className="h-4 w-4" />
              Export Report
            </button>

            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">
                The report will be downloaded to your device automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}