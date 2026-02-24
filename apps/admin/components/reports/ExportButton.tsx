'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react';

interface ExportRow {
    inquiryId?: string;
    inquiryDate?: string;
    studentName?: string;
    currentClass?: string;
    currentSchool?: string;
    board?: string;
    parentName?: string;
    phone?: string;
    secondaryPhone?: string;
    email?: string;
    occupation?: string;
    educationGuide?: string;
    learningMethod?: string;
    teacherPreference?: string;
    childImportance?: string;
    schoolEnvironment?: string;
    dayScholarHostel?: string;
    howHeard?: string;
    source?: string;
    status?: string;
    assignedTo?: string;
    priority?: string;
    followUpDate?: string | null;
    notes?: string;
}

interface ExportButtonProps {
    data: ExportRow[];
    filename?: string;
}

function flattenInquiry(row: ExportRow) {
    return {
        'Inquiry ID': row.inquiryId ?? '',
        'Date': row.inquiryDate ? new Date(row.inquiryDate).toLocaleDateString() : '',
        'Student Name': row.studentName ?? '',
        'Current Class': row.currentClass ?? '',
        'Current School': row.currentSchool ?? '',
        'Board': row.board ?? '',
        'Parent Name': row.parentName ?? '',
        'Phone': row.phone ?? '',
        'Secondary Phone': row.secondaryPhone ?? '',
        'Email': row.email ?? '',
        'Occupation': row.occupation ?? '',
        'Day Scholar/Hostel': row.dayScholarHostel ?? '',
        'How Heard': row.howHeard ?? '',
        'Source': row.source ?? '',
        'Status': row.status ?? '',
        'Assigned To': row.assignedTo ?? '',
        'Priority': row.priority ?? '',
        'Follow-up Date': row.followUpDate ? new Date(row.followUpDate).toLocaleDateString() : '',
        'Notes': row.notes ?? '',
        'Q1 - Education Guide': row.educationGuide ?? '',
        'Q2 - Learning Method': row.learningMethod ?? '',
        'Q3 - Teacher Preference': row.teacherPreference ?? '',
        'Q4 - Child Importance': row.childImportance ?? '',
        'Q5 - School Environment': row.schoolEnvironment ?? '',
    };
}

