import * as React from "react";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

export function MiddleWidgets() {
  const renderTrend = (value: string, isPositive: boolean) => (
    <span className={`inline-flex items-center text-xs font-semibold ml-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {value}
      {isPositive ? <TrendingUp className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Quotation Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold text-sm mb-6">Quotation summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-500 text-xs mb-1">Quotation Sent</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">50</span>
                {renderTrend("21%", false)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Quotation Won</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">21</span>
                {renderTrend("04%", true)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Quotation Lost</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">16</span>
                {renderTrend("3%", false)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Quotation In progress</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">13</span>
                {renderTrend("6%", true)}
              </div>
            </div>
          </div>
        </div>

        {/* Container Tracking (Mock) */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-900 font-semibold text-sm">Container Tracking</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Status:</span>
              <select className="bg-transparent border-none font-medium text-gray-900 focus:outline-none focus:ring-0 cursor-pointer">
                <option>Delivered</option>
                <option>In Transit</option>
                <option>Stuck</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 flex gap-6">
            <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden relative">
              {/* Simple map placeholder - in a real app, use a map library */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain"></div>
              
              {/* Map pin dots */}
              <div className="absolute top-[40%] left-[20%] w-3 h-3 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <div className="absolute top-[45%] left-[22%] w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            
            <div className="w-64 flex flex-col gap-3">
              {/* Tracking Cards */}
              <div className="border border-indigo-200 bg-white rounded-lg p-3 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Delivered
                </div>
                <div className="text-sm font-medium text-indigo-900">Maria Jenson</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Port of Houston
                </div>
              </div>

              <div className="border border-gray-100 bg-white rounded-lg p-3 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  Stuck
                </div>
                <div className="text-sm font-medium text-gray-900">Vironica lexus</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Port of Long Beach
                </div>
              </div>

              <div className="border border-gray-100 bg-white rounded-lg p-3 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-500 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  In Transit
                </div>
                <div className="text-sm font-medium text-gray-900">Mia toreto</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  Port of New Orleans
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Shipments */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
        <h3 className="text-gray-900 font-semibold text-sm mb-6">
          Shipments <span className="text-indigo-600 font-bold">(289)</span>
        </h3>
        <div className="flex flex-col gap-3 flex-1">
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1">Delivered</div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">135</span>
              {renderTrend("11%", true)}
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1">In Transit</div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">100</span>
              {renderTrend("7%", true)}
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-xl border border-gray-100 p-4">
            <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
              Stuck
              <div className="w-3 h-3 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">i</div>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-gray-900">54</span>
              {renderTrend("6%", true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
