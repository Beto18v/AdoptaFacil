import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

interface DonationData {
    amount: number;
    created_at: string;
    description?: string;
}

interface RawRowData {
    [key: string]: unknown;
}

interface ColumnMapping {
    amount: string | null;
    created_at: string | null;
    description: string | null;
}

interface ExcelImportComponentProps {
    onImportSuccess: () => void;
}

export function ExcelImportComponent({ onImportSuccess }: ExcelImportComponentProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
    const [rawData, setRawData] = useState<RawRowData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
        amount: null,
        created_at: null,
        description: null,
    });
    const [previewData, setPreviewData] = useState<DonationData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showImport, setShowImport] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    setError('El archivo debe tener al menos una fila de datos además del encabezado');
                    return;
                }

                const headers = jsonData[0] as string[];
                const rows = (jsonData.slice(1) as unknown[][]).map((row) => {
                    const obj: RawRowData = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                setColumns(headers);
                setRawData(rows);
                setStep('mapping');
                setError(null);
            } catch {
                setError('Error al leer el archivo. Asegúrate de que sea un archivo Excel válido.');
            }
        };
        reader.readAsBinaryString(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    const handleMappingComplete = () => {
        if (!columnMapping.amount || !columnMapping.created_at) {
            setError('Debes mapear al menos las columnas de Monto y Fecha');
            return;
        }

        try {
            const mappedData: DonationData[] = rawData
                .map((row, index) => {
                    const amount = parseFloat(String(row[columnMapping.amount!] || '0'));
                    if (isNaN(amount) || amount <= 0) {
                        throw new Error(`Monto inválido en la fila ${index + 2}: ${row[columnMapping.amount!]}`);
                    }

                    const date = row[columnMapping.created_at!];
                    let dateString: string;

                    if (typeof date === 'number') {
                        // Fecha de Excel (número serial) - formatear directamente para evitar problemas de zona horaria
                        const excelDate = XLSX.SSF.parse_date_code(date);
                        dateString = `${excelDate.y.toString().padStart(4, '0')}-${excelDate.m.toString().padStart(2, '0')}-${excelDate.d.toString().padStart(2, '0')}`;
                    } else if (typeof date === 'string') {
                        // Para fechas string, intentar parsear y formatear como YYYY-MM-DD
                        const parsed = new Date(date);
                        if (isNaN(parsed.getTime())) {
                            throw new Error(`Fecha inválida en la fila ${index + 2}: ${date}`);
                        }
                        // Usar UTC para evitar cambios de día por zona horaria
                        const year = parsed.getUTCFullYear();
                        const month = (parsed.getUTCMonth() + 1).toString().padStart(2, '0');
                        const day = parsed.getUTCDate().toString().padStart(2, '0');
                        dateString = `${year}-${month}-${day}`;
                    } else {
                        throw new Error(`Fecha inválida en la fila ${index + 2}: ${date}`);
                    }

                    return {
                        amount,
                        created_at: dateString,
                        description: columnMapping.description ? String(row[columnMapping.description] || '').trim() : undefined,
                    };
                })
                .filter((item) => item.amount > 0);

            setPreviewData(mappedData);
            setStep('preview');
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al procesar los datos');
        }
    };

    const handleEditPreviewData = (index: number, field: keyof DonationData, value: string | number) => {
        setPreviewData((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };

    const handleRemoveRow = (index: number) => {
        setPreviewData((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImport = async () => {
        if (previewData.length === 0) {
            setError('No hay datos para importar');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/donaciones/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'include',
                body: JSON.stringify({ donations: previewData }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al importar donaciones');
            }

            onImportSuccess();
            resetImport();
            setShowImport(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al importar donaciones');
        } finally {
            setIsLoading(false);
        }
    };

    const resetImport = () => {
        setStep('upload');
        setRawData([]);
        setColumns([]);
        setColumnMapping({ amount: null, created_at: null, description: null });
        setPreviewData([]);
        setError(null);
        setIsLoading(false);
    };

    if (!showImport) {
        return (
            <button
                onClick={() => setShowImport(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                📁 Importar Excel
            </button>
        );
    }

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800">
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📁 Importar Donaciones desde Excel</h2>
                        <button
                            onClick={() => {
                                setShowImport(false);
                                resetImport();
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {step === 'upload' && (
                        <div className="space-y-4">
                            <div
                                {...getRootProps()}
                                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                    isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <input {...getInputProps()} />
                                <div className="mb-4 text-6xl">📄</div>
                                {isDragActive ? (
                                    <p className="text-lg">Suelta el archivo aquí...</p>
                                ) : (
                                    <div>
                                        <p className="text-lg font-medium">Selecciona o arrastra un archivo Excel</p>
                                        <p className="mt-2 text-sm text-gray-500">Formatos soportados: .xlsx, .xls, .csv</p>
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-medium">Formato esperado:</p>
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                    <li>
                                        <strong>Monto:</strong> Valor numérico (requerido)
                                    </li>
                                    <li>
                                        <strong>Fecha:</strong> Fecha de la donación (requerido)
                                    </li>
                                    <li>
                                        <strong>Descripción:</strong> Descripción de la donación (opcional)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 'mapping' && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-3 text-lg font-medium">Mapear Columnas</h3>
                                <p className="mb-4 text-sm text-gray-600">Relaciona las columnas de tu archivo con los campos requeridos</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Monto <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={columnMapping.amount || ''}
                                        onChange={(e) => setColumnMapping((prev) => ({ ...prev, amount: e.target.value || null }))}
                                        className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Seleccionar columna</option>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>
                                                {col}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Fecha <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={columnMapping.created_at || ''}
                                        onChange={(e) => setColumnMapping((prev) => ({ ...prev, created_at: e.target.value || null }))}
                                        className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Seleccionar columna</option>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>
                                                {col}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descripción (opcional)</label>
                                    <select
                                        value={columnMapping.description || ''}
                                        onChange={(e) => setColumnMapping((prev) => ({ ...prev, description: e.target.value || null }))}
                                        className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <option value="">Sin mapear</option>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>
                                                {col}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="mb-2 text-sm font-medium">Vista previa de datos (primeras 3 filas):</h4>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                {columns.map((col) => (
                                                    <th key={col} className="px-3 py-2 text-left font-medium">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawData.slice(0, 3).map((row, index) => (
                                                <tr key={index} className="border-t">
                                                    {columns.map((col) => (
                                                        <td key={col} className="px-3 py-2">
                                                            {String(row[col] || '')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => setStep('upload')} className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
                                    Volver
                                </button>
                                <button onClick={handleMappingComplete} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Vista Previa y Edición</h3>
                                <div className="text-sm text-gray-600">{previewData.length} donaciones para importar</div>
                            </div>

                            <div className="overflow-hidden rounded-lg border">
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-medium">Monto</th>
                                                <th className="px-3 py-2 text-left font-medium">Fecha</th>
                                                <th className="px-3 py-2 text-left font-medium">Descripción</th>
                                                <th className="px-3 py-2 text-center font-medium">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            value={item.amount}
                                                            onChange={(e) => handleEditPreviewData(index, 'amount', parseFloat(e.target.value) || 0)}
                                                            className="w-full rounded border p-1"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="date"
                                                            value={item.created_at}
                                                            onChange={(e) => handleEditPreviewData(index, 'created_at', e.target.value)}
                                                            className="w-full rounded border p-1"
                                                        />
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {new Date(item.created_at + 'T12:00:00').toLocaleDateString('es-CO', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <textarea
                                                            value={item.description || ''}
                                                            onChange={(e) => handleEditPreviewData(index, 'description', e.target.value)}
                                                            className="w-full resize-none rounded border p-1"
                                                            rows={2}
                                                            placeholder="Descripción opcional..."
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <button
                                                            onClick={() => handleRemoveRow(index)}
                                                            className="text-lg text-red-600 hover:text-red-800"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => setStep('mapping')} className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
                                    Volver
                                </button>
                                <button
                                    onClick={handleImport}
                                    disabled={isLoading || previewData.length === 0}
                                    className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isLoading ? '⏳ Importando...' : `✅ Importar ${previewData.length} donaciones`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
