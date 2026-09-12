'use client'

import { useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileImage,
  FlaskConical,
  History,
  ImagePlus,
  Languages,
  LockKeyhole,
  Menu,
  Microscope,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Upload,
  X,
} from 'lucide-react'

type View = 'scan' | 'history' | 'devices'
type Language = 'en' | 'de'
type ScanState = 'idle' | 'camera' | 'preview' | 'analyzing' | 'result'

const copy = {
  en: {
    scan: 'New scan', history: 'History', devices: 'Device lab',
    eyebrow: 'Research prototype · v0.1', title: 'Read your test card\nwith confidence.',
    subtitle: 'BloodScan AI helps interpret a standardized ABO/Rh test card. The reaction happens on the card — your camera simply reads it.',
    scanCard: 'Scan card', upload: 'Upload image', local: 'Processed locally',
    guide: 'Place the card inside the frame', guideText: 'Keep all three reaction zones visible and avoid glare.',
    cardLabel: 'Test card guide', antiA: 'Anti-A', antiB: 'Anti-B', antiD: 'Anti-D',
    how: 'How it works', steps: ['Capture the card', 'Check image quality', 'Interpret reactions'],
    privacy: 'Private by default', privacyText: 'Images stay on this device and are deleted after the session.',
    note: 'Research prototype', noteText: 'This app is not a medical device and does not diagnose blood type. Always confirm results with an accepted laboratory method.',
    historyTitle: 'Recent demo scans', devicesTitle: 'Cross-device lab',
    devicesText: 'The same card should produce the same interpretation across cameras. These are your first reference devices.',
    honor: 'HONOR 400 5G', iphone: 'iPhone 17 Pro', reference: 'Reference device', planned: 'Planned test',
    ready: 'Ready for your first scan', readyText: 'Use a controlled mock card to explore the workflow.',
    analyzing: 'Checking your image…', analyzingText: 'Looking for card edges, glare, and visible reaction zones.',
    demoResult: 'Sample interpretation', demo: 'DEMO RESULT', resultText: 'This result is illustrative only. It was not derived from a real blood sample.',
    positive: 'Positive', negative: 'Negative', inconclusive: 'Inconclusive', repeat: 'Repeat test', close: 'Close',
  },
  de: {
    scan: 'Neuer Scan', history: 'Verlauf', devices: 'Gerätelabor',
    eyebrow: 'Forschungsprototyp · v0.1', title: 'Testkarte sicher\nablesen.',
    subtitle: 'BloodScan AI unterstützt die Auswertung einer standardisierten ABO/Rh-Testkarte. Die Reaktion entsteht auf der Karte — die Kamera liest sie nur.',
    scanCard: 'Karte scannen', upload: 'Bild hochladen', local: 'Lokal verarbeitet',
    guide: 'Karte im Rahmen platzieren', guideText: 'Alle drei Reaktionszonen sichtbar halten und Spiegelungen vermeiden.',
    cardLabel: 'Testkarten-Anleitung', antiA: 'Anti-A', antiB: 'Anti-B', antiD: 'Anti-D',
    how: 'So funktioniert es', steps: ['Karte aufnehmen', 'Bildqualität prüfen', 'Reaktionen auswerten'],
    privacy: 'Standardmäßig privat', privacyText: 'Bilder bleiben auf diesem Gerät und werden nach der Sitzung gelöscht.',
    note: 'Forschungsprototyp', noteText: 'Diese App ist kein Medizinprodukt und diagnostiziert keine Blutgruppe. Ergebnisse immer mit einer anerkannten Labormethode bestätigen.',
    historyTitle: 'Letzte Demo-Scans', devicesTitle: 'Gerätelabor',
    devicesText: 'Dieselbe Karte sollte über verschiedene Kameras dieselbe Auswertung liefern. Das sind deine ersten Referenzgeräte.',
    honor: 'HONOR 400 5G', iphone: 'iPhone 17 Pro', reference: 'Referenzgerät', planned: 'Geplanter Test',
    ready: 'Bereit für den ersten Scan', readyText: 'Nutze eine kontrollierte Testkarte, um den Ablauf zu erkunden.',
    analyzing: 'Bild wird geprüft …', analyzingText: 'Kartenkanten, Spiegelungen und sichtbare Reaktionszonen werden gesucht.',
    demoResult: 'Beispielauswertung', demo: 'DEMO-ERGEBNIS', resultText: 'Dieses Ergebnis dient nur zur Veranschaulichung. Es basiert nicht auf einer echten Blutprobe.',
    positive: 'Positiv', negative: 'Negativ', inconclusive: 'Nicht eindeutig', repeat: 'Test wiederholen', close: 'Schließen',
  },
}

