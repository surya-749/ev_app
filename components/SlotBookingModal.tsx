'use client';

import React, { useState } from 'react';
import { EVStation, EVVehicle, ChargerPort, Reservation } from '../types/ev';
import confetti from 'canvas-confetti';
import { Zap, Clock, CheckCircle2, X, QrCode, ArrowRight } from 'lucide-react';

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: EVStation | null;
  selectedPort?: ChargerPort;
  vehicle?: EVVehicle;
  initialStartSoC?: number;
  initialTargetSoC?: number;
  onConfirmBooking: (newReservation: Reservation) => void;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  isOpen,
  onClose,
  station,
  selectedPort,
  vehicle,
  initialStartSoC = 20,
  initialTargetSoC = 80,
  onConfirmBooking
}) => {
  const [slotDate, setSlotDate] = useState<string>('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('14:15 - 14:50');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  if (!isOpen || !station) return null;

  const portToUse = selectedPort || station.ports[0];
  const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Tesla Model Y';
  const batteryCap = vehicle ? vehicle.batteryCapacityKwh : 75;
  const energyKwh = Number((((initialTargetSoC - initialStartSoC) / 100) * batteryCap).toFixed(1));

  const totalCost = Number((energyKwh * station.currentTariff).toFixed(2));
  const standardCost = Number((energyKwh * 0.42).toFixed(2));
  const savings = Math.max(0, Number((standardCost - totalCost).toFixed(2)));

  const timeSlots = [
    '11:00 - 11:35 (☀️ Solar Peak Slot)',
    '12:15 - 12:50 (☀️ Off-Peak Rate)',
    '13:30 - 14:05 (☀️ Off-Peak Rate)',
    '14:15 - 14:50 (⚡ Fast Charger)',
    '15:00 - 15:35',
    '16:30 - 17:05 (Moderate Load)',
    '20:00 - 20:35 (🌙 Night Rate)'
  ];

  const handleCompleteBooking = () => {
    const resId = `EV-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrSeed = `EV-${station.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRes: Reservation = {
      id: resId,
      stationId: station.id,
      stationName: station.name,
      locationName: station.locationName,
      portId: portToUse.id,
      portType: portToUse.type,
      chargingPowerKw: portToUse.maxPowerKw,
      vehicleName,
      startBatteryPercent: initialStartSoC,
      targetBatteryPercent: initialTargetSoC,
      slotDate,
      slotTime: selectedTimeSlot.split(' ')[0] + ' ' + selectedTimeSlot.split(' ')[1] + ' ' + selectedTimeSlot.split(' ')[2],
      durationMins: 35,
      energyKwh,
      totalCost,
      savingsAmount: savings,
      status: 'confirmed',
      qrToken: qrSeed,
      createdAt: 'Just now'
    };

    setConfirmedReservation(newRes);
    setBookingConfirmed(true);
    onConfirmBooking(newRes);

    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleCloseModal = () => {
    setBookingConfirmed(false);
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-black p-6 shadow-2xl space-y-5 overflow-hidden text-black">
        
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-black hover:bg-neutral-100 p-2 rounded-full border border-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>

        {!bookingConfirmed ? (
          <>
            <div>
              <span className="inline-flex items-center gap-1 text-black font-black text-xs uppercase tracking-widest bg-neutral-100 border border-neutral-300 px-3 py-0.5 rounded-full mb-1">
                <Zap className="h-3.5 w-3.5" /> Slot Pass Booking
              </span>
              <h3 className="text-2xl font-black text-black leading-tight mt-1">{station.name}</h3>
              <p className="text-xs text-neutral-600">{station.address}</p>
            </div>

            {/* Assigned Plug */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <div>
                <p className="text-neutral-500 font-bold uppercase text-[10px]">Assigned Plug Port:</p>
                <p className="font-bold text-black text-sm mt-0.5">
                  Port #{portToUse.portNumber} — {portToUse.type.replace('_', ' ')} ({portToUse.maxPowerKw}kW)
                </p>
              </div>
              <span className="bg-black text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase">
                RESERVED
              </span>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Select 35-min Charging Time Slot:
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                {timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                      selectedTimeSlot === slot
                        ? 'bg-black text-white border-black shadow-md'
                        : 'bg-white border-neutral-200 text-black hover:border-black'
                    }`}
                  >
                    <span>{slot}</span>
                    {selectedTimeSlot === slot && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Vehicle Model:</span>
                <span className="text-black font-bold">{vehicleName}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Target Energy:</span>
                <span className="text-black font-bold">{initialStartSoC}% → {initialTargetSoC}% ({energyKwh} kWh)</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-black text-black text-sm uppercase">Total Price:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-black font-mono">${totalCost}</span>
                  {savings > 0 && (
                    <p className="text-[10px] font-bold text-black">Save ${savings} (Off-Peak)</p>
                  )}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleCompleteBooking}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all"
            >
              Generate Digital Slot Pass
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </>
        ) : (
          /* High Contrast Digital Pass Card */
          <div className="text-center space-y-5 py-2">
            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center mx-auto border-2 border-black">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-black">Charging Pass Generated!</h3>
              <p className="text-xs text-neutral-600 mt-1">Show this QR pass at the charging hub terminal.</p>
            </div>

            {/* QR Pass Box */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-3 font-mono">
                <span className="font-black text-black">{confirmedReservation?.id}</span>
                <span className="bg-black text-white font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                  ACTIVE PASS
                </span>
              </div>

              {/* QR Code Container */}
              <div className="bg-neutral-100 p-4 rounded-xl inline-block border border-neutral-300 mx-auto my-1">
                <QrCode className="h-28 w-28 text-black" />
              </div>

              <div className="text-xs space-y-1 text-left bg-neutral-50 p-3 rounded-xl border border-neutral-200 font-mono">
                <p className="font-black text-black">{confirmedReservation?.stationName}</p>
                <p className="text-neutral-600">{confirmedReservation?.locationName}</p>
                <p className="font-bold text-black mt-1">Time: {confirmedReservation?.slotTime} ({confirmedReservation?.slotDate})</p>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full rounded-xl bg-black text-white hover:bg-neutral-800 py-3 text-xs font-black uppercase tracking-wider transition-all"
            >
              Done & View Passes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
