'use client';
import React, { useState, useEffect } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: number;
  onTabChange?: (index: number) => void;
  containerClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab = 0,
  onTabChange,
  containerClassName = "flex w-full border border-border-1 rounded-[6px] mt-[16px]",
  buttonClassName = "flex items-center gap-1 px-[8px] py-[2px] text-[13px] cursor-pointer transition-all duration-300 text-neutral-300 rounded-[6px] m-[8px]",
  activeButtonClassName = "bg-surface-3 text-neutral-400",
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="w-full">
      <div className={containerClassName}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`${buttonClassName} ${
              activeTab === index ? activeButtonClassName : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="w-full mt-4 flex flex-col gap-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;