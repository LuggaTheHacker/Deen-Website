import { useState, useEffect } from 'react';

// --- ANIMATION COMPONENT (Reiner Code, kein Bild) ---
const PrintAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 45) return 0; // Reset mit kurzer Pause nach Abschluss
        return prev + 1;
      });
    }, 150); // Taktzeit des Lasers
    return () => clearInterval(interval);
  }, []);

  // 6x6 Grid = 36 Blöcke. 1 = Zu druckendes Material, 0 = Leer.
  const activeBlocks = [
    0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
  ];

  return (
    <div className="relative w-full max-w-xs aspect-square border border-zinc-800 rounded-[2rem] bg-zinc-950 p-6 flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
       <div className="absolute top-6 left-6 flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
         <span className="font-mono text-[10px] text-zinc-500 tracking-widest">BUILD_PROCESS</span>
       </div>
       
       <div className="grid grid-cols-6 gap-1.5 md:gap-2 mt-4">
         {Array.from({ length: 36 }).map((_, i) => {
           const isTarget = activeBlocks[i] === 1;
           const isPrinted = step > i && isTarget;
           const isLaser = step === i;

           return (
             <div 
               key={i} 
               className={`w-6 h-6 md:w-8 md:h-8 rounded-sm transition-all duration-200 ${
                 isLaser ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] scale-110 z-10' : 
                 isPrinted ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 
                 'bg-zinc-900 border border-zinc-800/50'
               }`}
             ></div>
           );
         })}
       </div>
       
       <div className="absolute bottom-6 right-6 font-mono text-[10px] text-zinc-500 flex flex-col items-end">
         <span>LAYER: {Math.min(Math.floor(step / 6) + 1, 6)}/6</span>
         <span className="text-white mt-1">Z-AXIS: {(Math.min(step, 36) * 0.12).toFixed(2)}mm</span>
       </div>
    </div>
  );
};


