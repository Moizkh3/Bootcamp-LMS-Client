import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X, Download } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Select from '../../../components/common/Select';
import { useGetAllBootcampsQuery, useGetBootcampByIdQuery } from '../../../features/bootcamp/bootcampApi';
import { useGetAllDomainsQuery } from '../../../features/domain/domainApi';
import { useBulkRegisterMutation } from '../../../features/auth/authServiceApi';
import { toast } from 'react-hot-toast';

const BulkUploadModal = ({ isOpen, onClose, bootcampId: initialBootcampId }) => {
    const [file, setFile] = useState(null);
    const [bootcampId, setBootcampId] = useState(initialBootcampId || '');
    const [domainId, setDomainId] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const { data: bootcampsResponse } = useGetAllBootcampsQuery({});
    const { data: domainsResponse } = useGetAllDomainsQuery({ skip: !!bootcampId });
    const { data: bootcampDataResponse } = useGetBootcampByIdQuery(bootcampId || '', { skip: !bootcampId });
    const [bulkRegister] = useBulkRegisterMutation();

    const bootcamps = bootcampsResponse?.data || [];
    const allDomains = domainsResponse?.data || [];
    
    const relevantDomains = bootcampId ? (bootcampDataResponse?.data?.domains || []) : allDomains;

    React.useEffect(() => {
        if (isOpen) {
            setBootcampId(initialBootcampId || '');
            setDomainId('');
        }
    }, [isOpen, initialBootcampId]);

    React.useEffect(() => {
        if (relevantDomains.length === 1 && !domainId) {
            setDomainId(relevantDomains[0]._id);
        }
    }, [relevantDomains, domainId]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            const validTypes = [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ];
            if (!validTypes.includes(selected.type) && !selected.name.match(/\.(csv|xlsx|xls)$/i)) {
                toast.error('Please upload a valid CSV or Excel file');
                return;
            }
            setFile(selected);
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return toast.error('Please select a file');
        if (!bootcampId) return toast.error('Please select a bootcamp');
        if (!domainId) return toast.error('Please select a domain');

        setStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bootcampId', bootcampId);
        formData.append('domainId', domainId);

        try {
            const result = await bulkRegister(formData).unwrap();
            setStatus('success');
            toast.success(result.message || 'Students registered successfully!');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            setStatus('error');
            const msg = err?.data?.message || 'Upload failed. Please try again.';
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    const handleClose = () => {
        setFile(null);
        setBootcampId(initialBootcampId || '');
        setDomainId('');
        setStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    // Generate a sample CSV template for download
    const downloadTemplate = () => {
        const csv = 'name,email\nJohn Doe,john@example.com\nJane Smith,jane@example.com';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Bulk Upload Students"
            icon={<UploadCloud size={20} />}
            size="md"
        >
            <div className="p-6 space-y-5">

                {/* File Drop Area */}
                <div
                    className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-alt)] transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-14 h-14 bg-[var(--color-surface-alt)] rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        {file
                            ? <CheckCircle2 size={28} className="text-green-500" />
                            : <FileText size={28} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                        }
                    </div>
                    {file ? (
                        <>
                            <h3 className="text-base font-bold text-[var(--color-text-main)]">{file.name}</h3>
                            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Click to change file</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-base font-bold text-[var(--color-text-main)]">Drop your CSV / Excel file here</h3>
                            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 max-w-[220px]">
                                Supports .csv, .xlsx, .xls (Max 10MB)
                            </p>
                            <button
                                type="button"
                                className="mt-5 px-4 py-2 bg-white border border-[var(--color-border)] text-[var(--color-text-main)] font-bold rounded-xl hover:bg-[var(--color-surface-alt)] transition-all shadow-sm text-xs active:scale-95"
                            >
                                Browse Files
                            </button>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Download Template */}
                <button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] font-semibold hover:underline"
                >
                    <Download size={13} /> Download CSV Template
                </button>

                {/* Bootcamp & Domain Selects */}
                <div className={`grid grid-cols-1 ${!initialBootcampId && relevantDomains.length !== 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
                    {!initialBootcampId && (
                        <Select
                            label="Bootcamp"
                            placeholder="Select bootcamp"
                            value={bootcampId}
                            onChange={(e) => setBootcampId(e.target.value)}
                            options={bootcamps.map(bc => ({ value: bc._id, label: bc.name }))}
                        />
                    )}
                    {relevantDomains.length !== 1 && (
                        <Select
                            label="Domain"
                            placeholder="Select domain"
                            value={domainId}
                            onChange={(e) => setDomainId(e.target.value)}
                            options={relevantDomains.map(d => ({ value: d._id, label: d.name }))}
                        />
                    )}
                </div>

                {/* Info / Status */}
                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Students registered! Welcome emails with credentials are being sent.
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm font-medium">
                        <AlertCircle size={16} />
                        {errorMessage}
                    </div>
                )}

                {/* Info Note */}
                <div className="flex items-start gap-2 text-[11px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface-alt)] rounded-lg p-3">
                    <CheckCircle2 size={14} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    Each student will receive a welcome email with their login credentials to access the platform.
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 mt-2">
                    <Button variant="secondary" onClick={handleClose} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!file || !bootcampId || !domainId || status === 'uploading' || status === 'success'}
                        isLoading={status === 'uploading'}
                        className="px-6"
                    >
                        {status === 'success' ? 'Uploaded ✓' : 'Upload & Register'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BulkUploadModal;
