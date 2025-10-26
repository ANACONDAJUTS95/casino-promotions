"use client";

import { Fragment } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleRun: boolean;
  onScheduleRunChange: (enabled: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  activeStates: {
    newJersey: boolean;
    michigan: boolean;
    pennsylvania: boolean;
    westVirginia: boolean;
  };
  onStateChange: (state: keyof SettingsModalProps["activeStates"], enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  scheduleRun,
  onScheduleRunChange,
  darkMode,
  onDarkModeChange,
  autoRefresh,
  onAutoRefreshChange,
  activeStates,
  onStateChange,
}: SettingsModalProps) {
  // Count active states
  const statesCovered = Object.values(activeStates).filter(Boolean).length;

  // Get current time for "Last Updated"
  const getLastUpdatedText = () => {
    return "Just now";
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-8 shadow-xl transition-all ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}>
                {/* Header */}
                <div className={`flex items-center justify-between pb-4 mb-6 ${
                  darkMode ? "border-b border-gray-700" : "border-b border-gray-200"
                }`}>
                  <Dialog.Title className={`text-2xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className={`transition-colors cursor-pointer ${
                      darkMode 
                        ? "text-gray-400 hover:text-gray-300" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Page Settings Section */}
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Appearance & Behavior
                    </h3>
                    
                    {/* DARK/LIGHT MODE SWITCH */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          Dark Mode
                        </h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Toggle between light and dark theme
                        </p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onChange={onDarkModeChange}
                        className={`${
                          darkMode ? "bg-blue-600" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          darkMode ? "hover:bg-blue-700" : "hover:bg-gray-400"
                        }`}
                      >
                        <span
                          className={`${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                    
                    {/* AUTO-REFRESH TOGGLE */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          Auto-Refresh
                        </h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Automatically refresh table every 90 seconds
                        </p>
                      </div>
                      <Switch
                        checked={autoRefresh}
                        onChange={onAutoRefreshChange}
                        className={`${
                          autoRefresh ? (darkMode ? "bg-blue-600" : "bg-black") : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          autoRefresh 
                            ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                            : "hover:bg-gray-400"
                        }`}
                      >
                        <span
                          className={`${
                            autoRefresh ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>

                    <div className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                    
                    {/* SCHEDULE RUN */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          Schedule Run
                        </h4>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Run research automatically every day at 9:00 AM EST
                        </p>
                      </div>
                      <Switch
                        checked={scheduleRun}
                        onChange={onScheduleRunChange}
                        className={`${
                          scheduleRun ? (darkMode ? "bg-blue-600" : "bg-black") : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                          scheduleRun 
                            ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                            : "hover:bg-gray-400"
                        }`}
                      >
                        <span
                          className={`${
                            scheduleRun ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                    
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      Last Updated: {getLastUpdatedText()}
                    </p>
                  </div>

                  {/* States Monitor Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        States Monitor
                      </h3>
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        States Covered: {statesCovered}
                      </span>
                    </div>

                    {/* State Toggles */}
                    <div className="space-y-3">
                      {/* New Jersey */}
                      <div className="flex items-center justify-between">
                        <span className={`text-base ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          New Jersey
                        </span>
                        <Switch
                          checked={activeStates.newJersey}
                          onChange={(enabled) => onStateChange("newJersey", enabled)}
                          className={`${
                            activeStates.newJersey 
                              ? (darkMode ? "bg-blue-600" : "bg-black") 
                              : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            activeStates.newJersey 
                              ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                              : "hover:bg-gray-400"
                          }`}
                        >
                          <span
                            className={`${
                              activeStates.newJersey ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>

                      {/* Michigan */}
                      <div className="flex items-center justify-between">
                        <span className={`text-base ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          Michigan
                        </span>
                        <Switch
                          checked={activeStates.michigan}
                          onChange={(enabled) => onStateChange("michigan", enabled)}
                          className={`${
                            activeStates.michigan 
                              ? (darkMode ? "bg-blue-600" : "bg-black") 
                              : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            activeStates.michigan 
                              ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                              : "hover:bg-gray-400"
                          }`}
                        >
                          <span
                            className={`${
                              activeStates.michigan ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>

                      {/* Pennsylvania */}
                      <div className="flex items-center justify-between">
                        <span className={`text-base ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          Pennsylvania
                        </span>
                        <Switch
                          checked={activeStates.pennsylvania}
                          onChange={(enabled) => onStateChange("pennsylvania", enabled)}
                          className={`${
                            activeStates.pennsylvania 
                              ? (darkMode ? "bg-blue-600" : "bg-black") 
                              : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            activeStates.pennsylvania 
                              ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                              : "hover:bg-gray-400"
                          }`}
                        >
                          <span
                            className={`${
                              activeStates.pennsylvania ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>

                      {/* West Virginia */}
                      <div className="flex items-center justify-between">
                        <span className={`text-base ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                          West Virginia
                        </span>
                        <Switch
                          checked={activeStates.westVirginia}
                          onChange={(enabled) => onStateChange("westVirginia", enabled)}
                          className={`${
                            activeStates.westVirginia 
                              ? (darkMode ? "bg-blue-600" : "bg-black") 
                              : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                            activeStates.westVirginia 
                              ? (darkMode ? "hover:bg-blue-700" : "hover:bg-gray-800") 
                              : "hover:bg-gray-400"
                          }`}
                        >
                          <span
                            className={`${
                              activeStates.westVirginia ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`mt-8 pt-6 ${
                  darkMode ? "border-t border-gray-700" : "border-t border-gray-200"
                }`}>
                  <p className={`text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Powered by: Google Gemini
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}