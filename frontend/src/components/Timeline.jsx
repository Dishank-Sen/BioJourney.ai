import React, { useRef, useEffect } from "react";

export default function Timeline({ events, activeId, onSelect }) {
  const scrollerRef = useRef(null);
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeId]);

  if (!events || events.length === 0) {
    return <p className="text-gray-500">No events in timeline.</p>;
  }

  // Calculate a minimum width for the container to prevent collapse. 10rem (w-40) per event.
  const containerMinWidth = events.length * 10;

  return (
    <div className="w-full">
      <div ref={scrollerRef} className="overflow-x-auto custom-scrollbar">
        <div
          className="relative flex justify-between items-start py-12 px-8"
          style={{ minWidth: `${containerMinWidth}rem` }}
        >
          {/* The main horizontal connecting line */}
          <div className="absolute top-[72px] left-8 right-8 h-0.5 bg-gray-300 z-0" />

          {/* Map through events to create nodes */}
          {events.map((event) => {
            const isActive = event.id === activeId;
            const IconComponent = event.icon;

            return (
              <div
                key={event.id}
                ref={isActive ? activeItemRef : null}
                onClick={() => onSelect?.(event.id)}
                className="relative flex-1 flex justify-center cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  {isActive && (
                    <div className="absolute bottom-full mb-4 flex flex-col items-center">
                      <span className="font-semibold text-blue-600 whitespace-nowrap">
                        {event.title}
                      </span>
                      <div className="w-0.5 h-6 bg-blue-500 mt-2" />
                    </div>
                  )}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300 group-hover:border-gray-500"
                    }`}
                  >
                    <div className={isActive ? "text-white" : "text-gray-500 group-hover:text-gray-800"}>
                      <IconComponent />
                    </div>
                  </div>
                  <span className="mt-4 text-md font-semibold text-gray-600">
                    {event.title.split(' ')[0]}
                  </span>
                  <span className="font-semibold text-sm text-gray-400 whitespace-nowrap">
                    {event.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e0; }
        `}
      </style>
    </div>
  );
}