export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Für den Pitch auf TRUE
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Konfigurator-State
  const [configurator, setConfigurator] = useState({
    fileName: '', fileSize: '', volume: 'Einzelstück (Prototyp)', material: 'PA12 (Nylon) - Selektives Lasersintern',
    tolerance: 'Standard (ISO 2768-m)', qa: 'Standard-Sichtprüfung', trowalisieren: false, helicoil: false,
    lackierung: false, shipping: 'Standard (4-6 Werktage)', addonExpressDeburr: false, addonDrawingCheck: false
  });

  // Dummy-Daten
  const [orders, setOrders] = useState([
    { 
      id: 'PRJ-8821', name: 'Luftführung GT-Spec', material: 'PA12 (Nylon) - Selektives Lasersintern', volume: 'Kleinserie (10 - 50 Stück)', 
      tolerance: 'Präzision (± 0.05mm)', qa: 'Optischer 3D-Scan Abgleich', trowalisieren: true, helicoil: false, lackierung: true, 
      shipping: 'Express (48 Stunden)', fileName: 'GT_AIR_FLOW_V4.STEP', fileSize: '42.3 MB', date: '22.06.2026', price: '1.240,00 €', status: 'Im Druck'
    },
    { 
      id: 'PRJ-8819', name: 'Bremssattel-Dummy (Mockup)', material: 'Resin (Tough) - SLA', volume: 'Einzelstück (Prototyp)', 
      tolerance: 'Standard (ISO 2768-m)', qa: 'Standard-Sichtprüfung', trowalisieren: false, helicoil: false, lackierung: false, 
      shipping: 'Standard (4-6 Werktage)', fileName: 'CALIPER_MOCKUP_XE.STL', fileSize: '18.9 MB', date: '20.06.2026', price: '85,50 €', status: 'Versandbereit'
    },
    { 
      id: 'PRJ-8790', name: 'Halterung eATS-Modul', material: 'Aluminium (AlSi10Mg) - SLM', volume: 'Einzelstück (Prototyp)', 
      tolerance: 'Präzision (± 0.05mm)', qa: 'Erstmusterprüfbericht (EMPB)', trowalisieren: true, helicoil: true, lackierung: false, 
      shipping: 'Standard (4-6 Werktage)', fileName: 'EATS_BRACKET_REAR.STEP', fileSize: '112.5 MB', date: '15.05.2026', price: '320,00 €', status: 'Abgeschlossen'
    },
  ]);

  // Shop-Produkte
  const shopItems = [
    { id: 'SHP-01', name: 'Helicoil-Set (M3-M8)', desc: 'Edelstahleinsätze für Druckteile. Inkl. Werkzeug.', price: '24,90 €' },
    { id: 'SHP-02', name: 'ISO Prüfwürfel (AlSi10Mg)', desc: 'Kalibrierter Referenzwürfel für Messmaschinen.', price: '45,00 €' },
    { id: 'SHP-03', name: 'High-Temp Tape', desc: 'Abklebeband für Lackier- und Sandstrahlarbeiten.', price: '12,50 €' },
    { id: 'SHP-04', name: 'GT Befestigungs-Kit', desc: 'Titanschrauben für automotive Prototypen.', price: '89,00 €' },
  ];

  // --- LOGISCHE PREISKALKULATION ---
  const calculateExactPrice = (config) => {
    let basePrice = 50.00;
    if (config.volume.includes('Kleinserie')) basePrice = 650.00;
    else if (config.volume.includes('Vorserie')) basePrice = 2450.00;
    else if (config.volume.includes('Großproduktion')) basePrice = 7800.00;
    if (config.material.includes('Resin')) basePrice += 35.50;
    else if (config.material.includes('Aluminium')) basePrice += 220.00;
    else if (config.material.includes('Edelstahl')) basePrice += 310.00;
    if (config.tolerance.includes('Präzision')) basePrice += 65.00;
    if (config.qa.includes('Erstmusterprüfbericht')) basePrice += 120.00;
    else if (config.qa.includes('3D-Scan')) basePrice += 180.00;
    if (config.trowalisieren) basePrice += 45.00;
    if (config.helicoil) basePrice += 60.00;
    if (config.lackierung) basePrice += 110.00;
    if (config.addonExpressDeburr) basePrice += 15.00;
    if (config.addonDrawingCheck) basePrice += 25.00;
    if (config.shipping.includes('Express')) basePrice += 45.00;
    else if (config.shipping.includes('Overnight')) basePrice += 140.00;
    return basePrice.toFixed(2).replace('.', ',') + ' €';
  };

  const handleReOrder = (order) => {
    setConfigurator({
      fileName: `RE_` + order.fileName, fileSize: order.fileSize, volume: order.volume,
      material: order.material, tolerance: order.tolerance, qa: order.qa,
      trowalisieren: order.trowalisieren, helicoil: order.helicoil, lackierung: order.lackierung,
      shipping: order.shipping, addonExpressDeburr: false, addonDrawingCheck: false
    });
    setCurrentView('upload');
    setIsMobileMenuOpen(false);
  };

  const navTo = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  // --- UI-KOMPONENTEN (NOTHING AESTHETIC) ---
  
  // Custom Styles für den Nothing Dot-Grid Background & Base Card Formats
  const globalStyles = `
    .bg-nothing-grid {
      background-image: radial-gradient(#d4d4d8 1px, transparent 1px);
      background-size: 20px 20px;
      background-color: #f4f4f5;
    }
    .nothing-card {
      border: 1px solid #e4e4e7;
      border-radius: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .nothing-input {
      border: 1px solid #d4d4d8;
      border-radius: 9999px; /* Pill shape */
      padding: 0.75rem 1.25rem;
      background: #fafafa;
      transition: all 0.2s;
    }
    .nothing-input:focus {
      outline: none;
      border-color: #000;
      background: white;
    }
  `;

  const Header = () => (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between text-sm font-medium">
        <div className="cursor-pointer font-bold tracking-widest flex items-center gap-3" onClick={() => navTo('home')}>
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-mono text-lg">AERO(PRINT)</span>
        </div>
        
        <nav className="hidden md:flex space-x-8 items-center">
          <button onClick={() => navTo('home')} className={`hover:text-zinc-500 transition-colors ${currentView === 'home' ? 'text-black' : 'text-zinc-400'}`}>Start</button>
          <button onClick={() => navTo('maschinen')} className={`hover:text-zinc-500 transition-colors ${currentView === 'maschinen' ? 'text-black' : 'text-zinc-400'}`}>Hardware</button>
          <button onClick={() => navTo('shop')} className={`hover:text-zinc-500 transition-colors ${currentView === 'shop' ? 'text-black' : 'text-zinc-400'}`}>Shop</button>
          <button onClick={() => navTo('support')} className={`hover:text-zinc-500 transition-colors ${currentView === 'support' ? 'text-black' : 'text-zinc-400'}`}>Support</button>
          
          <div className="w-px h-6 bg-zinc-300 mx-2"></div>
          
          {isLoggedIn ? (
            <>
              <button onClick={() => navTo('upload')} className="text-red-600 font-mono tracking-wide hover:text-red-700 transition-colors">
                [+ UPLOAD]
              </button>
              <button onClick={() => navTo('dashboard')} className="bg-black text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors">
                Portal
              </button>
            </>
          ) : (
            <button onClick={() => setIsLoggedIn(true)} className="bg-black text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition-colors">Login</button>
          )}
        </nav>

        <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className={`block w-6 h-0.5 bg-black transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-200 p-4 flex flex-col space-y-4 shadow-xl">
          <button onClick={() => navTo('home')} className="text-left font-mono text-lg py-2 border-b border-zinc-100">Start</button>
          <button onClick={() => navTo('maschinen')} className="text-left font-mono text-lg py-2 border-b border-zinc-100">Hardware</button>
          <button onClick={() => navTo('shop')} className="text-left font-mono text-lg py-2 border-b border-zinc-100">Shop</button>
          <button onClick={() => navTo('support')} className="text-left font-mono text-lg py-2 border-b border-zinc-100">Support</button>
          {isLoggedIn ? (
            <div className="flex flex-col space-y-3 pt-2">
              <button onClick={() => navTo('upload')} className="text-left text-red-600 font-mono text-lg py-2">[+ NEUER AUFTRAG]</button>
              <button onClick={() => navTo('dashboard')} className="bg-black text-white px-4 py-3 rounded-xl font-medium text-center">Kundenportal Öffnen</button>
              <button onClick={() => setIsLoggedIn(false)} className="text-zinc-400 py-2">Logout</button>
            </div>
          ) : (
            <button onClick={() => setIsLoggedIn(true)} className="bg-black text-white px-4 py-3 rounded-xl font-medium text-center mt-2">Kunden-Login</button>
          )}
        </div>
      )}
    </header>
  );

  // --- VIEWS ---

  const ViewHome = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
      {/* Hero Section - Explicitly bg-black now */}
      <div className="nothing-card bg-black text-white p-8 md:p-16 mb-12 md:mb-24 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900 rounded-full px-4 py-1.5 text-xs font-mono text-zinc-300 mb-8">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            SYS(READY)
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-tight">
            Idee. <br />
            <span className="font-bold">Hardware.</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 mb-10 leading-relaxed font-light max-w-xl">
            Industrielle additive Fertigung. Laden Sie CAD-Daten hoch und transformieren Sie Code in maßhaltige physische Prototypen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => { setIsLoggedIn(true); navTo('upload'); }} className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors text-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Fertigung konfigurieren
            </button>
            <button onClick={() => navTo('maschinen')} className="border border-zinc-600 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors text-center">
              Anlagen ansehen
            </button>
          </div>
        </div>
        {/* Die neue 3D-Druck Code-Animation */}
        <div className="flex-1 flex justify-center lg:justify-end w-full">
           <PrintAnimation />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-mono tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-zinc-300"></span> LOG(PROJEKTE)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nothing-card bg-white p-6 md:p-8 hover:border-black transition-colors">
            <span className="text-xs font-mono bg-black text-white px-2 py-1 rounded-md">REF-0941</span>
            <h4 className="text-lg font-bold mt-4 mb-2">eATS-Komponenten</h4>
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">SLS</span>
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">PA12</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">Strömungskanäle und Prototypengehäuse für elektrische Antriebsstränge.</p>
          </div>
          <div className="nothing-card bg-white p-6 md:p-8 hover:border-black transition-colors">
            <span className="text-xs font-mono bg-black text-white px-2 py-1 rounded-md">REF-1102</span>
            <h4 className="text-lg font-bold mt-4 mb-2">Spannbacken</h4>
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">SLM</span>
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">Edelstahl</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">Werkzeugeinsätze für automatisierte Fertigungslinien mit integrierten Kühlstrukturen.</p>
          </div>
          <div className="nothing-card bg-white p-6 md:p-8 hover:border-black transition-colors">
            <span className="text-xs font-mono bg-black text-white px-2 py-1 rounded-md">REF-8830</span>
            <h4 className="text-lg font-bold mt-4 mb-2">Ergonomie-Mockups</h4>
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">SLA</span>
              <span className="text-xs font-mono text-zinc-500 border border-zinc-200 rounded-full px-2 py-0.5">Resin</span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">Hochauflösende Interieur-Komponenten zur haptischen Validierung.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewMaschinen = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-12">Hardware(Anlagen)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="nothing-card bg-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-full">Anlage_01</span>
              <span className="font-mono text-xs text-zinc-400">SLM Metall</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">EOS M 290</h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">Spezialisiert auf hochpräzise Metallkomponenten. Schichtstärken bis zu 20 µm garantieren maximale mechanische Belastbarkeit für Strukturbauteile.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-xs font-mono text-zinc-400 mb-1">Bauraum (X/Y/Z)</p>
            <p className="font-mono text-sm font-bold">250 x 250 x 325 mm</p>
          </div>
        </div>
        
        <div className="nothing-card bg-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-full">Anlage_02</span>
              <span className="font-mono text-xs text-zinc-400">SLS Polymer</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Formlabs Fuse 1+</h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">Perfekt für komplexe Geometrien und Kleinserien ohne Stützstrukturen. Verarbeitet industrielles PA12-Nylon für zähe Funktionsteile.</p>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <p className="text-xs font-mono text-zinc-400 mb-1">Bauraum (X/Y/Z)</p>
            <p className="font-mono text-sm font-bold">165 x 165 x 300 mm</p>
          </div>
        </div>
      </div>

      <div className="nothing-card bg-black text-white p-8 md:p-12">
        <h2 className="text-xs font-mono text-zinc-500 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-500"></span> PROFILE(DEEN)
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-6">Head of Engineering</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-400 text-sm leading-relaxed">
          <p>
            Als spezialisierter Fertigungsexperte im Bereich industrieller Prototypensysteme gründete Deen AERO // PRINT mit einer klaren Prämisse: <strong className="text-white">Taktzeit schlägt Perfektionismus im Prozess, während das finale Bauteil absolute Präzision aufweisen muss.</strong>
          </p>
          <p>
            Mit fundierter technischer Expertise in der additiven Fertigung komplexer Systemkomponenten überführen wir digitale CAD-Daten kompromisslos in hochbelastbare Modelle. Ob für Vorrichtungsbau oder Automotive-Testing – bei Deen laufen die Anlagen streng nach Industriestandard.
          </p>
        </div>
      </div>
    </div>
  );

  const ViewShop = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-black mb-2">Shop(Zubehör)</h2>
        <p className="text-zinc-500 font-mono text-sm">Standard-Teile sofort ab Lager lieferbar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map(item => (
          <div key={item.id} className="nothing-card bg-white p-6 flex flex-col justify-between hover:border-black hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all">
            <div>
              <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded-md text-zinc-600 block w-max mb-4">{item.id}</span>
              <h4 className="text-base font-bold text-black mb-2">{item.name}</h4>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{item.desc}</p>
            </div>
            <div>
              <div className="text-xl font-mono text-black mb-4">{item.price}</div>
              <button 
                onClick={() => alert(`${item.name} zum Warenkorb hinzugefügt.`)}
                className="w-full bg-zinc-100 text-black px-4 py-3 rounded-xl text-sm font-bold hover:bg-black hover:text-white transition-colors"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-black">Portal(Aufträge)</h2>
          <p className="text-zinc-500 font-mono text-sm mt-2">Aktuelle Fertigungsberichte und Qualitätsdaten.</p>
        </div>
        <button onClick={() => navTo('upload')} className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold w-full md:w-auto hover:bg-zinc-800 transition-colors">
          + Neuer Auftrag
        </button>
      </div>

      <div className="nothing-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 font-mono text-xs uppercase text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Projekt</th>
                <th className="px-6 py-4 font-medium">Material</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-black">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-black">{order.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{order.material.split('-')[0]}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      order.status === 'Im Druck' ? 'bg-amber-100 text-amber-800' : 
                      order.status === 'Versandbereit' ? 'bg-emerald-100 text-emerald-800' : 
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {order.status === 'Im Druck' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                     <button onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="text-xs font-bold text-zinc-500 hover:text-black border border-zinc-200 rounded-lg px-3 py-1.5 transition-colors">
                       Details
                     </button>
                     <button onClick={() => handleReOrder(order)} className="text-xs font-bold bg-black text-white rounded-lg px-3 py-1.5 hover:bg-zinc-800 transition-colors">
                       Re-Order
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ViewOrderDetail = () => {
    if (!selectedOrder) return null;
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <button onClick={() => setCurrentView('dashboard')} className="text-xs font-mono font-bold text-zinc-400 hover:text-black mb-8 flex items-center gap-2 transition-colors">
          ← ZURÜCK(PORTAL)
        </button>
        
        <div className="nothing-card bg-white p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-100 pb-6 mb-8 gap-4">
            <div>
              <span className="font-mono text-xs bg-black text-white px-2 py-1 rounded-md">{selectedOrder.id}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-black mt-3">{selectedOrder.name}</h2>
            </div>
            <span className="border-2 border-black rounded-full px-4 py-2 text-xs font-mono font-bold uppercase">
              STATUS: {selectedOrder.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4">PARAM(FERTIGUNG)</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Volumen:</span> <span className="font-bold text-black">{selectedOrder.volume}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Material:</span> <span className="font-bold text-black">{selectedOrder.material.split('-')[0]}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Toleranz:</span> <span className="font-bold text-black">{selectedOrder.tolerance}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">QS-Stufe:</span> <span className="font-bold text-black">{selectedOrder.qa}</span></div>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4">PARAM(DATENSATZ)</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between flex-wrap"><span className="text-zinc-500">Datei:</span> <span className="font-mono text-xs font-bold text-black break-all">{selectedOrder.fileName}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Größe:</span> <span className="font-bold text-black">{selectedOrder.fileSize}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Eingang:</span> <span className="font-bold text-black">{selectedOrder.date}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Logistik:</span> <span className="font-bold text-black">{selectedOrder.shipping.split('(')[0]}</span></div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-zinc-400 block mb-1">WERT(NETTO)</span>
              <span className="text-3xl md:text-4xl font-light tracking-tight text-black">{selectedOrder.price}</span>
            </div>
            <button onClick={() => handleReOrder(selectedOrder)} className="w-full md:w-auto bg-red-600 text-white rounded-full font-bold text-sm px-8 py-4 hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              RE-ORDER INITIATE
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewUpload = () => (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-2">Upload(CAD)</h2>
        <p className="text-zinc-500 font-mono text-sm">Spezifikation definieren. Live-Kalkulation aktivieren.</p>
      </div>
      
      <div className="nothing-card bg-white border-2 border-dashed border-zinc-300 p-8 md:p-16 text-center hover:bg-zinc-50 transition-colors cursor-pointer mb-10 relative overflow-hidden">
        {configurator.fileName ? (
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-md font-mono text-xs mb-4">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               DATA_LOADED
            </div>
            <p className="text-lg md:text-xl font-mono font-bold text-black">{configurator.fileName}</p>
            <p className="text-sm text-zinc-500 mt-2">{configurator.fileSize || 'Auto-Verified'}</p>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="text-zinc-300 mb-4 font-mono text-5xl">/\</div>
            <p className="text-base font-bold text-black">CAD-Dateien ablegen</p>
            <p className="text-xs font-mono text-zinc-500 mt-2">.STEP, .STL, .IGES (Max 500MB)</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        <div className="nothing-card bg-white p-6 md:p-8 space-y-5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 mb-6">01_BASIS</h3>
          <div>
             <label className="block text-sm font-bold text-black mb-2">Volumen</label>
             <select value={configurator.volume} onChange={(e) => setConfigurator({...configurator, volume: e.target.value})} className="nothing-input w-full text-sm">
               <option>Einzelstück (Prototyp)</option>
               <option>Kleinserie (10 - 50 Stück)</option>
               <option>Vorserie (50 - 500 Stück)</option>
               <option>Großproduktion (500+ Stück)</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-black mb-2">Material</label>
             <select value={configurator.material} onChange={(e) => setConfigurator({...configurator, material: e.target.value})} className="nothing-input w-full text-sm">
               <option>PA12 (Nylon) - SLS</option>
               <option>Resin (Tough) - SLA</option>
               <option>Aluminium (AlSi10Mg) - SLM</option>
               <option>Edelstahl (316L) - SLM</option>
             </select>
          </div>
        </div>

        <div className="nothing-card bg-white p-6 md:p-8 space-y-5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 mb-6">02_QUALITÄT</h3>
          <div>
             <label className="block text-sm font-bold text-black mb-2">Toleranz</label>
             <select value={configurator.tolerance} onChange={(e) => setConfigurator({...configurator, tolerance: e.target.value})} className="nothing-input w-full text-sm">
               <option>Standard (ISO 2768-m)</option>
               <option>Präzision (± 0.05mm)</option>
             </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-black mb-2">QS-Stufe</label>
             <select value={configurator.qa} onChange={(e) => setConfigurator({...configurator, qa: e.target.value})} className="nothing-input w-full text-sm">
               <option>Standard-Sichtprüfung</option>
               <option>Erstmusterprüfbericht (EMPB)</option>
               <option>Optischer 3D-Scan</option>
             </select>
          </div>
        </div>

        <div className="nothing-card bg-white p-6 md:p-8 space-y-5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 mb-6">03_FINISH</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:border-black transition-colors">
              <input type="checkbox" checked={configurator.trowalisieren} onChange={(e) => setConfigurator({...configurator, trowalisieren: e.target.checked})} className="w-4 h-4 text-black focus:ring-black rounded" />
              <span className="text-sm font-bold text-black">Trowalisieren</span>
            </label>
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:border-black transition-colors">
              <input type="checkbox" checked={configurator.helicoil} onChange={(e) => setConfigurator({...configurator, helicoil: e.target.checked})} className="w-4 h-4 text-black focus:ring-black rounded" />
              <span className="text-sm font-bold text-black">Helicoil-Einsätze</span>
            </label>
            <label className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:border-black transition-colors">
              <input type="checkbox" checked={configurator.lackierung} onChange={(e) => setConfigurator({...configurator, lackierung: e.target.checked})} className="w-4 h-4 text-black focus:ring-black rounded" />
              <span className="text-sm font-bold text-black">Lackierung (RAL)</span>
            </label>
          </div>
        </div>

        <div className="nothing-card bg-white p-6 md:p-8 space-y-5 border-black/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
          <h3 className="text-xs font-mono font-bold text-red-500 mb-6">04_ADDONS</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-100 cursor-pointer hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={configurator.addonExpressDeburr} onChange={(e) => setConfigurator({...configurator, addonExpressDeburr: e.target.checked})} className="w-4 h-4 text-red-500 focus:ring-red-500 rounded" />
                <span className="text-sm font-bold text-black">Express-Entgratung</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-500">+15€</span>
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-100 cursor-pointer hover:border-red-500 transition-colors">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={configurator.addonDrawingCheck} onChange={(e) => setConfigurator({...configurator, addonDrawingCheck: e.target.checked})} className="w-4 h-4 text-red-500 focus:ring-red-500 rounded" />
                <span className="text-sm font-bold text-black">2D-Zeichnungsabgleich</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-500">+25€</span>
            </label>
            <div className="pt-4 mt-4 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 mb-2 font-mono">Hardware-Zubehör benötigt?</p>
              <button onClick={() => navTo('shop')} className="text-xs font-bold text-black bg-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors">Shop Öffnen ↗</button>
            </div>
          </div>
        </div>
      </div>

      <div className="nothing-card bg-black text-white p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 sticky bottom-4 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <p className="text-xs font-mono text-zinc-400 mb-1">CALC(TOTAL_NET)</p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {calculateExactPrice(configurator)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <select 
            value={configurator.shipping} 
            onChange={(e) => setConfigurator({...configurator, shipping: e.target.value})} 
            className="bg-zinc-900 border border-zinc-800 text-white rounded-full px-6 py-4 text-sm font-bold focus:outline-none focus:border-zinc-500 w-full sm:w-auto"
          >
            <option>Standard (4-6 Werktage)</option>
            <option>Express (48 Stunden)</option>
            <option>Overnight Sprint (Priorität)</option>
          </select>
          <button 
            onClick={() => {
              const newProjId = 'PRJ-' + Math.floor(Math.random() * 9000 + 1000);
              const newOrderObj = {
                id: newProjId, name: configurator.fileName ? configurator.fileName.replace('.STEP','').replace('.STL','') : 'Custom Prototyp',
                material: configurator.material, volume: configurator.volume, tolerance: configurator.tolerance, qa: configurator.qa,
                trowalisieren: configurator.trowalisieren, helicoil: configurator.helicoil, lackierung: configurator.lackierung,
                shipping: configurator.shipping, fileName: configurator.fileName || 'MANUAL_UPLOAD.STEP', fileSize: configurator.fileSize || '24.0 MB',
                date: new Date().toLocaleDateString('de-DE'), price: calculateExactPrice(configurator), status: 'CAD-Prüfung'
              };
              setOrders([newOrderObj, ...orders]);
              alert('Auftrag übermittelt. Weiterleitung ins Portal.');
              navTo('dashboard');
            }}
            className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-zinc-200 transition-colors w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            BEAUFTRAGEN
          </button>
        </div>
      </div>
    </div>
  );

  const ViewSupport = () => (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-12">Support(Contact)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        <div className="nothing-card bg-black text-white p-8">
          <h3 className="text-xs font-mono text-zinc-400 mb-4">COM(HOTLINE)</h3>
          <p className="text-2xl md:text-3xl font-bold mb-4">+49 711 5550194</p>
          <p className="text-sm text-zinc-400">Technischer Support bei Konstruktionsfragen. <br/>Mo-Fr: 08:00 - 17:00 Uhr</p>
        </div>
        <div className="nothing-card bg-white p-8">
          <h3 className="text-xs font-mono text-zinc-400 mb-4">LOC(HQ)</h3>
          <p className="text-base font-bold text-black leading-relaxed">
            AERO // PRINT<br />
            Industriestraße 42<br />
            70771 Leinfelden-Echterdingen<br />
            Germany
          </p>
        </div>
      </div>

      <div className="nothing-card bg-white p-6 md:p-10">
        <h3 className="text-xl font-bold text-black mb-2">Engineering Request</h3>
        <p className="text-sm text-zinc-500 mb-8 font-mono">Für Sonderanfragen & Lastenhefte.</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-2 ml-4">NAME</label>
              <input type="text" className="nothing-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-2 ml-4">COMPANY</label>
              <input type="text" className="nothing-input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-2 ml-4">E-MAIL</label>
            <input type="email" className="nothing-input w-full" />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-2 ml-4">SPECS</label>
            <textarea rows="4" className="nothing-input w-full rounded-3xl resize-none"></textarea>
          </div>
          <div className="pt-4">
            <button onClick={() => alert('Anfrage verschlüsselt übermittelt.')} className="bg-black text-white w-full px-8 py-4 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
              SEND(DATA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER LOGIK ---
  return (
    <div className="min-h-screen bg-nothing-grid font-sans text-black flex flex-col selection:bg-red-500 selection:text-white">
      <style>{globalStyles}</style>
      <Header />
      <main className="flex-grow">
        {currentView === 'home' && <ViewHome />}
        {currentView === 'maschinen' && <ViewMaschinen />}
        {currentView === 'shop' && <ViewShop />}
        {currentView === 'dashboard' && <ViewDashboard />}
        {currentView === 'order-detail' && <ViewOrderDetail />}
        {currentView === 'upload' && <ViewUpload />}
        {currentView === 'support' && <ViewSupport />}
      </main>
      <footer className="border-t border-zinc-200 py-8 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs font-bold text-zinc-400">© 2026 AERO(PRINT) SYS.</span>
          <div className="space-x-6 font-mono text-xs font-bold text-zinc-400">
            <span className="hover:text-black cursor-pointer transition-colors">IMPRESSUM</span>
            <span className="hover:text-black cursor-pointer transition-colors">PRIVACY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
