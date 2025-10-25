"use client";

import { Fragment } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleRun: boolean;
  onScheduleRunChange: (enabled: boolean) => void;
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                  <Dialog.Title className="text-2xl font-semibold text-gray-900">
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Schedule Run Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Schedule Run</h3>
                      <Switch
                        checked={scheduleRun}
                        onChange={onScheduleRunChange}
                        className={`${
                          scheduleRun ? "bg-black" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:bg-black/80`}
                      >
                        <span
                          className={`${
                            scheduleRun ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Run research automatically every day at 9:00 AM EST
                    </p>
                    
                    <p className="text-xs text-gray-400">
                      Last Updated: {getLastUpdatedText()}
                    </p>
                  </div>

                  {/* States Monitor Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">States Monitor</h3>
                      <span className="text-sm text-gray-500">
                        States Covered: {statesCovered}
                      </span>
                    </div>

                    {/* State Toggles */}
                    <div className="space-y-3">
                      {/* New Jersey */}
                      <div className="flex items-center justify-between">
                        <span className="text-base text-gray-900">New Jersey</span>
                        <Switch
                          checked={activeStates.newJersey}
                          onChange={(enabled) => onStateChange("newJersey", enabled)}
                          className={`${
                            activeStates.newJersey ? "bg-black" : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:bg-black/80`}
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
                        <span className="text-base text-gray-900">Michigan</span>
                        <Switch
                          checked={activeStates.michigan}
                          onChange={(enabled) => onStateChange("michigan", enabled)}
                          className={`${
                            activeStates.michigan ? "bg-black" : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:bg-black/80`}
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
                        <span className="text-base text-gray-900">Pennsylvania</span>
                        <Switch
                          checked={activeStates.pennsylvania}
                          onChange={(enabled) => onStateChange("pennsylvania", enabled)}
                          className={`${
                            activeStates.pennsylvania ? "bg-black" : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:bg-black/80`}
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
                        <span className="text-base text-gray-900">West Virginia</span>
                        <Switch
                          checked={activeStates.westVirginia}
                          onChange={(enabled) => onStateChange("westVirginia", enabled)}
                          className={`${
                            activeStates.westVirginia ? "bg-black" : "bg-gray-300"
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:bg-black/80`}
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
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-center text-gray-400">
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