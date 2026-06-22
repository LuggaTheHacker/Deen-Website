import { useState } from 'react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Für den Pitch standardmäßig auf TRUE gesetzt!
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Konfigurator-State
  const [configurator, setConfigurator] = useState({
    fileName: '',
    fileSize: '',
    volume: 'Einzelstück (Prototyp)',
    material: 'PA12 (Nylon) - Selektives Lasersintern',
    tolerance: 'Standard (ISO 2768-m)',
    qa: 'Standard-Sichtprüfung',
    trowalisieren: false,
    helicoil: false,
    lackierung: false,
    shipping: 'Standard (4-6 Werktage)',
    // Neue Cross-Selling Checkboxen
    addonExpressDeburr: false,
    addonDrawingCheck: false
  });

  // Dummy-Daten für das Kundenportal
  const [orders, setOrders] = useState([
    { 
      id: 'PRJ-8821', 
      name: 'Luftführung GT-Spec', 
      material: 'PA12 (Nylon) - Selektives Lasersintern', 
      volume: 'Kleinserie (10 - 50 Stück)', 
      tolerance: 'Präzision (± 0.05mm)',
      qa: 'Optischer 3D-Scan Abgleich',
      trowalisieren: true,
      helicoil: false,
      lackierung: true,
      shipping: 'Express (48 Stunden)',
      fileName: 'GT_AIR_FLOW_V4.STEP',
      fileSize: '42.3 MB',
      date: '22.06.2026', 
      price: '1.240,00 €',
      status: 'Im Druck'
    },
    { 
      id: 'PRJ-8819', 
      name: 'Bremssattel-Dummy (Mockup)', 
      material: 'Resin (Tough) - SLA', 
      volume: 'Einzelstück (Prototyp)', 
      tolerance: 'Standard (ISO 2768-m)',
      qa: 'Standard-Sichtprüfung',
      trowalisieren: false,
      helicoil: false,
      lackierung: false,
      shipping: 'Standard (4-6 Werktage)',
      fileName: 'CALIPER_MOCKUP_XE.STL',
      fileSize: '18.9 MB',
      date: '20.06.2026', 
      price: '85,50 €',
      status: 'Versandbereit'
    },
    { 
      id: 'PRJ-8790', 
      name: 'Halterung eATS-Modul', 
      material: 'Aluminium (AlSi10Mg) - SLM', 
      volume: 'Einzelstück (Prototyp)', 
      tolerance: 'Präzision (± 0.05mm)',
      qa: 'Erstmusterprüfbericht (EMPB)',
      trowalisieren: true,
      helicoil: true,
      lackierung: false,
      shipping: 'Standard (4-6 Werktage)',
      fileName: 'EATS_BRACKET_REAR.STEP',
      fileSize: '112.5 MB',
      date: '15.05.2026', 
      price: '320,00 €',
      status: 'Abgeschlossen'
    },
  ]);

  // Shop-Produkte (Standard-Sortiment)
  const shopItems = [
    { id: 'SHP-01', name: 'Helicoil-Gewindeeinsatz Set', desc: 'M3 bis M8 Edelstahleinsätze für 3D-Druckteile. Inkl. Eindrehwerkzeug.', price: '24,90 €' },
    { id: 'SHP-02', name: 'ISO-Norm Prüfwürfel (AlSi10Mg)', desc: 'Kalibrierter Referenzwürfel zur optischen Überprüfung von Messmaschinen.', price: '45,00 €' },
    { id: 'SHP-03', name: 'High-Temp Masking Tape', desc: 'Hitzebeständiges Abklebeband für eigene Lackier- und Sandstrahlarbeiten.', price: '12,50 €' },
    { id: 'SHP-04', name: 'Standard-Befestigungs-Kit GT', desc: 'Sortiment an hochfesten Titanschrauben für automotive Prototypen.', price: '89,00 €' },
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
  };

  // --- UI-KOMPONENTEN ---
  const Header = () => (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm font-medium tracking-wide text-zinc-900">
        <div className="cursor-pointer font-bold tracking-widest flex items-center gap-2" onClick={() => setCurrentView('home')}>
          <div className="w-3 h-3 bg-zinc-900"></div>
          AERO // PRINT
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          <button onClick={() => setCurrentView('home')} className={`hover:text-zinc-500 transition-colors ${currentView === 'home' ? 'border-b-2 border-zinc-900' : ''}`}>Start</button>
          <button onClick={() => setCurrentView('maschinen')} className={`hover:text-zinc-500 transition-colors ${currentView === 'maschinen' ? 'border-b-2 border-zinc-900' : ''}`}>Maschinenpark</button>
          <button onClick={() => setCurrentView('shop')} className={`hover:text-zinc-500 transition-colors ${currentView === 'shop' ? 'border-b-2 border-zinc-900' : ''}`}>Shop</button>
          <button onClick={() => setCurrentView('support')} className={`hover:text-zinc-500 transition-colors ${currentView === 'support' ? 'border-b-2 border-zinc-900' : ''}`}>Support</button>
          
          <div className="w-px h-6 bg-zinc-200 mx-2"></div>
          
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => {
                  setConfigurator({ fileName: '', fileSize: '', volume: 'Einzelstück (Prototyp)', material: 'PA12 (Nylon) - Selektives Lasersintern', tolerance: 'Standard (ISO 2768-m)', qa: 'Standard-Sichtprüfung', trowalisieren: false, helicoil: false, lackierung: false, shipping: 'Standard (4-6 Werktage)', addonExpressDeburr: false, addonDrawingCheck: false });
                  setCurrentView('upload');
                }} 
                className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
              >
                + Neuer Auftrag
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 transition-colors"
              >
                Kundenportal
              </button>
              <button onClick={() => setIsLoggedIn(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">Logout</button>
            </>
          ) : (
            <button onClick={() => setIsLoggedIn(true)} className="bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 transition-colors">Kunden-Login</button>
          )}
        </nav>
      </div>
    </header>
  );

  // --- VIEWS ---

  const ViewHome = () => (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-3xl mb-32">
        <div className="inline-block border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 mb-6">
          High-Precision Prototyping // Industry Standard
        </div>
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-zinc-900 mb-6 leading-tight">
          Ihre Produktidee. <br />
          <span className="font-semibold">Physische Präzision.</span>
        </h1>
        <p className="text-lg text-zinc-500 mb-10 leading-relaxed font-light max-w-2xl">
          Industrielle additive Fertigung für anspruchsvolle Entwickler und Konstrukteure. Laden Sie Ihre CAD-Daten hoch und transformieren Sie Ideen in maßhaltige, funktionale Modelle.
        </p>
        <div className="flex space-x-4">
          <button onClick={() => { setIsLoggedIn(true); setCurrentView('upload'); }} className="bg-zinc-900 text-white px-8 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Fertigung starten
          </button>
          <button onClick={() => setCurrentView('maschinen')} className="border border-zinc-300 text-zinc-900 px-8 py-4 text-sm font-medium hover:bg-zinc-50 transition-colors">
            Unser Maschinenpark
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-16 mb-16">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-8">Laufende Produktionen & Referenzen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-zinc-100 p-6 bg-zinc-50">
            <span className="text-xs font-mono text-zinc-400">REF-0941</span>
            <h4 className="text-base font-semibold mt-2 mb-1">eATS-Gehäusekomponenten</h4>
            <p className="text-xs text-zinc-500 mb-4">Verfahren: SLS // Material: PA12</p>
            <p className="text-sm text-zinc-600">Funktionale Strömungskanäle und Prototypengehäuse für elektrische Antriebsstränge im Automotive-Sektor.</p>
          </div>
          <div className="border border-zinc-100 p-6 bg-zinc-50">
            <span className="text-xs font-mono text-zinc-400">REF-1102</span>
            <h4 className="text-base font-semibold mt-2 mb-1">Präzisions-Spannbacken</h4>
            <p className="text-xs text-zinc-500 mb-4">Verfahren: SLM // Material: Edelstahl</p>
            <p className="text-sm text-zinc-600">Werkzeugeinsätze für automatisierte Fertigungslinien mit integrierten Kühlstrukturen und hoher Härte.</p>
          </div>
          <div className="border border-zinc-100 p-6 bg-zinc-50">
            <span className="text-xs font-mono text-zinc-400">REF-8830</span>
            <h4 className="text-base font-semibold mt-2 mb-1">Ergonomie-Mockups GT</h4>
            <p className="text-xs text-zinc-500 mb-4">Verfahren: SLA // Material: Resin Tough</p>
            <p className="text-sm text-zinc-600">Hochauflösende Interieur-Komponenten zur haptischen Validierung vor der finalen Werkzeugfreigabe.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewMaschinen = () => (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-light tracking-tight text-zinc-900 mb-12">Anlagen & Engineering</h2>
      
      <div className="space-y-6 mb-24">
        <h3 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Industrieller Maschinenpark</h3>
        <div className="border border-zinc-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div>
            <span className="font-mono text-xs bg-zinc-100 px-2 py-1 text-zinc-600">Anlage 01 // SLM Metall-Laserschmelzen</span>
            <h3 className="text-xl font-semibold mt-3">EOS M 290</h3>
            <p className="text-sm text-zinc-500 max-w-2xl mt-2 leading-relaxed">Spezialisiert auf hochpräzise Metallkomponenten aus Aluminium (AlSi10Mg) und Edelstahl. Schichtstärken bis zu 20 µm garantieren maximale mechanische Belastbarkeit für Strukturbauteile.</p>
          </div>
          <div className="text-sm font-mono border-l border-zinc-200 pl-6 text-zinc-500 min-w-[200px]">
            <p className="text-xs text-zinc-400 mb-1">Maximaler Bauraum:</p>
            250 x 250 x 325 mm
          </div>
        </div>
        <div className="border border-zinc-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div>
            <span className="font-mono text-xs bg-zinc-100 px-2 py-1 text-zinc-600">Anlage 02 // SLS Selektives Lasersintern</span>
            <h3 className="text-xl font-semibold mt-3">Formlabs Fuse 1+</h3>
            <p className="text-sm text-zinc-500 max-w-2xl mt-2 leading-relaxed">Perfekt für komplexe Geometrien und Kleinserien ohne Stützstrukturen. Verarbeitet industrielles PA12-Nylon für zähe, robuste und langlebige Funktionsteile.</p>
          </div>
          <div className="text-sm font-mono border-l border-zinc-200 pl-6 text-zinc-500 min-w-[200px]">
            <p className="text-xs text-zinc-400 mb-1">Maximaler Bauraum:</p>
            165 x 165 x 300 mm
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-16 bg-zinc-50 p-12">
        <div className="max-w-3xl">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Der Kopf hinter AERO // PRINT</h2>
          <h3 className="text-3xl font-semibold text-zinc-900 mb-6">Deen – Head of Engineering</h3>
          <p className="text-base text-zinc-600 leading-relaxed font-light mb-4">
            Als spezialisierter Fertigungsexperte im Bereich industrieller Prototypensysteme gründete Deen AERO // PRINT mit einer klaren Prämisse: <strong className="font-medium text-zinc-900">Taktzeit schlägt Perfektionismus im Prozess, während das finale Bauteil absolute Präzision aufweisen muss.</strong>
          </p>
          <p className="text-base text-zinc-600 leading-relaxed font-light">
            Mit fundierter technischer Expertise in der additiven Fertigung komplexer Systemkomponenten überführen wir digitale CAD-Daten kompromisslos in hochbelastbare Modelle. Ob für Vorrichtungsbau, Automotive-Testing oder Sondermaschinenbau – bei Deen laufen die Anlagen streng nach Industriestandard.
          </p>
        </div>
      </div>
    </div>
  );

  const ViewShop = () => (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">Standard-Teile & Zubehör</h2>
        <p className="text-zinc-500">Katalog-Artikel für Ihre eigene Fertigung und Montage sofort ab Lager lieferbar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopItems.map(item => (
          <div key={item.id} className="border border-zinc-200 p-6 flex flex-col justify-between bg-white hover:border-zinc-400 transition-colors">
            <div>
              <span className="font-mono text-xs text-zinc-400 block mb-2">{item.id}</span>
              <h4 className="text-sm font-semibold text-zinc-900 mb-2 leading-snug">{item.name}</h4>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">{item.desc}</p>
            </div>
            <div>
              <div className="text-lg font-mono text-zinc-900 mb-4">{item.price}</div>
              <button 
                onClick={() => alert(`${item.name} wurde zum Warenkorb hinzugefügt.`)}
                className="w-full border border-zinc-900 text-zinc-900 px-4 py-2 text-xs font-medium hover:bg-zinc-900 hover:text-white transition-colors"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-900">Kundenportal // Auftragsübersicht</h2>
          <p className="text-zinc-500 mt-2">Klicken Sie in der Liste auf "Details", um den Fertigungsbericht und die Qualitätsdaten einzusehen.</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto border border-zinc-200">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="bg-zinc-50 text-zinc-900 font-medium border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Projektname</th>
              <th className="px-6 py-4">Verfahren</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4">Wert (Netto)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-zinc-900">{order.id}</td>
                <td className="px-6 py-4 font-medium text-zinc-900">{order.name}</td>
                <td className="px-6 py-4 text-xs">{order.material.split('-')[0]}</td>
                <td className="px-6 py-4 text-zinc-500">{order.date}</td>
                <td className="px-6 py-4 font-mono">{order.price}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-medium border ${
                    order.status === 'Im Druck' ? 'border-amber-200 text-amber-700 bg-amber-50' : 
                    order.status === 'Versandbereit' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                    'border-zinc-200 text-zinc-600 bg-zinc-50'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                   <button 
                     onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} 
                     className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline"
                   >
                     Details ansehen
                   </button>
                   <button 
                     onClick={() => handleReOrder(order)} 
                     className="text-xs font-semibold bg-zinc-900 text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors"
                   >
                     Re-Order
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ViewOrderDetail = () => {
    if (!selectedOrder) return null;
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={() => setCurrentView('dashboard')} className="text-xs uppercase font-semibold text-zinc-400 hover:text-zinc-900 mb-6 flex items-center gap-2">
          ← Zurück zur Auftragsübersicht
        </button>
        <div className="border border-zinc-200 p-8 bg-white shadow-sm">
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
            <div>
              <span className="font-mono text-xs text-zinc-400">{selectedOrder.id}</span>
              <h2 className="text-3xl font-bold text-zinc-900 mt-1">{selectedOrder.name}</h2>
            </div>
            <span className="border border-zinc-900 px-4 py-2 text-xs uppercase font-bold text-zinc-900 bg-zinc-50">{selectedOrder.status}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm mb-12">
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Fertigungsparameter</h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-zinc-500">Volumen:</span> <span className="font-medium text-zinc-900">{selectedOrder.volume}</span>
                <span className="text-zinc-500">Material:</span> <span className="font-medium text-zinc-900">{selectedOrder.material}</span>
                <span className="text-zinc-500">Toleranz:</span> <span className="font-medium text-zinc-900">{selectedOrder.tolerance}</span>
                <span className="text-zinc-500">QS-Stufe:</span> <span className="font-medium text-zinc-900">{selectedOrder.qa}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Datensatz & Logistik</h4>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-zinc-500">CAD-Datei:</span> <span className="font-mono text-xs text-zinc-900">{selectedOrder.fileName}</span>
                <span className="text-zinc-500">Dateigröße:</span> <span className="font-medium text-zinc-900">{selectedOrder.fileSize}</span>
                <span className="text-zinc-500">Eingangsdatum:</span> <span className="font-medium text-zinc-900">{selectedOrder.date}</span>
                <span className="text-zinc-500">Versandart:</span> <span className="font-medium text-zinc-900">{selectedOrder.shipping}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6 flex flex-col md:flex-row justify-between items-center bg-zinc-50 p-6 font-mono">
            <div className="mb-4 md:mb-0">
              <span className="text-xs font-sans font-medium text-zinc-500 block uppercase tracking-wider mb-1">Kalkulierter Gesamtwert</span>
              <span className="text-3xl font-light text-zinc-900">{selectedOrder.price}</span>
            </div>
            <button onClick={() => handleReOrder(selectedOrder)} className="bg-emerald-700 font-sans text-white text-sm font-semibold px-8 py-4 hover:bg-emerald-800 transition-colors">
              Diesen Datensatz direkt Nachbestellen
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewUpload = () => (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">Fertigung konfigurieren</h2>
        <p className="text-zinc-500">Laden Sie Ihre CAD-Daten hoch. Das System ermittelt den Festpreis basierend auf Ihren Parametern.</p>
      </div>
      
      {/* CAD Upload Area */}
      <div className="border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center hover:bg-zinc-100 transition-colors cursor-pointer mb-10">
        {configurator.fileName ? (
          <div>
            <div className="text-emerald-600 mb-2 font-mono text-sm">[ DATENSATZ GELADEN ]</div>
            <p className="text-base font-mono font-bold text-zinc-900">{configurator.fileName}</p>
            <p className="text-xs text-zinc-500 mt-1">{configurator.fileSize || 'Geometrie automatisch verifiziert'}</p>
          </div>
        ) : (
          <div>
            <div className="text-zinc-400 mb-4 font-mono text-4xl">[ CAD ]</div>
            <p className="text-sm font-medium text-zinc-900">CAD-Dateien ablegen oder durchsuchen</p>
            <p className="text-xs text-zinc-500 mt-2">.STEP, .STL, .IGES (Max 500MB)</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-b border-zinc-200 pb-10 mb-10">
        {/* Sektion: Spezifikation */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">1. Basis-Spezifikation</h3>
          <div>
             <label className="block text-xs font-semibold text-zinc-700 mb-2">Produktionsvolumen</label>
             <select value={configurator.volume} onChange={(e) => setConfigurator({...configurator, volume: e.target.value})} className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
               <option>Einzelstück (Prototyp)</option>
               <option>Kleinserie (10 - 50 Stück)</option>
               <option>Vorserie (50 - 500 Stück)</option>
               <option>Großproduktion (500+ Stück)</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-zinc-700 mb-2">Material / Verfahren</label>
             <select value={configurator.material} onChange={(e) => setConfigurator({...configurator, material: e.target.value})} className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
               <option>PA12 (Nylon) - Selektives Lasersintern</option>
               <option>Resin (Tough) - SLA</option>
               <option>Aluminium (AlSi10Mg) - SLM</option>
               <option>Edelstahl (316L) - SLM</option>
             </select>
          </div>
        </div>

        {/* Sektion: Qualität */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">2. Qualität & Toleranz</h3>
          <div>
             <label className="block text-xs font-semibold text-zinc-700 mb-2">Toleranzklasse</label>
             <select value={configurator.tolerance} onChange={(e) => setConfigurator({...configurator, tolerance: e.target.value})} className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
               <option>Standard (ISO 2768-m)</option>
               <option>Präzision (± 0.05mm)</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-zinc-700 mb-2">Qualitätssicherung (QS)</label>
             <select value={configurator.qa} onChange={(e) => setConfigurator({...configurator, qa: e.target.value})} className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
               <option>Standard-Sichtprüfung</option>
               <option>Erstmusterprüfbericht (EMPB)</option>
               <option>Optischer 3D-Scan Abgleich</option>
             </select>
          </div>
        </div>

        {/* Sektion: Post-Processing */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">3. Nachbearbeitung</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 text-sm text-zinc-700 cursor-pointer p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200">
              <input type="checkbox" checked={configurator.trowalisieren} onChange={(e) => setConfigurator({...configurator, trowalisieren: e.target.checked})} className="w-4 h-4 rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
              <span>Gleitschleifen (Trowalisieren)</span>
            </label>
            <label className="flex items-center space-x-3 text-sm text-zinc-700 cursor-pointer p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200">
              <input type="checkbox" checked={configurator.helicoil} onChange={(e) => setConfigurator({...configurator, helicoil: e.target.checked})} className="w-4 h-4 rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
              <span>Gewindeeinsätze setzen (Helicoil)</span>
            </label>
            <label className="flex items-center space-x-3 text-sm text-zinc-700 cursor-pointer p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200">
              <input type="checkbox" checked={configurator.lackierung} onChange={(e) => setConfigurator({...configurator, lackierung: e.target.checked})} className="w-4 h-4 rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
              <span>Lackierung (RAL nach Wahl)</span>
            </label>
          </div>
        </div>

        {/* Sektion: Add-ons & Zubehör (NEU) */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 border-b border-emerald-100 pb-2">4. Empfohlene Add-ons</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm text-zinc-700 cursor-pointer p-2 bg-emerald-50 border border-emerald-100 hover:border-emerald-300">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={configurator.addonExpressDeburr} onChange={(e) => setConfigurator({...configurator, addonExpressDeburr: e.target.checked})} className="w-4 h-4 rounded-none border-emerald-300 text-emerald-600 focus:ring-emerald-600" />
                <span className="font-medium text-emerald-900">Manuelle Express-Entgratung</span>
              </div>
              <span className="text-xs font-mono text-emerald-700">+ 15,00 €</span>
            </label>
            <label className="flex items-center justify-between text-sm text-zinc-700 cursor-pointer p-2 bg-emerald-50 border border-emerald-100 hover:border-emerald-300">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={configurator.addonDrawingCheck} onChange={(e) => setConfigurator({...configurator, addonDrawingCheck: e.target.checked})} className="w-4 h-4 rounded-none border-emerald-300 text-emerald-600 focus:ring-emerald-600" />
                <span className="font-medium text-emerald-900">2D-Zeichnungsabgleich (Sicherheit)</span>
              </div>
              <span className="text-xs font-mono text-emerald-700">+ 25,00 €</span>
            </label>
            <div className="p-3 border border-zinc-200 mt-2 bg-white">
              <p className="text-xs text-zinc-500 mb-2">Benötigen Sie Montagematerial?</p>
              <button onClick={() => setCurrentView('shop')} className="text-xs font-medium text-zinc-900 underline hover:text-emerald-700">Zum Zubehör-Shop →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Kalkulation & Checkout */}
      <div className="bg-zinc-900 text-white p-8 flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="mb-6 md:mb-0 w-full md:w-auto">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1">Ermittelter Festpreis (Netto)</p>
          <p className="text-4xl font-mono text-white">
            {calculateExactPrice(configurator)}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            value={configurator.shipping} 
            onChange={(e) => setConfigurator({...configurator, shipping: e.target.value})} 
            className="border border-zinc-700 bg-zinc-800 text-white p-4 text-sm focus:outline-none focus:border-zinc-500"
          >
            <option>Standard (4-6 Werktage)</option>
            <option>Express (48 Stunden)</option>
            <option>Overnight Sprint (Höchste Prio)</option>
          </select>
          <button 
            onClick={() => {
              const newProjId = 'PRJ-' + Math.floor(Math.random() * 9000 + 1000);
              const newOrderObj = {
                id: newProjId,
                name: configurator.fileName ? configurator.fileName.replace('.STEP','').replace('.STL','') : 'Custom Order Prototyp',
                material: configurator.material, volume: configurator.volume, tolerance: configurator.tolerance, qa: configurator.qa,
                trowalisieren: configurator.trowalisieren, helicoil: configurator.helicoil, lackierung: configurator.lackierung,
                shipping: configurator.shipping, fileName: configurator.fileName || 'MANUAL_UPLOAD.STEP', fileSize: configurator.fileSize || '24.0 MB',
                date: new Date().toLocaleDateString('de-DE'), price: calculateExactPrice(configurator), status: 'CAD-Prüfung'
              };
              setOrders([newOrderObj, ...orders]);
              alert('Auftrag übermittelt! Das Projekt wurde Ihrem Kundenportal hinzugefügt.');
              setCurrentView('dashboard');
            }}
            className="bg-emerald-600 text-white px-10 py-4 text-sm font-bold tracking-wide hover:bg-emerald-500 transition-colors"
          >
            Fertigung beauftragen
          </button>
        </div>
      </div>
    </div>
  );

  const ViewSupport = () => (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-light tracking-tight text-zinc-900 mb-12">Engineering Support & Kontakt</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
        <div className="bg-zinc-50 p-8 border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-3">Direkte Hotline</h3>
          <p className="text-sm text-zinc-600 mb-4">Technischer Support bei Konstruktionsfragen oder Toleranzabweichungen.</p>
          <p className="text-2xl font-mono text-zinc-900">+49 (0) 711 - 555 019 4</p>
          <p className="text-xs text-zinc-500 mt-2 font-medium">Mo-Fr: 08:00 - 17:00 Uhr</p>
        </div>
        <div className="bg-zinc-50 p-8 border border-zinc-200">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-3">Anlagen-Standort</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            AERO // PRINT<br />
            Industriestraße 42<br />
            70771 Leinfelden-Echterdingen<br />
            Germany
          </p>
        </div>
      </div>
      <div className="border-t border-zinc-200 pt-16">
        <h3 className="text-2xl font-semibold text-zinc-900 mb-3">Sonderanfragen & Lastenhefte</h3>
        <p className="text-sm text-zinc-500 mb-8 max-w-2xl">Sie planen eine Großserienfertigung oder benötigen spezielle Materialprüfungen? Senden Sie uns Ihre Spezifikationen verschlüsselt über das Engineering-Formular.</p>
        
        <div className="space-y-5 max-w-2xl bg-white border border-zinc-200 p-8">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-700 mb-2">Name / Projektleiter</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-zinc-700 mb-2">Unternehmen</label>
              <input type="text" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-700 mb-2">E-Mail Adresse</label>
            <input type="email" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-zinc-700 mb-2">Spezifikationen / Nachricht</label>
            <textarea rows="5" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-zinc-50 resize-none"></textarea>
          </div>
          <button onClick={() => alert('Anfrage übermittelt. Das Engineering-Team prüft Ihre Parameter.')} className="bg-zinc-900 text-white px-8 py-4 text-sm font-bold hover:bg-zinc-800 transition-colors w-full">
            Daten übermitteln
          </button>
        </div>
      </div>
    </div>
  );

  // --- RENDER LOGIK ---
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 flex flex-col">
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
      <footer className="border-t border-zinc-200 py-10 text-center text-xs text-zinc-500 mt-auto bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <span className="font-medium">© 2026 AERO // PRINT. Industrielle Prototypensysteme.</span>
          <div className="space-x-8 mt-4 md:mt-0 font-medium">
            <span className="hover:text-zinc-900 cursor-pointer">Impressum</span>
            <span className="hover:text-zinc-900 cursor-pointer">Datenschutz</span>
            <span className="hover:text-zinc-900 cursor-pointer">AGB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