export default function Page() {
  const [view, setView] = useState<View>('scan')
  const [language, setLanguage] = useState<Language>('en')
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const t = copy[language]

  const chooseFile = (file?: File) => {
    if (!file) return
    setImageUrl(URL.createObjectURL(file))
    setScanState('preview')
  }

  const startCamera = async () => {
    setScanState('camera')
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      stream?.getTracks().forEach((track) => track.stop())
    } catch {
      setScanState('preview')
    }
  }

  const analyze = () => {
    setScanState('analyzing')
    window.setTimeout(() => setScanState('result'), 1100)
  }

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-[#202321]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-[#dfe3dc] bg-[#f2f4ef] px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#8f2838] text-white shadow-sm"><Activity size={20} strokeWidth={2.5} /></div>
            <div><p className="font-semibold tracking-[-0.02em]">BloodScan <span className="text-[#8f2838]">AI</span></p><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#788179]">Research lab</p></div>
          </div>
          <nav className="mt-14 flex flex-col gap-2" aria-label="Main navigation">
            <NavButton active={view === 'scan'} icon={ScanLine} label={t.scan} onClick={() => { setView('scan'); setScanState('idle') }} />
            <NavButton active={view === 'history'} icon={History} label={t.history} onClick={() => setView('history')} />
            <NavButton active={view === 'devices'} icon={Smartphone} label={t.devices} onClick={() => setView('devices')} />
          </nav>
          <div className="mt-auto rounded-2xl border border-[#d8e1d7] bg-[#e9f0e7] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#446451]"><LockKeyhole size={15} /><span className="text-xs font-semibold">{t.local}</span></div>
            <p className="text-xs leading-5 text-[#5b6f60]">{t.privacyText}</p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[76px] items-center justify-between border-b border-[#e2e5df] px-5 sm:px-8 lg:px-12">
            <button className="flex items-center gap-3 lg:hidden" onClick={() => setView('scan')} aria-label="Go to scan"><div className="flex size-9 items-center justify-center rounded-xl bg-[#8f2838] text-white"><Activity size={18} /></div><span className="font-semibold">BloodScan <span className="text-[#8f2838]">AI</span></span></button>
            <div className="hidden items-center gap-2 text-xs font-medium text-[#788179] lg:flex"><span className="size-2 rounded-full bg-[#699477]" />{t.local}</div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setLanguage(language === 'en' ? 'de' : 'en')} className="flex h-10 items-center gap-2 rounded-xl border border-[#dfe3dc] bg-white px-3 text-xs font-semibold hover:bg-[#f1f4ee]" aria-label="Switch language"><Languages size={15} />{language === 'en' ? 'DE' : 'EN'}</button>
              <button className="flex size-10 items-center justify-center rounded-xl border border-[#dfe3dc] bg-white lg:hidden" aria-label="Open menu"><Menu size={18} /></button>
            </div>
          </header>

          <div className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            {view === 'scan' && <ScanView t={t} scanState={scanState} imageUrl={imageUrl} onScan={startCamera} onUpload={() => fileRef.current?.click()} onAnalyze={analyze} onClose={() => { setScanState('idle'); setImageUrl(null) }} />}
            {view === 'history' && <HistoryView t={t} />}
            {view === 'devices' && <DevicesView t={t} />}
          </div>
        </section>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => chooseFile(e.target.files?.[0])} />
    </main>
  )
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof ScanLine; label: string; onClick: () => void }) {
  return <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? 'bg-white text-[#8f2838] shadow-sm' : 'text-[#6d756e] hover:bg-white/70 hover:text-[#202321]'}`}><Icon size={17} /><span>{label}</span>{active && <ChevronRight size={15} className="ml-auto" />}</button>
}

function ScanView({ t, scanState, imageUrl, onScan, onUpload, onAnalyze, onClose }: { t: typeof copy.en; scanState: ScanState; imageUrl: string | null; onScan: () => void; onUpload: () => void; onAnalyze: () => void; onClose: () => void }) {
  if (scanState === 'analyzing') return <div className="mx-auto flex min-h-[560px] max-w-[760px] flex-col items-center justify-center text-center"><div className="mb-7 flex size-20 items-center justify-center rounded-full bg-[#f1dfe1] text-[#8f2838]"><Microscope size={34} className="animate-pulse" /></div><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#8f2838]">{t.analyzing}</p><h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{t.analyzingText}</h1><div className="mt-8 h-1 w-52 overflow-hidden rounded-full bg-[#e5d2d5]"><div className="h-full w-1/2 animate-[slide_1.1s_ease-in-out_infinite] rounded-full bg-[#8f2838]" /></div></div>
  if (scanState === 'result') return <ResultView t={t} onClose={onClose} />
  return <div className="mx-auto max-w-[1080px]"><div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8f2838]">{t.eyebrow}</p><h1 className="max-w-[640px] whitespace-pre-line text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-5xl lg:text-[58px]">{t.title}</h1><p className="mt-5 max-w-[600px] text-[15px] leading-7 text-[#667068]">{t.subtitle}</p></div><div className="flex items-center gap-2 text-xs font-medium text-[#788179]"><ShieldCheck size={16} className="text-[#63866e]" />{t.privacy}</div></div>
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
      <div className="rounded-[26px] border border-[#dfe3dc] bg-white p-5 shadow-[0_12px_40px_rgba(44,55,43,0.05)] sm:p-7"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-semibold">{t.guide}</h2><p className="mt-1 text-sm text-[#788179]">{t.guideText}</p></div><div className="rounded-full bg-[#f5ebe9] px-3 py-1.5 text-xs font-bold text-[#8f2838]">ABO / Rh(D)</div></div>
        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#edf0eb] p-5"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#d7ddd5 1px, transparent 1px), linear-gradient(90deg, #d7ddd5 1px, transparent 1px)', backgroundSize: '28px 28px' }} />{imageUrl ? <img src={imageUrl} alt="Uploaded test card preview" className="relative max-h-[235px] max-w-full rounded-xl object-contain shadow-lg" /> : <TestCard t={t} />}</div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button onClick={onScan} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#8f2838] px-5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(143,40,56,0.2)] transition hover:bg-[#76202f]"><Camera size={17} />{t.scanCard}</button><button onClick={onUpload} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfe3dc] bg-white px-5 text-sm font-bold text-[#303631] transition hover:bg-[#f4f6f2]"><Upload size={17} />{t.upload}</button></div>
        {scanState === 'preview' && <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f2f5f0] px-4 py-3"><span className="flex items-center gap-2 text-sm font-medium"><FileImage size={16} className="text-[#63866e]" />Image ready for local analysis</span><button onClick={onAnalyze} className="flex items-center gap-1 text-sm font-bold text-[#8f2838]">Analyze <ArrowRight size={15} /></button></div>}
        {scanState === 'camera' && <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5ebe9] px-4 py-3 text-sm"><span className="flex items-center gap-2 font-medium text-[#8f2838]"><Camera size={16} />Camera access requested. Use upload for the demo.</span><button onClick={onClose} aria-label={t.close}><X size={16} /></button></div>}
      </div>
      <div className="flex flex-col gap-5"><div className="rounded-[26px] border border-[#dfe3dc] bg-[#e9f0e7] p-6"><div className="mb-5 flex items-center gap-2 text-[#446451]"><LockKeyhole size={17} /><h2 className="font-semibold">{t.local}</h2></div><p className="text-sm leading-6 text-[#5d6e61]">{t.privacyText}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#63866e]"><Check size={15} /> No cloud upload</div></div><div className="rounded-[26px] border border-[#dfe3dc] bg-white p-6"><h2 className="mb-5 text-lg font-semibold">{t.how}</h2><div className="flex flex-col gap-5">{t.steps.map((step, i) => <div key={step} className="flex items-center gap-4"><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f5ebe9] text-sm font-bold text-[#8f2838]">0{i + 1}</div><span className="text-sm font-medium">{step}</span>{i < 2 && <ArrowRight size={15} className="ml-auto rotate-90 text-[#a4ada4]" />}</div>)}</div></div></div>
    </div><div className="mt-5 flex gap-3 rounded-2xl border border-[#ead8b9] bg-[#fff9ed] p-4 text-sm leading-6 text-[#7b684b]"><CircleHelp size={18} className="mt-1 shrink-0 text-[#bd8f42]" /><p><strong>{t.note}:</strong> {t.noteText}</p></div></div>
}

function TestCard({ t }: { t: typeof copy.en }) { return <div className="relative z-10 w-full max-w-[510px] rotate-[-1deg] rounded-2xl border border-[#d3d4cd] bg-[#fbfbf7] p-5 shadow-[0_14px_30px_rgba(56,64,54,0.15)] sm:p-7"><div className="mb-7 flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f2838]">BloodScan</p><p className="mt-1 text-xs text-[#89918a]">ABO / Rh(D) test card</p></div><div className="size-3 rounded-full bg-[#8f2838]" /></div><div className="grid grid-cols-3 gap-3">{[t.antiA, t.antiB, t.antiD].map((label) => <div key={label} className="text-center"><div className="mb-2 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#cbd3c8] bg-[#f0f2ec]"><div className="size-10 rounded-full border-4 border-[#d7b0a8] bg-[#ead0ca] shadow-inner" /></div><span className="text-[11px] font-bold text-[#5e675f]">{label}</span></div>)}</div><div className="mt-6 flex justify-between text-[9px] font-medium uppercase tracking-[0.12em] text-[#a0a69f]"><span>ALIGN</span><span>KEEP FLAT</span><span>NO GLARE</span></div></div> }

function ResultView({ t, onClose }: { t: typeof copy.en; onClose: () => void }) { return <div className="mx-auto max-w-[820px]"><button onClick={onClose} className="mb-8 flex items-center gap-2 text-sm font-bold text-[#6e786f] hover:text-[#8f2838]"><X size={16} />{t.close}</button><div className="rounded-[28px] border border-[#dfe3dc] bg-white p-6 shadow-[0_12px_40px_rgba(44,55,43,0.06)] sm:p-10"><div className="flex flex-col justify-between gap-5 border-b border-[#e6e9e4] pb-8 sm:flex-row sm:items-start"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8f2838]">{t.demo}</p><h1 className="text-5xl font-semibold tracking-[-0.06em]">A<span className="text-[#8f2838]">+</span></h1><p className="mt-2 text-sm text-[#788179]">{t.demoResult}</p></div><div className="rounded-full bg-[#e9f0e7] px-4 py-2 text-xs font-bold text-[#446451]"><Check size={14} className="mr-1 inline" />INTERPRETABLE</div></div><div className="mt-8 grid gap-3 sm:grid-cols-3">{[[t.antiA, t.positive, true], [t.antiB, t.negative, false], [t.antiD, t.positive, true]].map(([label, status, positive]) => <div key={String(label)} className="rounded-2xl bg-[#f4f6f2] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#788179]">{label}</p><p className={`mt-3 text-sm font-bold ${positive ? 'text-[#8f2838]' : 'text-[#446451]'}`}><span className={`mr-2 inline-block size-2 rounded-full ${positive ? 'bg-[#b64a59]' : 'bg-[#699477]'}`} />{status}</p></div>)}</div><div className="mt-6 rounded-2xl bg-[#fff9ed] p-4 text-sm leading-6 text-[#7b684b]"><strong>{t.note}:</strong> {t.resultText}</div><button onClick={onClose} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3dc] text-sm font-bold hover:bg-[#f4f6f2]">{t.repeat} <ArrowRight size={16} /></button></div></div> }

function HistoryView({ t }: { t: typeof copy.en }) { return <div className="mx-auto max-w-[900px]"><PageHeading icon={History} title={t.historyTitle} subtitle={t.readyText} /><div className="flex flex-col gap-3">{['A+ · Demo interpretation', 'O− · Controlled mock card', 'Inconclusive · Glare detected'].map((item, i) => <div key={item} className="flex items-center justify-between rounded-2xl border border-[#dfe3dc] bg-white p-5"><div className="flex items-center gap-4"><div className={`flex size-11 items-center justify-center rounded-xl ${i === 2 ? 'bg-[#fff1d7] text-[#a9782e]' : 'bg-[#e9f0e7] text-[#446451]'}`}><Clock3 size={19} /></div><div><p className="font-semibold">{item}</p><p className="mt-1 text-xs text-[#89918a]">{i + 1} days ago · Local only</p></div></div><ChevronRight size={18} className="text-[#a4ada4]" /></div>)}</div></div> }

function DevicesView({ t }: { t: typeof copy.en }) { return <div className="mx-auto max-w-[900px]"><PageHeading icon={Smartphone} title={t.devicesTitle} subtitle={t.devicesText} /><div className="grid gap-4 sm:grid-cols-2"><DeviceCard icon="H" name={t.honor} role={t.reference} color="bg-[#e9f0e7] text-[#446451]" /><DeviceCard icon="" name={t.iphone} role={t.planned} color="bg-[#f5ebe9] text-[#8f2838]" /></div><div className="mt-5 rounded-2xl border border-[#ead8b9] bg-[#fff9ed] p-5 text-sm leading-6 text-[#7b684b]"><strong>Cross-device protocol:</strong> capture the same controlled card in the same lighting, then compare original images, quality checks, and interpretation outputs.</div></div> }
function PageHeading({ icon: Icon, title, subtitle }: { icon: typeof History; title: string; subtitle: string }) { return <div className="mb-9"><div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#f5ebe9] text-[#8f2838]"><Icon size={20} /></div><h1 className="text-4xl font-semibold tracking-[-0.05em]">{title}</h1><p className="mt-3 max-w-[600px] text-[15px] leading-7 text-[#667068]">{subtitle}</p></div> }
function DeviceCard({ icon, name, role, color }: { icon: string; name: string; role: string; color: string }) { return <div className="rounded-[24px] border border-[#dfe3dc] bg-white p-6"><div className={`mb-6 flex size-14 items-center justify-center rounded-2xl text-xl font-bold ${color}`}>{icon}</div><h2 className="text-lg font-semibold">{name}</h2><p className="mt-2 text-sm text-[#788179]">{role}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#63866e]"><Check size={14} /> Ready to test</div></div> }
