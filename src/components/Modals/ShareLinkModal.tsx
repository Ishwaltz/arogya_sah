import React from 'react';
import { X, Share2, Link, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ShareLinkModal() {
  const { state, dispatch } = useApp();
  const { isOpen, url, code } = state.shareLinkModal;

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SHARE_MODAL' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-light/30 rounded-lg">
                <Share2 className="w-6 h-6 text-brand-dark" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Shareable Link
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Copy and share this with your trusted contact.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
              <Link className="w-4 h-4" />
              <span>Share URL</span>
            </label>
            <input type="text" readOnly value={url} className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center space-x-1">
              <Key className="w-4 h-4" />
              <span>Access Code</span>
            </label>
            <input type="text" readOnly value={code} className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg font-mono" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For security, please share the URL and Access Code separately. The link will grant read-only access to your health data.
          </p>
          <button
            onClick={handleClose}
            className="w-full px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