export function ExportButton({ data, filename = 'Anushtan_Inquiries' }: ExportButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<'excel' | 'pdf' | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Excel Export ───────────────────────────────────────────────────────────
    const exportExcel = async () => {
        setLoading('excel');
        setOpen(false);
        try {
            const xlsxModule = await import('xlsx');
            const XLSX = xlsxModule.default || xlsxModule;
            const rows = data.map(flattenInquiry);
            const ws = XLSX.utils.json_to_sheet(rows);

            // Bold header row
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
            for (let c = range.s.c; c <= range.e.c; c++) {
                const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
                if (cell) cell.s = { font: { bold: true } };
            }

            // Auto column widths
            ws['!cols'] = Object.keys(rows[0] || {}).map(k => ({
                wch: Math.max(k.length, ...rows.map(r => String((r as any)[k] || '').length)) + 2,
            }));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Inquiries');
            XLSX.writeFile(wb, `${filename}_${today()}.xlsx`);
        } finally {
            setLoading(null);
        }
    };

    // ── PDF Export ─────────────────────────────────────────────────────────────
    const exportPDF = async () => {
        setLoading('pdf');
        setOpen(false);
        try {
            const jspdfModule = await import('jspdf');
            const jsPDF = jspdfModule.default || (jspdfModule as any).jsPDF || (jspdfModule as any);

            const autoTableModule = await import('jspdf-autotable');
            const autoTable = autoTableModule.default || autoTableModule;

            // Type assertion to ensure it's treated as a constructor
            const DocClass = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF;
            const doc = new DocClass({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            // Title
            doc.setFontSize(16);
            doc.setTextColor(40, 40, 40);
            doc.text('Anushtan School — Inquiry Report', 14, 16);
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text(`Generated: ${new Date().toLocaleString()}  |  Total: ${data.length} inquiries`, 14, 22);

            // Core columns (PDF is narrower — pick the most important ones)
            const columns = [
                { header: 'ID', dataKey: 'Inquiry ID' },
                { header: 'Date', dataKey: 'Date' },
                { header: 'Student', dataKey: 'Student Name' },
                { header: 'Class', dataKey: 'Current Class' },
                { header: 'Parent', dataKey: 'Parent Name' },
                { header: 'Phone', dataKey: 'Phone' },
                { header: 'Status', dataKey: 'Status' },
                { header: 'Assigned To', dataKey: 'Assigned To' },
                { header: 'Priority', dataKey: 'Priority' },
                { header: 'Source', dataKey: 'Source' },
                { header: 'How Heard', dataKey: 'How Heard' },
                { header: 'DS / Hostel', dataKey: 'Day Scholar/Hostel' },
            ];

            const rows = data.map(flattenInquiry);

            autoTable(doc, {
                columns,
                body: rows,
                startY: 27,
                styles: { fontSize: 7, cellPadding: 2 },
                headStyles: { fillColor: [99, 75, 55], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 244, 240] },
                columnStyles: {
                    0: { cellWidth: 14 },  // ID
                    1: { cellWidth: 18 },  // Date
                    2: { cellWidth: 28 },  // Student
                    3: { cellWidth: 12 },  // Class
                    4: { cellWidth: 26 },  // Parent
                    5: { cellWidth: 24 },  // Phone
                    6: { cellWidth: 18 },  // Status
                    7: { cellWidth: 24 },  // Assigned To
                    8: { cellWidth: 14 },  // Priority
                    9: { cellWidth: 18 },  // Source
                    10: { cellWidth: 20 },  // How Heard
                    11: { cellWidth: 18 },  // DS/Hostel
                },
                margin: { left: 10, right: 10 },
                didDrawPage: (hookData) => {
                    // Footer
                    const pageCount = doc.getNumberOfPages();
                    doc.setFontSize(7);
                    doc.setTextColor(160);
                    doc.text(
                        `Page ${hookData.pageNumber} of ${pageCount}`,
                        doc.internal.pageSize.getWidth() / 2,
                        doc.internal.pageSize.getHeight() - 5,
                        { align: 'center' }
                    );
                },
            });

            doc.save(`${filename}_${today()}.pdf`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                disabled={!!loading || data.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-admin-border rounded-lg text-admin-text hover:bg-gray-50 active:scale-95 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed select-none"
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Download size={16} />
                )}
                <span className="font-medium text-sm">
                    {loading === 'excel' ? 'Exporting Excel…'
                        : loading === 'pdf' ? 'Exporting PDF…'
                            : 'Export'}
                </span>
                {!loading && <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
            </button>

            {open && !loading && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-admin-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 text-xs text-admin-text-secondary font-semibold uppercase tracking-wider border-b border-admin-border">
                        Export {data.length} Inquiries
                    </div>
                    <button
                        onClick={exportExcel}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-admin-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                        <FileSpreadsheet size={18} className="text-emerald-600 flex-shrink-0" />
                        <div className="text-left">
                            <div className="font-medium">Excel (.xlsx)</div>
                            <div className="text-xs text-admin-text-secondary">All columns, full data</div>
                        </div>
                    </button>
                    <button
                        onClick={exportPDF}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-admin-text hover:bg-rose-50 hover:text-rose-700 transition-colors border-t border-admin-border"
                    >
                        <FileText size={18} className="text-rose-600 flex-shrink-0" />
                        <div className="text-left">
                            <div className="font-medium">PDF Report (.pdf)</div>
                            <div className="text-xs text-admin-text-secondary">Formatted A4 landscape</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

function today() {
    return new Date().toISOString().split('T')[0];
}
