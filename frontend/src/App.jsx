import { useState } from 'react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Konfigurator-State (Standardwerte für ein leeres Formular)
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
    shipping: 'Standard (4-6 Werktage)'
  });

  // Industrielle Auftragsdaten im Kundenportal
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
      price: '1.240,00 €' 
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
      price: '85,50 €' 
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
      price: '320,00 €' 
    },
  ]);

  // --- LOGISCHE PREISKALKULATION (Feste Tarife statt Zufallswerten) ---
  const calculateExactPrice = (config) => {
    let basePrice = 50.00;

    // 1. Produktionsvolumen
    if (config.volume.includes('Kleinserie')) basePrice = 650.00;
    else if (config.volume.includes('Vorserie')) basePrice = 2450.00;
    else if (config.volume.includes('Großproduktion')) basePrice = 7800.00;

    // 2. Material-Aufschläge
    if (config.material.includes('Resin')) basePrice += 35.50;
    else if (config.material.includes('Aluminium')) basePrice += 220.00;
    else if (config.material.includes('Edelstahl')) basePrice += 310.00;

    // 3. Toleranzklasse
    if (config.tolerance.includes('Präzision')) basePrice += 65.00;

    // 4. Qualitätssicherung
    if (config.qa.includes('Erstmusterprüfbericht')) basePrice += 120.00;
    else if (config.qa.includes('3D-Scan')) basePrice += 180.00;

    // 5. Nachbearbeitung (Post-Processing)
    if (config.trowalisieren) basePrice += 45.00;
    if (config.helicoil) basePrice += 60.00;
    if (config.lackierung) basePrice += 110.00;

    // 6. Logistik & Versandgeschwindigkeit
    if (config.shipping.includes('Express')) basePrice += 45.00;
    else if (config.shipping.includes('Overnight')) basePrice += 140.00;

    return basePrice.toFixed(2).replace('.', ',') + ' €';
  };

  // --- RE-ORDER STRATEGIE (Vorausfüllen mit Dummy-Daten) ---
  const handleReOrder = (order) => {
    setConfigurator({
      fileName: `RE_` + order.fileName,
      fileSize: order.fileSize,
      volume: order.volume,
      material: order.material,
      tolerance: order.tolerance,
      qa: order.qa,
      trowalisieren: order.trowalisieren,
      helicoil: order.helicoil,
      lackierung: order.lackierung,
      shipping: order.shipping
    });
    setCurrentView('upload');
  };

  // --- UI-KOMPONENTEN ---
  const Header = () => (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-sm font-medium tracking-wide text-zinc-900">
        <div className="cursor-pointer font-bold tracking-widest flex items-center gap-2" onClick={() => setCurrentView('home')}>
          <div className="w-3 h-3 bg-zinc-900"></div>
          AERO // PRINT
        </div>
        <nav className="flex space-x-8 items-center">
          <button onClick={() => setCurrentView('home')} className="hover:text-zinc-500 transition-colors">Start</button>
          <button onClick={() => setCurrentView('support')} className="hover:text-zinc-500 transition-colors">Support & Kontakt</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => {
                setConfigurator({
                  fileName: '', fileSize: '', volume: 'Einzelstück (Prototyp)',
                  material: 'PA12 (Nylon) - Selektives Lasersintern', tolerance: 'Standard (ISO 2768-m)',
                  qa: 'Standard-Sichtprüfung', trowalisieren: false, helicoil: false, lackierung: false, shipping: 'Standard (4-6 Werktage)'
                });
                setCurrentView('upload');
              }} className="hover:text-zinc-500 transition-colors">Neuer Auftrag</button>
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-zinc-500 transition-colors">Kundenportal</button>
              <button onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }} className="bg-zinc-100 px-4 py-2 hover:bg-zinc-200 transition-colors">Logout</button>
            </>
          ) : (
            <button onClick={() => setCurrentView('login')} className="bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 transition-colors">Kunden-Login</button>
          )}
        </nav>
      </div>
    </header>
  );

  // --- VIEWS ---

  const ViewHome = () => (
    <div className="max-w-6xl mx-auto px-6 py-24">
      {/* Hero Section */}
      <div className="max-w-3xl mb-32">
        <div className="inline-block border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 mb-6">
          High-Precision Prototyping // Industry Standard
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-zinc-900 mb-6 leading-tight">
          Ihre Produktidee. <br />
          <span className="font-semibold">Physische Präzision.</span>
        </h1>
        <p className="text-lg text-zinc-500 mb-10 leading-relaxed font-light max-w-2xl">
          Industrielle additive Fertigung für anspruchsvolle Entwickler und Konstrukteure. Laden Sie Ihre CAD-Daten hoch und transformieren Sie Ideen in maßhaltige, funktionale Modelle.
        </p>
        <div className="flex space-x-4">
          <button onClick={() => isLoggedIn ? setCurrentView('upload') : setCurrentView('login')} className="bg-zinc-900 text-white px-8 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Konfigurator starten
          </button>
          <a href="#anlagen" className="border border-zinc-300 flex items-center justify-center text-zinc-900 px-8 py-4 text-sm font-medium hover:bg-zinc-50 transition-colors">
            Maschinenpark ansehen
          </a>
        </div>
      </div>

      {/* NEU: Bereits gefertigte Projekte / Laufserien */}
      <div className="border-t border-zinc-200 pt-16 mb-32">
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

      {/* NEU: Maschinenpark mit Beispielmaschinen */}
      <div id="anlagen" className="border-t border-zinc-200 pt-16 mb-32">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-8">Industrieller Maschinenpark</h2>
        <div className="space-y-6">
          <div className="border border-zinc-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <div>
              <span className="font-mono text-xs bg-zinc-100 px-2 py-1 text-zinc-600">Anlage 01 // SLM Metall-Laserschmelzen</span>
              <h3 className="text-lg font-semibold mt-2">EOS M 290</h3>
              <p className="text-sm text-zinc-500 max-w-2xl mt-1">Spezialisiert auf hochpräzise Metallkomponenten aus Aluminium (AlSi10Mg) und Edelstahl. Schichtstärken bis zu 20 µm für maximale mechanische Belastung.</p>
            </div>
            <div className="text-xs font-mono border-l border-zinc-200 pl-4 text-zinc-400">Bauraum: 250 x 250 x 325 mm</div>
          </div>
          <div className="border border-zinc-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <div>
              <span className="font-mono text-xs bg-zinc-100 px-2 py-1 text-zinc-600">Anlage 02 // SLS Selektives Lasersintern</span>
              <h3 className="text-lg font-semibold mt-2">Formlabs Fuse 1+</h3>
              <p className="text-sm text-zinc-500 max-w-2xl mt-1">Perfekt für komplexe Geometrien und Kleinserien ohne Stützstrukturen. Verarbeitet industrielles PA12-Nylon für robuste Funktionsteile.</p>
            </div>
            <div className="text-xs font-mono border-l border-zinc-200 pl-4 text-zinc-400">Bauraum: 165 x 165 x 300 mm</div>
          </div>
        </div>
      </div>

      {/* NEU: Beschreibung des Betreibers Deen */}
      <div className="border-t border-zinc-200 pt-16 bg-zinc-50 p-8">
        <div className="max-w-2xl">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-4">Das Engineering hinter AERO // PRINT</h2>
          <h3 className="text-2xl font-semibold text-zinc-900 mb-4">Über den Betreiber Deen</h3>
          <p className="text-sm text-zinc-600 leading-relaxed font-light">
            Als spezialisierter Fertigungsexperte im Bereich industrieller Prototypensysteme gründete Deen AERO // PRINT mit einer klaren Prämisse: Taktzeit schlägt Perfektionismus im Entwicklungsprozess, während das finale Bauteil absolute Präzision aufweisen muss. Mit fundierter technischer Expertise in der additiven Fertigung komplexer Systemkomponenten überführen wir digitale CAD-Daten kompromisslos in hochbelastbare Modelle für den Maschinenbau und Automotive-Sektor.
          </p>
        </div>
      </div>
    </div>
  );

  const ViewLogin = () => (
    <div className="max-w-md mx-auto mt-24 border border-zinc-200 p-8 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Kundenportal Zugang</h2>
      <p className="text-sm text-zinc-500 mb-8">Melden Sie sich an, um Ihre CAD-Projekte einzusehen.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">E-Mail Adresse</label>
          <input type="email" placeholder="engineering@unternehmen.de" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Passwort</label>
          <input type="password" placeholder="••••••••" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900" />
        </div>
        <button onClick={() => { setIsLoggedIn(true); setCurrentView('dashboard'); }} className="w-full bg-zinc-900 text-white p-3 text-sm font-medium hover:bg-zinc-800 transition-colors mt-4">
          Anmelden
        </button>
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-900">Kundenportal</h2>
          <p className="text-zinc-500 mt-2">Klicken Sie auf ein Projekt, um detaillierte Qualitäts- und Fertigungsberichte einzusehen.</p>
        </div>
        <button onClick={() => {
          setConfigurator({
            fileName: '', fileSize: '', volume: 'Einzelstück (Prototyp)',
            material: 'PA12 (Nylon) - Selektives Lasersintern', tolerance: 'Standard (ISO 2768-m)',
            qa: 'Standard-Sichtprüfung', trowalisieren: false, helicoil: false, lackierung: false, shipping: 'Standard (4-6 Werktage)'
          });
          setCurrentView('upload');
        }} className="bg-zinc-900 text-white px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors">
          + Neuer Auftrag
        </button>
      </div>

      <div className="w-full overflow-x-auto border border-zinc-200">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="bg-zinc-50 text-zinc-900 font-medium border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Bauteil / Projekt</th>
              <th className="px-6 py-4">Verfahren / Material</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4">Wert (Netto)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer">
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 font-mono text-xs text-zinc-900">{order.id}</td>
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 font-medium text-zinc-900">{order.name}</td>
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 text-xs">{order.material}</td>
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 text-zinc-500">{order.date}</td>
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 font-mono">{order.price}</td>
                <td onClick={() => { setSelectedOrder(order); setCurrentView('order-detail'); }} className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-medium border ${
                    order.status === 'Im Druck' ? 'border-amber-200 text-amber-700 bg-amber-50' : 
                    order.status === 'Versandbereit' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                    'border-zinc-200 text-zinc-600 bg-zinc-50'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={(e) => { e.stopPropagation(); handleReOrder(order); }} className="text-xs font-semibold bg-zinc-900 text-white px-3 py-1.5 hover:bg-zinc-800 transition-colors">
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

  // NEU: Detailansicht für die Aufträge im Kundenportal
  const ViewOrderDetail = () => {
    if (!selectedOrder) return null;
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => setCurrentView('dashboard')} className="text-xs uppercase font-semibold text-zinc-400 hover:text-zinc-900 mb-6 flex items-center gap-2">
          ← Zurück zum Kundenportal
        </button>
        <div className="border border-zinc-200 p-8 bg-white">
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
            <div>
              <span className="font-mono text-xs text-zinc-400">{selectedOrder.id}</span>
              <h2 className="text-2xl font-bold text-zinc-900 mt-1">{selectedOrder.name}</h2>
            </div>
            <span className="border border-zinc-900 px-3 py-1 text-xs uppercase font-medium">{selectedOrder.status}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-8">
            <div>
              <h4 className="text-xs uppercase font-semibold text-zinc-400 mb-2">Konfigurationsdaten</h4>
              <p className="mb-1"><span className="text-zinc-500">Volumen:</span> {selectedOrder.volume}</p>
              <p className="mb-1"><span className="text-zinc-500">Material:</span> {selectedOrder.material}</p>
              <p className="mb-1"><span className="text-zinc-500">Toleranz:</span> {selectedOrder.tolerance}</p>
              <p><span className="text-zinc-500">QS-Stufe:</span> {selectedOrder.qa}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase font-semibold text-zinc-400 mb-2">Dateispezifikation</h4>
              <p className="mb-1 font-mono text-xs"><span className="text-zinc-500 font-sans">CAD-Datensatz:</span> {selectedOrder.fileName}</p>
              <p className="mb-1"><span className="text-zinc-500">Dateigröße:</span> {selectedOrder.fileSize}</p>
              <p className="mb-1"><span className="text-zinc-500">Eingangsdatum:</span> {selectedOrder.date}</p>
              <p><span className="text-zinc-500">Logistik:</span> {selectedOrder.shipping}</p>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6 flex justify-between items-center bg-zinc-50 p-4 font-mono">
            <div>
              <span className="text-xs font-sans text-zinc-400 block">Kalkulierter Gesamtwert</span>
              <span className="text-xl font-bold text-zinc-900">{selectedOrder.price}</span>
            </div>
            <button onClick={() => handleReOrder(selectedOrder)} className="bg-zinc-900 font-sans text-white text-sm font-medium px-6 py-3 hover:bg-zinc-800 transition-colors">
              Diesen Datensatz erneut fertigen (Re-Order)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ViewUpload = () => {
    // Falls Re-Order stattgefunden hat, ist fileName bereits mit Dummy-Daten gefüllt
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-zinc-900 mb-2">Produktions-Konfigurator</h2>
        <p className="text-zinc-500 mb-8">Spezifizieren Sie Ihr Bauteil. Das System ermittelt den Festpreis basierend auf Ihren Toleranz- und Materialparametern.</p>
        
        {/* Sektion 1: Upload Status */}
        <div className="border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center hover:bg-zinc-100 transition-colors cursor-pointer mb-8">
          {configurator.fileName ? (
            <div>
              <div className="text-emerald-600 mb-2 font-mono text-sm">[ GELADEN ]</div>
              <p className="text-sm font-mono font-bold text-zinc-900">{configurator.fileName}</p>
              <p className="text-xs text-zinc-500 mt-1">{configurator.fileSize || 'Automatisch verifiziert'}</p>
            </div>
          ) : (
            <div>
              <div className="text-zinc-400 mb-4 font-mono text-4xl">[ CAD ]</div>
              <p className="text-sm font-medium text-zinc-900">CAD-Dateien ablegen oder durchsuchen</p>
              <p className="text-xs text-zinc-500 mt-2">.STEP, .STL, .IGES (Max 500MB)</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-zinc-200 pb-8">
          {/* Sektion 2: Material & Menge */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">1. Basis-Spezifikation</h3>
            
            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Produktionsvolumen</label>
               <select 
                 value={configurator.volume}
                 onChange={(e) => setConfigurator({...configurator, volume: e.target.value})}
                 className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white"
               >
                 <option>Einzelstück (Prototyp)</option>
                 <option>Kleinserie (10 - 50 Stück)</option>
                 <option>Vorserie (50 - 500 Stück)</option>
                 <option>Großproduktion (500+ Stück)</option>
               </select>
            </div>

            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Material / Verfahren</label>
               <select 
                 value={configurator.material}
                 onChange={(e) => setConfigurator({...configurator, material: e.target.value})}
                 className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white"
               >
                 <option>PA12 (Nylon) - Selektives Lasersintern</option>
                 <option>Resin (Tough) - SLA</option>
                 <option>Aluminium (AlSi10Mg) - SLM</option>
                 <option>Edelstahl (316L) - SLM</option>
               </select>
            </div>
          </div>

          {/* Sektion 3: Toleranzen & Qualität */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">2. Qualität & Toleranz</h3>
            
            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Toleranzklasse</label>
               <select 
                 value={configurator.tolerance}
                 onChange={(e) => setConfigurator({...configurator, tolerance: e.target.value})}
                 className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white"
               >
                 <option>Standard (ISO 2768-m)</option>
                 <option>Präzision (± 0.05mm)</option>
               </select>
            </div>

            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Qualitätssicherung (QS)</label>
               <select 
                 value={configurator.qa}
                 onChange={(e) => setConfigurator({...configurator, qa: e.target.value})}
                 className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white"
               >
                 <option>Standard-Sichtprüfung</option>
                 <option>Erstmusterprüfbericht (EMPB)</option>
                 <option>Optischer 3D-Scan Abgleich</option>
               </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sektion 4: Post-Processing */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">3. Nachbearbeitung</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-zinc-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={configurator.trowalisieren}
                  onChange={(e) => setConfigurator({...configurator, trowalisieren: e.target.checked})}
                  className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" 
                />
                <span>Gleitschleifen (Trowalisieren)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-zinc-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={configurator.helicoil}
                  onChange={(e) => setConfigurator({...configurator, helicoil: e.target.checked})}
                  className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" 
                />
                <span>Gewindeeinsätze setzen (Helicoil)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-zinc-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={configurator.lackierung}
                  onChange={(e) => setConfigurator({...configurator, lackierung: e.target.checked})}
                  className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" 
                />
                <span>Lackierung (RAL nach Wahl)</span>
              </label>
            </div>
          </div>

          {/* Sektion 5: Logistik */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">4. Logistik</h3>
            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Liefergeschwindigkeit</label>
               <select 
                 value={configurator.shipping}
                 onChange={(e) => setConfigurator({...configurator, shipping: e.target.value})}
                 className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white"
               >
                 <option>Standard (4-6 Werktage)</option>
                 <option>Express (48 Stunden)</option>
                 <option>Overnight Sprint (Höchste Priorität)</option>
               </select>
            </div>
          </div>
        </div>

        {/* Feste, mathematische Live-Kalkulation */}
        <div className="bg-zinc-50 border border-zinc-200 p-6 flex flex-col md:flex-row justify-between items-center mt-10">
          <div className="mb-4 md:mb-0">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Ermittelter Festpreis (Netto)</p>
            <p className="text-3xl font-mono text-zinc-900">
              {calculateExactPrice(configurator)}
            </p>
          </div>
          <button 
            onClick={() => {
              const newProjId = 'PRJ-' + Math.floor(Math.random() * 9000 + 1000);
              const newOrderObj = {
                id: newProjId,
                name: configurator.fileName ? configurator.fileName.replace('.STEP','').replace('.STL','') : 'Custom Order Prototyp',
                material: configurator.material,
                volume: configurator.volume,
                tolerance: configurator.tolerance,
                qa: configurator.qa,
                trowalisieren: configurator.trowalisieren,
                helicoil: configurator.helicoil,
                lackierung: configurator.lackierung,
                shipping: configurator.shipping,
                fileName: configurator.fileName || 'MANUAL_UPLOAD.STEP',
                fileSize: configurator.fileSize || '24.0 MB',
                date: new Date().toLocaleDateString('de-DE'),
                price: calculateExactPrice(configurator)
              };
              setOrders([newOrderObj, ...orders]);
              alert('Konfiguration erfolgreich übermittelt und ins Kundenportal eingepflegt.');
              setCurrentView('dashboard');
            }}
            className="bg-zinc-900 text-white px-10 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors w-full md:w-auto"
          >
            Fertigungsauftrag auslösen
          </button>
        </div>
      </div>
    );
  };

  const ViewSupport = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-zinc-900 mb-8">Technical Support & Kontakt</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Hotline</h3>
          <p className="text-sm text-zinc-600 mb-2">Direkter Support bei Konstruktionsfragen oder Toleranzabweichungen.</p>
          <p className="text-xl font-mono text-zinc-900">+49 (0) 711 - 555 019 4</p>
          <p className="text-xs text-zinc-500 mt-2">Mo-Fr: 08:00 - 17:00 Uhr</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Standort</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            AERO // PRINT<br />
            Industriestraße 42<br />
            70771 Leinfelden-Echterdingen<br />
            Germany
          </p>
        </div>
      </div>
      
      {/* NEU: Anfragen Kontaktmaske */}
      <div className="border-t border-zinc-200 pt-12">
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">Sonderanfragen & B2B-Projekte</h3>
        <p className="text-sm text-zinc-500 mb-6">Sie planen eine Großserienfertigung oder benötigen spezielle Materialprüfungen? Nutzen Sie unser verschlüsseltes Engineering-Formular.</p>
        
        <div className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Name</label>
              <input type="text" placeholder="Dr. M. Schuster" className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Unternehmen</label>
              <input type="text" placeholder="Engineering GmbH" className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">E-Mail Adresse</label>
            <input type="email" placeholder="schuster@unternehmen.de" className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Nachricht / Lastenheft-Kurztext</label>
            <textarea rows="4" placeholder="Spezifizieren Sie hier Ihre Toleranzwünsche oder abweichende Legierungen..." className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white resize-none"></textarea>
          </div>
          <button 
            onClick={() => alert('Anfrage erfolgreich übermittelt. Ein Fertigungstechniker wird sich innerhalb von 2 Stunden mit Ihnen in Verbindung setzen.')}
            className="bg-zinc-900 text-white px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Anfrage absenden
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
        {currentView === 'login' && <ViewLogin />}
        {currentView === 'dashboard' && <ViewDashboard />}
        {currentView === 'order-detail' && <ViewOrderDetail />}
        {currentView === 'upload' && <ViewUpload />}
        {currentView === 'support' && <ViewSupport />}
      </main>
      <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span>© 2026 AERO // PRINT. Industrielle Prototypensysteme.</span>
          <div className="space-x-6">
            <span className="hover:text-zinc-600 cursor-pointer">Impressum</span>
            <span className="hover:text-zinc-600 cursor-pointer">Datenschutz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
