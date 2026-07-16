"use client";
import React, { useState } from "react";
import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  active?: number;
}

const Accordion: React.FC<AccordionProps> = ({ items, active = -1 }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(active);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-[12px]">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-surface-1 mx-[10px] rounded-[6px]"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full text-left px-[12px] py-[10px] bg-surface-4 flex justify-between items-center focus:outline-none"
          >
            <span className="font-medium text-neutral-400 text-[13px]">
              {item.title}
            </span>
            <span className="flex flex-row gap-[16px]">
              {activeIndex === index ? (
                <CaretUpIcon size={18} />
              ) : (
                <CaretDownIcon size={18} />
              )}
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeIndex === index ? "px-[12px] py-[12px]" : "max-h-0"
            }`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
