import React from "react";
import {
  BoltIcon,
  FireIcon,
  MoonIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

export default function C3() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Wearable Devices</h1>

      {/* Connected Device */}
      <div className="p-5 bg-white rounded-xl shadow border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Garmin Fenix 7
            </h2>
            <p className="text-sm text-green-600 font-medium">● Connected</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Connect New Device
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow border flex flex-col items-center">
          <BoltIcon className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">10,034</p>
          <p className="text-gray-500 text-sm">Steps</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border flex flex-col items-center">
          <ClockIcon className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">48</p>
          <p className="text-gray-500 text-sm">Active Minutes</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border flex flex-col items-center">
          <FireIcon className="w-6 h-6 text-orange-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">509</p>
          <p className="text-gray-500 text-sm">Calories Burned</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow border flex flex-col items-center">
          <MoonIcon className="w-6 h-6 text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-gray-800">7.6</p>
          <p className="text-gray-500 text-sm">Sleep</p>
        </div>
      </div>

      {/* Steps Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Miles, Minutes, Hours */}
        <div className="p-5 bg-white rounded-xl shadow border space-y-4">
          <h3 className="font-semibold text-gray-800">Steps</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <MapPinIcon className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
              <p className="text-lg font-bold">9</p>
              <p className="text-gray-500 text-sm">Miles</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ClockIcon className="w-6 h-6 mx-auto text-green-500 mb-1" />
              <p className="text-lg font-bold">0</p>
              <p className="text-gray-500 text-sm">Minutes</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <MoonIcon className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
              <p className="text-lg font-bold">0</p>
              <p className="text-gray-500 text-sm">Hours</p>
            </div>
          </div>
        </div>

        {/* Weekly Graph */}
        <div className="p-5 bg-white rounded-xl shadow border">
          <h3 className="font-semibold text-gray-800 mb-3">Weekly Activity</h3>
          <div className="h-32 flex items-end space-x-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="w-4 bg-blue-400 rounded"
                  style={{ height: `${40 + i * 5}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
