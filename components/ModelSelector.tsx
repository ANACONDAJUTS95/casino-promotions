"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { HiMiniSparkles } from "react-icons/hi2";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  variant?: "dark" | "light";
}

const models = ["Gemini 2.5 Pro", "Claude 4.5 Sonnet"];

export default function ModelSelector({
  selectedModel,
  onModelChange,
  variant = "dark",
}: ModelSelectorProps) {
  const isDark = variant === "dark";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={`flex flex-row gap-2 items-center rounded-md py-2 px-4 transition-colors ${
          isDark
            ? "bg-transparent text-black hover:bg-gray-100"
            : "bg-white border border-gray-300 text-black hover:bg-gray-50"
        }`}
      >
        <HiMiniSparkles className={isDark ? "text-black" : "text-black"} />
        <span className="text-sm">{selectedModel}</span>
        <FaAngleDown className="text-sm" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {models.map((model) => (
              <Menu.Item key={model}>
                {({ active }) => (
                  <button
                    onClick={() => onModelChange(model)}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } ${
                      selectedModel === model
                        ? "bg-gray-50 font-semibold"
                        : "font-normal"
                    } group flex w-full items-center px-4 py-2 text-sm text-gray-900 transition-colors`}
                  >
                    <HiMiniSparkles
                      className={`mr-3 h-4 w-4 ${
                        selectedModel === model
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                    />
                    {model}
                    {selectedModel === model && (
                      <span className="ml-auto text-black">✓</span>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

