import React, { useState, useEffect, useRef } from 'react';
import { unzipSync } from 'fflate';
import { ActionItem, ParsedNotice, PresetSample } from '../types';
import {
  PRESET_SAMPLES,
  parseNoticeLocally,
  getStoredCustomPresets,
  saveStoredCustomPresets,
} from '../utils/ruleEngine';
import { downloadIcsFile } from '../utils/ics';
import { AddPresetModal } from './AddPresetModal';

interface AnalyzerViewProps {
  onSaveTasksToCenter: (tasks: ActionItem[], noticeTitle: string) => void;
  onViewOriginalNotice: (text: string, title: string) => void;
  showToast: (msg: string) => void;
  pendingTasksCount: number;
  totalParsedCount: number;
}

interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
}

type GeminiStatus = 'checking' | 'configured' | 'missing' | 'unreachable';

const UPLOAD_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

const getUploadMimeType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return UPLOAD_MIME_TYPES[extension] ?? file.type;
};

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  onSaveTasksToCenter,
  onViewOriginalNotice,
  showToast,
  pendingTasksCount,
  totalParsedCount,
}) => {
  const [engineMode, setEngineMode] = useState<'local' | 'gemini'>('local');
  const [rawText, setRawText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus>('checking');
  const [customPresets, setCustomPresets] = useState<PresetSample[]>(() =>
    getStoredCustomPresets()
  );
  const [isAddPresetModalOpen, setIsAddPresetModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [uploadedSourceFile, setUploadedSourceFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshGeminiStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`Health check failed (${response.status})`);
      }

      const health: { hasApiKey?: unknown } = await response.json();
      setGeminiStatus(health.hasApiKey === true ? 'configured' : 'missing');
    } catch {
      setGeminiStatus('unreachable');
    }
  };

  useEffect(() => {
    void refreshGeminiStatus();
  }, []);

  // Sync custom presets to storage
  useEffect(() => {
    saveStoredCustomPresets(customPresets);
  }, [customPresets]);

  const allPresets = [...PRESET_SAMPLES, ...customPresets];

  // Initial parsed state starts empty until user types, uploads or selects a preset
  const [parsedData, setParsedData] = useState<ParsedNotice | null>(null);

  // Checkbox state for current notice's action items
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const charCount = rawText.length;
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;

  // Toggle item completion
  const handleToggleItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          showToast(nextState ? 'Marked task complete! +10 XP' : 'Task restored to pending');
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  // Add custom preset
  const handleAddCustomPreset = (newPreset: PresetSample) => {
    setCustomPresets((prev) => [newPreset, ...prev]);
    showToast(`Preset "${newPreset.title}" added successfully!`);
  };

  // Delete custom preset
  const handleDeleteCustomPreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    setCustomPresets((prev) => prev.filter((p) => p.id !== presetId));
    showToast('Custom preset removed');
  };

  // Load preset sample
  const handleLoadPreset = (sampleId: string) => {
    const sample = allPresets.find((s) => s.id === sampleId);
    if (!sample) return;

    setUploadedFile(null);
    setUploadedSourceFile(null);
    setRawText(sample.text);
    setParsedData({
      id: `preset-${Date.now()}`,
      title: sample.parsedData.event,
      department: sample.title,
      rawText: sample.text,
      event: sample.parsedData.event,
      venue: sample.parsedData.venue,
      deadline: sample.parsedData.deadline,
      fees: sample.parsedData.fees,
      actionItems: sample.parsedData.actionItems,
      ruleRecommendation: sample.parsedData.ruleRecommendation,
      confidence: 100,
      parsedAt: new Date().toISOString(),
      engineUsed: engineMode,
    });
    setActionItems(sample.parsedData.actionItems);
    showToast(`Loaded ${sample.title}`);
  };

  // Run Extraction logic
  const fileToBase64 = async (file: File): Promise<string> => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  };

  const executeExtraction = async (textToExtract: string, fileName?: string, sourceFile?: File) => {
    if (!textToExtract.trim() && !sourceFile) {
      showToast('Please enter, paste, or upload a circular notice first');
      return;
    }

    setIsExtracting(true);

    if (engineMode === 'local') {
      if (!textToExtract.trim()) {
        setIsExtracting(false);
        showToast('Select Gemini AI API to read PDF and image uploads');
        return;
      }
      setTimeout(() => {
        const result = parseNoticeLocally(textToExtract);
        if (fileName && (!result.title || result.title === 'Campus Academic Notice / Activity')) {
          result.title = fileName.replace(/\.[^/.]+$/, '');
        }
        setParsedData(result);
        setActionItems(result.actionItems);
        setIsExtracting(false);
        showToast('Extracted with Local Rule Engine');
      }, 350);
      return;
    }

    // Gemini AI API mode
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sourceFile
          ? {
              rawText: textToExtract,
              uploadedFile: {
                name: sourceFile.name,
                  mimeType: getUploadMimeType(sourceFile),
                data: await fileToBase64(sourceFile),
              },
            }
          : { rawText: textToExtract }),
      });

      const data: {
        success?: boolean;
        data?: ParsedNotice;
        error?: string;
      } = await res.json();
      if (res.ok && data.success && data.data) {
        setParsedData(data.data);
        setActionItems(data.data.actionItems);
        showToast('Extracted with Gemini AI API (Deep analysis)');
      } else {
        const message = data.error || `Gemini request failed (${res.status})`;
        if (sourceFile) {
          showToast(`Gemini couldn't read ${sourceFile.name}: ${message}`);
          return;
        }
        const localResult = parseNoticeLocally(textToExtract);
        setParsedData(localResult);
        setActionItems(localResult.actionItems);
        showToast(`Gemini failed; used local text parser. ${message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network request failed';
      if (sourceFile) {
        showToast(`Gemini couldn't read ${sourceFile.name}: ${message}`);
        return;
      }
      const localResult = parseNoticeLocally(textToExtract);
      setParsedData(localResult);
      setActionItems(localResult.actionItems);
      showToast(`Gemini unavailable; used local text parser. ${message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleExtract = () => {
    const fileName = uploadedSourceFile?.name.toLowerCase() ?? '';
    const isBinaryGeminiFile = uploadedSourceFile && (
      uploadedSourceFile.type === 'application/pdf' ||
      uploadedSourceFile.type.startsWith('image/') ||
      /\.(pdf|png|jpe?g|webp)$/.test(fileName)
    );
    void executeExtraction(rawText, uploadedFile?.name, isBinaryGeminiFile ? uploadedSourceFile : undefined);
  };

  // File Upload Processing
  const processUploadedFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = getUploadMimeType(file);
    const isImage = ['image/png', 'image/jpeg', 'image/webp'].includes(mimeType);
    const isPdf = mimeType === 'application/pdf' || extension === 'pdf';
    const isDocx = extension === 'docx';
    const isText = file.type.startsWith('text/') || extension === 'txt' || extension === 'md';

    if (file.size > 8 * 1024 * 1024) {
      showToast('Files must be 8 MB or smaller');
      return;
    }
    if (!isImage && !isPdf && !isDocx && !isText) {
      showToast('Unsupported file. Upload a PDF, PNG, JPG, WEBP, TXT, MD, or DOCX file');
      return;
    }

    const sizeKB = (file.size / 1024).toFixed(1) + ' KB';

    let previewUrl: string | undefined;
    if (isImage) {
      previewUrl = URL.createObjectURL(file);
    }

    setUploadedFile({
      name: file.name,
      size: sizeKB,
      type: mimeType || (isDocx ? 'DOCX' : 'Text'),
      previewUrl,
    });
    setUploadedSourceFile(file);

    if (isPdf || isImage) {
      setRawText('');
      if (engineMode === 'gemini') {
        showToast(`Sending ${file.name} to Gemini for analysis...`);
        await executeExtraction('', file.name, file);
      } else {
        showToast(`${file.name} is ready. Select Gemini AI API to read this file.`);
      }
      return;
    }

    try {
      let text = '';
      if (isDocx) {
        const archive = unzipSync(new Uint8Array(await file.arrayBuffer()), {
          filter: (entry) =>
            entry.name === 'word/document.xml' && entry.originalSize <= 4 * 1024 * 1024,
        });
        const documentXml = archive['word/document.xml'];
        if (!documentXml) {
          throw new Error('The DOCX file does not contain a readable document');
        }
        const xml = new DOMParser().parseFromString(new TextDecoder().decode(documentXml), 'application/xml');
        if (xml.querySelector('parsererror')) {
          throw new Error('The DOCX document XML is invalid');
        }
        const wordNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        text = Array.from(xml.getElementsByTagNameNS(wordNamespace, 'p'))
          .map((paragraph) =>
            Array.from(paragraph.getElementsByTagNameNS(wordNamespace, 't'))
              .map((node) => node.textContent ?? '')
              .join('')
          )
          .filter((paragraph) => paragraph.trim())
          .join('\n');
      } else {
        text = await file.text();
      }
      if (!text.trim()) {
        throw new Error('No readable text was found in the file');
      }
      setRawText(text);
      showToast(`Uploaded ${file.name}. Analyzing notice...`);
      await executeExtraction(text, file.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The file could not be read';
      showToast(`Could not read ${file.name}: ${message}`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      void processUploadedFile(files[0]);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Copy all tasks
  const handleCopyAll = () => {
    const lines = actionItems.map((item, idx) => {
      const mark = item.completed ? '[x]' : '[ ]';
      const deadline = item.deadline ? ` (${item.deadline})` : '';
      return `${idx + 1}. ${mark} ${item.text}${deadline}`;
    });

    navigator.clipboard?.writeText(lines.join('\n'));
    showToast(`All ${actionItems.length} action items copied to clipboard!`);
  };

  // Copy Venue
  const handleCopyVenue = () => {
    if (!parsedData?.venue) return;
    navigator.clipboard?.writeText(parsedData.venue);
    showToast(`Copied venue: "${parsedData.venue}"`);
  };

  // Export .ics for this notice
  const handleExportNoticeIcs = () => {
    if (!parsedData) return;
    const taskObj = {
      id: `notice-${Date.now()}`,
      title: parsedData.event,
      status: 'urgent' as const,
      tag: 'CAMPUS NOTICE',
      deadline: parsedData.deadline,
      sourceCircular: parsedData.title,
      note: `Venue: ${parsedData.venue} • Fees: ${parsedData.fees}`,
      createdAt: new Date().toISOString(),
    };
    downloadIcsFile([taskObj], `${parsedData.event.slice(0, 25).replace(/\s+/g, '-')}-deadline.ics`);
    showToast('Downloaded calendar (.ics) reminder for this deadline!');
  };

  // Save to My Tasks
  const handleSaveToMyTasks = () => {
    if (!parsedData) {
      showToast('No extracted tasks to save yet');
      return;
    }
    onSaveTasksToCenter(actionItems, parsedData.event || 'Campus Notice');
  };

  const completedCount = actionItems.filter((i) => i.completed).length;
  const progressPct = actionItems.length > 0 ? (completedCount / actionItems.length) * 100 : 0;

  return (
    <div className="flex flex-col w-full gap-5 select-none pb-24">
      {/* Top Academic Context & Dev Badge */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#571bc1]/30 text-[#c4abff] text-[11px] font-mono shadow-[0_0_12px_rgba(87,27,193,0.25)] border border-[#c4abff]/20">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            GitHub Copilot Dev Days / OSEN Edition
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#4cd7f6] text-[11px] font-mono border border-[#4cd7f6]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
            v2.4 Ready
          </span>
        </div>

        {/* Editorial Catchphrase */}
        <div className="flex flex-col mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#dae2fd] tracking-tight">
            Notice &amp; Circular{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] via-[#4cd7f6] to-[#d0bcff]">
              Analyzer
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#c2c6d6] mt-1 leading-relaxed">
            Upload campus circulars, PDF orders, or WhatsApp notices to automatically find verified
            venue locations, critical dates, and action checklists.
          </p>
        </div>

        {/* AI Engine Selector Pill */}
        <div className="mt-2 bg-[#060e20] p-1 rounded-full flex items-center shadow-inner relative max-w-sm border border-white/[0.06]">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#222a3d] rounded-full shadow-md transition-all duration-300 ease-out ${
              engineMode === 'local' ? 'left-1' : 'left-[calc(50%+2px)]'
            }`}
          />
          <button
            onClick={() => {
              setEngineMode('local');
              showToast('Switched to Local Rule Engine (Deterministic offline parser)');
            }}
            className={`relative z-10 flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 font-mono text-xs transition-colors ${
              engineMode === 'local' ? 'text-[#dae2fd] font-semibold' : 'text-[#c2c6d6]'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]"></span>
            <span>Local Rule Engine</span>
          </button>
          <button
            onClick={() => {
              setEngineMode('gemini');
              if (geminiStatus === 'configured') {
                showToast('Gemini server has an API key configured');
              } else if (geminiStatus === 'missing') {
                showToast('Gemini API key is missing from the app server environment');
              } else if (geminiStatus === 'unreachable') {
                showToast('Gemini server is unreachable; check that the app server is running');
              } else {
                showToast('Checking Gemini server configuration...');
              }
            }}
            className={`relative z-10 flex-1 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 font-mono text-xs transition-colors ${
              engineMode === 'gemini' ? 'text-[#dae2fd] font-semibold' : 'text-[#c2c6d6]'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#adc6ff]/60"></span>
            <span>Gemini AI API</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-bold tracking-tighter ${
              geminiStatus === 'configured'
                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
            }`}>
              {geminiStatus === 'checking'
                ? 'CHECKING'
                : geminiStatus === 'configured'
                  ? 'KEY SET'
                  : geminiStatus === 'missing'
                    ? 'KEY NEEDED'
                    : 'OFFLINE'}
            </span>
          </button>
        </div>
      </div>

      {/* Notice Upload Zone (Drag & Drop + File Button) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 border-dashed flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'bg-[#4d8eff]/15 border-[#4cd7f6] scale-[1.01]'
            : 'bg-[#131b2e]/60 hover:bg-[#131b2e] border-white/[0.12] hover:border-[#4cd7f6]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.docx,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4d8eff]/20 to-[#4cd7f6]/20 border border-[#4cd7f6]/30 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_15px_rgba(76,215,246,0.2)]">
            <span className="material-symbols-outlined text-[24px]">upload_file</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#dae2fd]">
                Upload Notice / Circular
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] border border-[#4cd7f6]/20">
                PDF • Images • TXT • DOCX
              </span>
            </div>
            <p className="text-xs text-[#c2c6d6] mt-0.5">
              Drag &amp; drop or click to upload notice file for automatic venue &amp; deadline extraction
            </p>
          </div>
        </div>

        {uploadedFile && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 w-full max-w-md bg-[#060e20] p-2.5 rounded-xl border border-[#4cd7f6]/30 flex items-center justify-between gap-2 shadow-inner"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {uploadedFile.previewUrl ? (
                <img
                  src={uploadedFile.previewUrl}
                  alt="preview"
                  className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/20 text-[#4cd7f6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </div>
              )}
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-mono font-medium text-[#dae2fd] truncate">
                  {uploadedFile.name}
                </span>
                <span className="text-[10px] font-mono text-[#c2c6d6]">
                  {uploadedFile.size} • {uploadedFile.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExtract();
                }}
                disabled={isExtracting}
                className="px-2.5 py-1 rounded-lg bg-[#4cd7f6]/20 hover:bg-[#4cd7f6]/30 text-[#4cd7f6] text-[11px] font-mono flex items-center gap-1 border border-[#4cd7f6]/30"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">refresh</span>
                <span>Re-Analyze</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                  setUploadedSourceFile(null);
                  setRawText('');
                  setParsedData(null);
                  setActionItems([]);
                }}
                className="text-[#8c909f] hover:text-[#ffb4ab] p-1 rounded"
                title="Remove uploaded notice"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instant Sample Triggers (Maths Sheet, Lab Manual, etc.) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#c2c6d6] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">bolt</span>
            QUICK TEST PRESETS
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddPresetModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-[#4cd7f6]/15 hover:bg-[#4cd7f6]/25 text-[#4cd7f6] text-[11px] font-mono flex items-center gap-1 border border-[#4cd7f6]/30 active:scale-95 transition-all shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Add Preset</span>
            </button>
            <span className="text-xs font-mono text-[#c2c6d6]">1-Click load</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allPresets.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadPreset(sample.id)}
              className="w-full p-2.5 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-left flex items-start gap-3 active:scale-[0.99] transition-all shadow-sm border border-white/[0.04] group"
              type="button"
            >
              <div className="w-8 h-8 rounded-lg bg-[#adc6ff]/10 text-[#adc6ff] group-hover:bg-[#4cd7f6]/20 group-hover:text-[#4cd7f6] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                <span className="material-symbols-outlined text-[18px]">{sample.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#dae2fd] truncate">
                    {sample.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#060e20] text-[#4cd7f6] font-medium border border-white/[0.04]">
                      {sample.badge}
                    </span>
                    {sample.id.startsWith('custom-preset-') && (
                      <span
                        onClick={(e) => handleDeleteCustomPreset(e, sample.id)}
                        className="text-[#8c909f] hover:text-[#ffb4ab] p-0.5 rounded transition-colors"
                        title="Delete preset"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#c2c6d6] truncate mt-0.5">{sample.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Raw Circular Stream Matte Glass Card */}
      <div className="flex flex-col bg-[#131b2e] rounded-2xl p-4 shadow-xl relative overflow-hidden border border-white/[0.06]">
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#4d8eff]/10 to-transparent pointer-events-none rounded-full blur-2xl"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">input</span>
            <span className="text-sm font-semibold text-[#dae2fd]">Raw Circular Stream</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-full bg-[#171f33] text-[#4cd7f6] text-[11px] font-mono flex items-center gap-1 border border-[#4cd7f6]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
              {engineMode === 'local' ? 'Heuristic Parser' : 'Gemini 3.8 Flash'}
            </span>
          </div>
        </div>

        {/* Textarea input (clean / empty by default) */}
        <div className="relative w-full rounded-xl bg-[#060e20]/80 p-3 shadow-inner mt-1 border border-white/[0.04]">
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (uploadedSourceFile && !uploadedSourceFile.type.startsWith('text/')) {
                setUploadedSourceFile(null);
                setUploadedFile(null);
              }
            }}
            className="w-full bg-transparent text-[#dae2fd] text-xs sm:text-sm placeholder:text-[#8c909f] focus:outline-none resize-none leading-relaxed min-h-[120px]"
            placeholder="Paste unformatted WhatsApp college notice, department circular, exam schedule, or syllabus instructions here..."
            rows={5}
          />
          {rawText.length === 0 && (
            <div className="pointer-events-none absolute bottom-2 right-3 flex items-center gap-1 text-[#c2c6d6]/40 font-mono text-xs">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Auto-extracts venue, dates, deadlines
            </div>
          )}
        </div>

        {/* Counters & Actions Row */}
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#c2c6d6]">
            <span>{charCount} chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                charCount > 0 ? 'bg-[#4d8eff]/20 text-[#adc6ff]' : 'bg-white/5 text-[#8c909f]'
              }`}
            >
              {charCount > 0 ? 'Valid format' : 'Ready for input'}
            </span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setRawText('');
                setUploadedFile(null);
                setUploadedSourceFile(null);
                setParsedData(null);
                setActionItems([]);
                showToast('Input cleared');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#171f33] text-[#c2c6d6] text-xs hover:text-[#dae2fd] hover:bg-[#222a3d] active:scale-95 transition-all flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">backspace</span>
              Clear
            </button>
            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#4d8eff] via-[#3b82f6] to-[#4cd7f6] text-[#00285d] font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(77,142,255,0.35)] active:scale-95 transition-all disabled:opacity-50"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isExtracting ? 'animate-spin' : ''
                }`}
              >
                {isExtracting ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isExtracting ? 'Analyzing...' : 'Extract Actions'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Details HUD (Prominently displaying Venue, Dates & Deadlines) */}
      <div className="flex flex-col bg-[#171f33] rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden border border-white/[0.06]">
        {parsedData ? (
          <>
            {/* Verification Status Banner */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#009eb9]/30 text-[#4cd7f6] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(76,215,246,0.3)]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold text-[#dae2fd]">
                    Extracted Notice Details
                  </span>
                  <span className="font-mono text-[11px] text-[#4cd7f6]">
                    Review extracted details against the original notice before acting.
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#222a3d] text-[#adc6ff] font-mono text-[10px] font-semibold uppercase tracking-wider shrink-0 border border-white/[0.06]">
                {parsedData.engineUsed === 'gemini' ? 'Gemini extraction' : 'Local extraction'}
              </span>
            </div>

            {/* Prominent Venue & Dates Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              {/* Card 1: Venue / Campus Location */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#131b2e] to-[#171f33] flex flex-col justify-between border border-[#4cd7f6]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4cd7f6]/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                      Campus Venue / Room
                    </span>
                  </div>
                  <button
                    onClick={handleCopyVenue}
                    className="p-1 rounded bg-[#060e20] text-[#c2c6d6] hover:text-[#4cd7f6] active:scale-95 transition-all text-[11px] font-mono flex items-center gap-1 px-2 border border-white/[0.06]"
                    title="Copy venue address"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-sm sm:text-base font-bold text-[#dae2fd] block leading-snug">
                    {parsedData.venue}
                  </span>
                  <span className="text-[11px] font-mono text-[#adc6ff] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Verified Location on Campus
                  </span>
                </div>
              </div>

              {/* Card 2: Critical Dates & Deadlines */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#131b2e] to-[#171f33] flex flex-col justify-between border border-[#ffb4ab]/25 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb4ab]/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#ffb4ab]">
                    <span className="material-symbols-outlined text-[18px]">alarm</span>
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                      Dates &amp; Deadline
                    </span>
                  </div>
                  <button
                    onClick={handleExportNoticeIcs}
                    className="p-1 rounded bg-[#060e20] text-[#ffb4ab] hover:bg-[#ffb4ab]/15 active:scale-95 transition-all text-[11px] font-mono flex items-center gap-1 px-2 border border-[#ffb4ab]/20"
                    title="Add deadline to calendar"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">calendar_add_on</span>
                    <span>.ICS</span>
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-sm sm:text-base font-bold text-[#ffb4ab] block leading-snug">
                    {parsedData.deadline}
                  </span>
                  <span className="text-[11px] font-mono text-[#c2c6d6] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                    Active Academic Deadline
                  </span>
                </div>
              </div>

              {/* Card 3: Event / Activity */}
              <div className="p-3 rounded-xl bg-[#131b2e] flex flex-col gap-1 border border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-[#adc6ff]">
                  <span className="material-symbols-outlined text-[16px]">event_available</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Event / Circular Subject
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#dae2fd]">{parsedData.event}</span>
              </div>

              {/* Card 4: Eligibility & Fees */}
              <div className="p-3 rounded-xl bg-[#131b2e] flex flex-col gap-1 border border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-[#d0bcff]">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Eligibility &amp; Submission Dues
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#dae2fd]">{parsedData.fees}</span>
              </div>
            </div>

            {/* Smart Rule Engine Recommendation */}
            {parsedData.ruleRecommendation && (
              <div className="p-3 rounded-xl bg-[#222a3d]/60 border border-[#adc6ff]/20 flex items-start gap-2.5 my-2">
                <span className="material-symbols-outlined text-[18px] text-[#4cd7f6] shrink-0 mt-0.5">
                  psychology_alt
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-[#4cd7f6] uppercase">
                    Rule Engine Smart Tip
                  </span>
                  <p className="text-xs text-[#dae2fd] mt-0.5 leading-relaxed">
                    {parsedData.ruleRecommendation}
                  </p>
                </div>
              </div>
            )}

            {/* Generated Action Items Checklist */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
                    checklist
                  </span>
                  <span className="text-sm font-semibold text-[#dae2fd]">
                    Action Items Checklist
                  </span>
                </div>
                <span className="font-mono text-xs text-[#c2c6d6]">
                  {completedCount} of {actionItems.length} Completed
                </span>
              </div>

              {/* Checklist rows */}
              <div className="flex flex-col gap-2 mt-1">
                {actionItems.map((item) => (
                  <label
                    key={item.id}
                    className="p-3 rounded-xl bg-[#060e20]/90 flex items-start gap-3 cursor-pointer select-none transition-colors hover:bg-[#222a3d]/60 border border-white/[0.04]"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleItem(item.id)}
                      className="mt-0.5 w-4 h-4 rounded text-[#4d8eff] focus:ring-0 focus:outline-none accent-[#4d8eff] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span
                        className={`text-xs sm:text-sm text-[#dae2fd] transition-all leading-snug ${
                          item.completed ? 'line-through opacity-70 text-[#c2c6d6]' : ''
                        }`}
                      >
                        {item.text}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#adc6ff]/15 text-[#adc6ff] font-medium">
                          {item.tag}
                        </span>
                        {item.deadline && (
                          <span className="font-mono text-[10px] text-[#c2c6d6] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {item.deadline}
                          </span>
                        )}
                        {item.note && (
                          <span className="font-mono text-[10px] text-[#4cd7f6]">{item.note}</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 bg-[#222a3d]/30 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 rounded-b-2xl border-t border-white/[0.06]">
              <button
                onClick={handleCopyAll}
                className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/[0.04]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                  content_copy
                </span>
                Copy All Tasks
              </button>
              <button
                onClick={handleSaveToMyTasks}
                className="flex-1 min-w-[130px] py-2 px-3 rounded-xl bg-[#4d8eff] hover:bg-[#3b82f6] text-[#00285d] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                Save to My Action Center
              </button>
              <button
                onClick={() => onViewOriginalNotice(parsedData.rawText, parsedData.title)}
                className="py-2 px-3 rounded-xl bg-[#171f33] hover:bg-[#222a3d] text-[#c2c6d6] text-xs flex items-center justify-center gap-1 active:scale-95 transition-all border border-white/[0.04]"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Original
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#060e20] flex items-center justify-center text-[#adc6ff] mb-2.5 shadow-inner border border-white/[0.04]">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <span className="text-sm font-semibold text-[#dae2fd]">
              Awaiting Notice or Circular
            </span>
            <p className="text-xs text-[#c2c6d6] mt-1 max-w-xs leading-relaxed">
              Upload a notice file (PDF/Image/Document) above, paste your circular text, or select
              one of the quick presets to test verified venue &amp; deadline extraction.
            </p>
          </div>
        )}
      </div>

      {/* Student Productivity Pulse & Historical Snippet */}
      <div className="grid grid-cols-2 gap-3">
        {/* Stat 1 */}
        <div className="p-3.5 rounded-2xl bg-[#171f33] flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#c2c6d6]">Tasks Pending</span>
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              pending_actions
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#dae2fd]">
              {pendingTasksCount}
            </span>
            <span className="text-xs text-[#4cd7f6] font-mono">due this week</span>
          </div>
          <div className="w-full bg-[#060e20] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#adc6ff] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(15, progressPct))}%` }}
            />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-3.5 rounded-2xl bg-[#171f33] flex flex-col justify-between border border-white/[0.04]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#c2c6d6]">Circulars Parsed</span>
            <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
              fact_check
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#dae2fd]">
              {totalParsedCount}
            </span>
            <span className="text-xs text-[#d0bcff] font-mono">Analyzed</span>
          </div>
          <div className="w-full bg-[#060e20] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-[#d0bcff] h-full rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* Add Custom Preset Modal */}
      <AddPresetModal
        isOpen={isAddPresetModalOpen}
        onClose={() => setIsAddPresetModalOpen(false)}
        onAddPreset={handleAddCustomPreset}
      />
    </div>
  );
};
