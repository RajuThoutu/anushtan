'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ExternalLink, Printer } from 'lucide-react';

interface QrDisplayProps {
    url: string;
}

/** Access code shown to counselors: ddmm in IST */
function todayCode(): string {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const dd = String(ist.getUTCDate()).padStart(2, '0');
    const mm = String(ist.getUTCMonth() + 1).padStart(2, '0');
    return `${dd}${mm}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function QrDisplay({ url }: QrDisplayProps) {
    const svgRef = useRef<HTMLDivElement>(null);
    const code = todayCode();

    const downloadPNG = async () => {
        const svgEl = svgRef.current?.querySelector('svg');
        if (!svgEl) return;

        // ── Canvas dimensions ───────────────────────────────────────────────
        const W = 800;
        const H = 1080;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // ── Background ──────────────────────────────────────────────────────
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        // ── Top gradient header ─────────────────────────────────────────────
        const headerH = 260;
        const grad = ctx.createLinearGradient(0, 0, W, headerH);
        grad.addColorStop(0, '#d97706');   // amber-600
        grad.addColorStop(1, '#ea580c');   // orange-600
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(W, 0);
        ctx.lineTo(W, headerH - 40);
        ctx.quadraticCurveTo(W / 2, headerH + 20, 0, headerH - 40);
        ctx.closePath();
        ctx.fill();

        // ── Logo circle ─────────────────────────────────────────────────────
        const logoSize = 80;
        const logoX = W / 2 - logoSize / 2;
        const logoY = 38;
        try {
            const logoImg = await loadImage('/logo.jpg');
            ctx.save();
            ctx.beginPath();
            ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();
            // White ring around logo
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2 + 2, 0, Math.PI * 2);
            ctx.stroke();
        } catch {
            // Fallback: draw "A" initial
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath();
            ctx.arc(W / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', W / 2, logoY + logoSize / 2);
        }

        // ── School name ─────────────────────────────────────────────────────
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 32px Georgia, serif';
        ctx.fillText('Anushtan Indic School', W / 2, logoY + logoSize + 16);

        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText('Ancient Roots, Global Minds', W / 2, logoY + logoSize + 58);

        ctx.font = '13px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('Siddipet, Telangana', W / 2, logoY + logoSize + 82);

        // ── QR section label ────────────────────────────────────────────────
        ctx.fillStyle = '#92400e';   // amber-800
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('SCAN TO APPLY FOR ADMISSION', W / 2, headerH + 28);

        // ── QR code ─────────────────────────────────────────────────────────
        const qrSize = 380;
        const qrX = (W - qrSize) / 2;
        const qrY = headerH + 60;

        // White card behind QR
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;
        const padding = 20;
        ctx.beginPath();
        ctx.roundRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2, 16);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Draw border
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2, 16);
        ctx.stroke();

        // Render QR SVG onto canvas
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const qrBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const qrBlobUrl = URL.createObjectURL(qrBlob);
        try {
            const qrImg = await loadImage(qrBlobUrl);
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        } finally {
            URL.revokeObjectURL(qrBlobUrl);
        }

        // ── URL below QR ────────────────────────────────────────────────────
        const belowQr = qrY + qrSize + padding + 24;
        ctx.fillStyle = '#6b7280';
        ctx.font = '13px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(url, W / 2, belowQr);

        // ── Divider ─────────────────────────────────────────────────────────
        const divY = belowQr + 40;
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, divY);
        ctx.lineTo(W - 60, divY);
        ctx.stroke();

        // ── Footer ──────────────────────────────────────────────────────────
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Fill the form and a counselor will call you within 24 hours', W / 2, divY + 16);
        ctx.fillText('anushtansiddipet.in  ·  Siddipet, Telangana 502103', W / 2, divY + 36);

        // ── Bottom accent bar ────────────────────────────────────────────────
        const bottomGrad = ctx.createLinearGradient(0, H - 8, W, H);
        bottomGrad.addColorStop(0, '#d97706');
        bottomGrad.addColorStop(1, '#ea580c');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, H - 8, W, 8);

        // ── Download ─────────────────────────────────────────────────────────
        const link = document.createElement('a');
        link.download = 'anushtan-admission-qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Branded preview card */}
            <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 pt-6 pb-10 text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.jpg" alt="Anushtan Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-lg font-bold font-heading">Anushtan Indic School</h2>
                    <p className="text-xs text-white/75 mt-0.5">Ancient Roots, Global Minds · Siddipet</p>
                </div>

                {/* QR */}
                <div className="bg-white px-6 -mt-6 pb-5">
                    <p className="text-center text-[11px] font-semibold text-amber-700 tracking-widest uppercase mb-4 pt-2">
                        Scan to Apply for Admission
                    </p>
                    <div
                        ref={svgRef}
                        className="flex justify-center"
                    >
                        <QRCodeSVG
                            value={url}
                            size={220}
                            level="H"
                            includeMargin
                        />
                    </div>
                    <p className="text-center text-[11px] text-gray-400 mt-3 font-mono">{url}</p>
                </div>

                {/* Footer */}
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
            </div>

            {/* URL link */}
            <div className="text-center">
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
                    <Printer size={15} />
                    Print
                </button>
            </div>

            {/* Today's access code */}
            <div className="w-full max-w-sm p-4 bg-gradient-to-r from-admin-purple/10 to-admin-rose/10 border border-admin-purple/30 rounded-xl text-center">
                <p className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-1">
                    Today's Access Code
                </p>
                <p className="text-5xl font-bold tracking-[0.3em] text-admin-charcoal">
                    {code}
                </p>
                <p className="text-xs text-admin-text-secondary mt-2">
                    Tell this code to parents at the event. Resets at midnight.
                </p>
            </div>

            {/* Instructions */}
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 max-w-sm text-left">
                <p className="font-semibold mb-1">How to use</p>
                <ul className="space-y-1 list-disc list-inside text-amber-700">
                    <li>Print and place at reception, events, or notice boards</li>
                    <li>Parents scan → enter today's code → fill form</li>
                    <li>Code changes daily (ddmm format)</li>
                    <li>Counselors get notified within seconds</li>
                </ul>
            </div>
        </div>
    );
}
