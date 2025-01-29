"use client";
import React, {ElementType, useEffect, useMemo, useRef, useState} from "react";
import {LucideChevronDown} from "@/utils/icons";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  className?: string;
}

interface DropdownProps {
  Icon: ElementType;
  label: string;
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder: string;
  searchable?: boolean;
  multiSelect?: boolean;
  loading?: boolean;
  position?: 'top' | 'bottom';
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
                                             Icon,
  label,
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
  multiSelect = false,
  loading = false,
  position = 'bottom',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return options.filter((option) => {
      const label = option.label.toLowerCase();
      const description = option.description?.toLowerCase() || '';
      const value = option.value.toLowerCase();
      
      return label.includes(normalizedSearchTerm) ||
             description.includes(normalizedSearchTerm) ||
             value.includes(normalizedSearchTerm);
    });
  }, [searchable, searchTerm, options]);

  const selectedValues = Array.isArray(value) ? value : [value];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={`block text-sm font-semibold mb-1 ${
        disabled ? 'text-gray-400' : 'text-gray-700'
      }`}>
        {label}
      </label>
      <div>
      <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full h-[52px] px-4 bg-white border rounded-lg
            flex items-center justify-between
            transition-all duration-200
            ${isOpen ? "border-purple-500 ring-2 ring-purple-100" : "border-gray-200 hover:border-gray-300"}
            ${loading ? "opacity-50 pointer-events-none" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
          `}
        >
          <div className="flex items-center gap-3 min-w-0 h-full">
            {Icon && (
              <Icon
                  className={`w-5 h-5 shrink-0 ${
                  selectedValues.length ? "text-purple-500" : "text-gray-400"
                }`}
              />
            )}
            {multiSelect ? (
              <div className="flex items-center min-w-0 overflow-hidden h-[32px]">
                {selectedOptions.length > 0 ? (
                  <div className="flex gap-1.5 items-center overflow-x-auto no-scrollbar">
                    {selectedOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`shrink-0 h-[26px] px-2 rounded-md inline-flex items-center ${
                          option.className ? `bg-opacity-10 bg-${option.className.split('-')[1]}-100` : 'bg-purple-50'
                        }`}
                      >
                        <span className={`text-sm truncate ${option.className || 'text-purple-700'}`}>
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 truncate text-sm">{placeholder}</span>
                )}
              </div>
            ) : (
              <span
                className={`truncate text-sm ${
                  selectedOptions.length ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {selectedOptions.length
                  ? selectedOptions[0].label
                  : placeholder}
              </span>
            )}
          </div>
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          ) : (
              <LucideChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                position === 'top'
                  ? isOpen ? 'rotate-0' : 'rotate-180'
                  : isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          )}
        </button>

        {isOpen && !disabled && (
          <div 
            className={`absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg ${
              position === 'top' 
                ? 'bottom-full mb-1' 
                : 'top-full mt-1'
            }`}
          >
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Icon icon={"lucide:search"}
                        className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"/>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
                    autoComplete="off"
                  />
                </div>
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-2 relative z-100">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center">
                  <Icon icon={"lucide:refresh-ccw"} className="w-4 h-4 animate-spin mr-2"/>
                  Loading...
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full h-[52px] px-4 flex items-center gap-3 text-left
                      hover:bg-purple-50/60 transition-all duration-200
                      ${selectedValues.includes(option.value) ? 'bg-purple-50' : ''}
                      ${index !== filteredOptions.length - 1 ? 'border-b border-gray-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3 grow min-w-0">
                      {option.icon && (
                          <Icon
                              icon={option.icon}
                              className={`w-5 h-5 shrink-0 ${
                            selectedValues.includes(option.value)
                              ? option.className || 'text-purple-500'
                              : option.className || 'text-gray-400'
                          }`}
                        />
                      )}
                      <div className="flex flex-col justify-center min-w-0">
                        <span 
                          className={`truncate text-sm font-semibold ${
                            option.className || 'text-gray-900'
                          }`}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-xs text-gray-600 truncate">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {multiSelect && (
                        <div className={`shrink-0 w-5 h-5 ${
                        selectedValues.includes(option.value)
                          ? option.className || 'text-purple-500'
                          : 'text-gray-400 opacity-0'
                      }`}>
                        <Icon icon={"lucide:circle-check"} className="w-5 h-5"/>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
