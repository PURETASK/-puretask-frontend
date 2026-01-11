'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
export function ServiceSelection() {
  const [selectedService, setSelectedService] = useState('standard');
  const [hours, setHours] = useState(3);
  const [addOns, setAddOns] = useState<string[]>([]);
  const services = [
    { id: 'standard', name: 'Standard Cleaning', price: 45, description: 'Regular cleaning and tidying' },
    { id: 'deep', name: 'Deep Cleaning', price: 65, description: 'Thorough top-to-bottom clean' },
    { id: 'move', name: 'Move In/Out', price: 75, description: 'Complete move preparation' },
  ];
  const availableAddOns = [
    { id: 'fridge', name: 'Inside Fridge', price: 20 },
    { id: 'oven', name: 'Inside Oven', price: 25 },
    { id: 'windows', name: 'Windows', price: 30 },
    { id: 'laundry', name: 'Laundry', price: 15 },
  ];
  const selectedServiceData = services.find(s => s.id === selectedService);
  const basePrice = selectedServiceData ? selectedServiceData.price * hours : 0;
  const addOnsPrice = addOns.reduce((total, addOnId) => {
    const addOn = availableAddOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = basePrice + addOnsPrice;
  return (
    <div className="space-y-6">
      {/* Service Type */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Select Service
        </label>
        <div className="space-y-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                selectedService === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ${service.price}/hr
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Hours */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Duration: {hours} hours
        </label>
        <input
          type="range"
          min="2"
          max="8"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>2 hours</span>
          <span>8 hours</span>
        </div>
      </div>
      {/* Add-ons */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Add-ons (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {availableAddOns.map((addOn) => (
            <label
              key={addOn.id}
              className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              <input
                type="checkbox"
                checked={addOns.includes(addOn.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAddOns([...addOns, addOn.id]);
                  } else {
                    setAddOns(addOns.filter(id => id !== addOn.id));
                  }
                }}
                className="rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{addOn.name}</div>
                <div className="text-sm text-gray-600">+${addOn.price}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Price Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Base ({hours} hours × ${selectedServiceData?.price})</span>
              <span>${basePrice}</span>
            </div>
            {addOns.length > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Add-ons</span>
                <span>${addOnsPrice}</span>
              </div>
            )}
            <div className="border-t border-blue-300 pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
