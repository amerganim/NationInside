"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QrBlock({ value, size = 220 }: { value: string; size?: number }) {
  return (
    <div className="bg-white p-4 rounded-xl inline-block">
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}
