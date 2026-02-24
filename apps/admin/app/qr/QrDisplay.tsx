'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink } from 'lucide-react';

interface QrDisplayProps {
    url: string;
}

export function QrDisplay({ url }: QrDisplayProps) {
    const svgRef = useRef<HTMLDivElement>(null);

    const downloadPNG = () => {
        const svg = svgRef.current?.querySelector('svg');
        if (!svg) return;

        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(blobUrl);
            const link = document.createElement('a');
            link.download = 'anushtan-admission-qr.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = blobUrl;
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* QR Code */}
            <div
                ref={svgRef}
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
                <QRCodeSVG
                    value={url}
                    size={256}
                    level="H"
                    includeMargin
                    imageSettings={{
                        src: '',
                        excavate: false,
                        width: 0,
                        height: 0,
                    }}
                />
            </div>

            {/* URL display */}
            <div className="text-center">
                <p className="text-sm text-admin-text-secondary mb-1">Scans will open:</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                    {url}
                    <ExternalLink size={13} />
                </a>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={downloadPNG}
                    className="flex items-center gap-2 px-5 py-2.5 bg-admin-purple text-white rounded-xl font-medium text-sm hover:opacity-90 active:scale-95 transition shadow-md"
                >
                    <Download size={16} />
                    Download PNG
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-admin-border text-admin-text rounded-xl font-medium text-sm hover:bg-gray-50 active:scale-95 transition"
                >
                    🖨 Print
                </button>
            </div>

            {/* Instructions */}
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 max-w-sm text-left">
                <p className="font-semibold mb-1">How to use</p>
                <ul className="space-y-1 list-disc list-inside text-amber-700">
                    <li>Print and place at reception, events, or notice boards</li>
                    <li>Parents scan with phone camera</li>
                    <li>Mobile-optimized form opens instantly</li>
                    <li>Counselors get notified within seconds</li>
                </ul>
            </div>
        </div>
    );
}
