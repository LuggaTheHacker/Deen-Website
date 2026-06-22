import { useState, useEffect } from 'react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dummy-Daten für das Portal (auf High-Performance getrimmt)
  const [orders, setOrders] = useState([
    { id: 'PRJ-8821', name: 'Luftführung GT-Spec', material: 'PA12 (Nylon)', qty: 'Kleinserie (50)', status: 'Im Druck', date: '22.06.2026', price: '1.240,00 €' },
    { id: 'PRJ-8819', name: 'Bremssattel-Dummy (Mockup)', material: 'Resin (Tough)', qty: 'Einzelstück', status: 'Versandbereit', date: '20.06.2026', price: '85,50 €' },
    { id: 'PRJ-8790', name: 'Halterung eATS-Modul', material: 'Aluminium (AlSi10Mg)', qty: 'Einzelstück', status: 'Abgeschlossen', date: '15.05.2026', price: '320,00 €' },
  ]);

  // --- UI KOMPONENTEN ---

  const Header = () => (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-sm font-medium tracking-wide text-zinc-900">
        <div 
          className="cursor-pointer font-bold tracking-widest flex items-center gap-2"
          onClick={() => setCurrentView('home')}
        >
          <div className="w-3 h-3 bg-zinc-900"></div>
          AERO // PRINT
        </div>
        <nav className="flex space-x-8 items-center">
          <button onClick={() => setCurrentView('home')} className="hover:text-zinc-500 transition-colors">Start</button>
          <button onClick={() => setCurrentView('support')} className="hover:text-zinc-500 transition-colors">Support</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => setCurrentView('upload')} className="hover:text-zinc-500 transition-colors">Neuer Auftrag</button>
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-zinc-500 transition-colors">Portal</button>
              <button 
                onClick={() => { setIsLoggedIn(false); setCurrentView('home'); }} 
                className="bg-zinc-100 px-4 py-2 hover:bg-zinc-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setCurrentView('login')} 
              className="bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800 transition-colors"
            >
              Kunden-Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );

  // --- ANSICHTEN (VIEWS) ---

  const ViewHome = () => (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl">
        <div className="inline-block border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 mb-6">
          System-Status: Alle Anlagen betriebsbereit
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-zinc-900 mb-6 leading-tight">
          Ihre Produktidee. <br />
          <span className="font-semibold">Physische Präzision.</span>
        </h1>
        <p className="text-lg text-zinc-500 mb-10 leading-relaxed font-light max-w-2xl">
          Industrielle additive Fertigung für Rapid Prototyping und Serienproduktion. Laden Sie Ihre CAD-Daten hoch und konfigurieren Sie Ihr Bauteil. Kompromisslos, maßhaltig, funktional.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={() => isLoggedIn ? setCurrentView('upload') : setCurrentView('login')}
            className="bg-zinc-900 text-white px-8 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Konfigurator starten
          </button>
          <button 
            onClick={() => setCurrentView('support')}
            className="border border-zinc-300 bg-transparent text-zinc-900 px-8 py-4 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Maschinenpark ansehen
          </button>
        </div>
      </div>
      
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-200 pt-12">
        <div>
          <h3 className="text-lg font-semibold mb-2">Vom Einzelstück bis zur Serie</h3>
          <p className="text-sm text-zinc-500">Skalieren Sie nahtlos von ersten Mockups bis hin zu funktionalen Kleinserien (500+ Stück) auf denselben Anlagen.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Industrielle Materialien</h3>
          <p className="text-sm text-zinc-500">Hochleistungs-Polymere, zähe Harze oder direkt in Aluminium (AlSi10Mg) gedruckt für maximale mechanische Belastbarkeit.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Zertifizierte QS</h3>
          <p className="text-sm text-zinc-500">Optionale Erstmusterprüfberichte und optische 3D-Scans garantieren die Einhaltung Ihrer geforderten Toleranzen.</p>
        </div>
      </div>
    </div>
  );

  const ViewLogin = () => (
    <div className="max-w-md mx-auto mt-24 border border-zinc-200 p-8 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-2">Portal Zugang</h2>
      <p className="text-sm text-zinc-500 mb-8">Engineering-Dashboard für Ihre Aufträge.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">E-Mail Adresse</label>
          <input type="email" placeholder="name@unternehmen.de" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Passwort</label>
          <input type="password" placeholder="••••••••" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors" />
        </div>
        <button 
          onClick={() => { setIsLoggedIn(true); setCurrentView('dashboard'); }}
          className="w-full bg-zinc-900 text-white p-3 text-sm font-medium hover:bg-zinc-800 transition-colors mt-4"
        >
          System autorisieren
        </button>
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-900">Auftrags-Center</h2>
          <p className="text-zinc-500 mt-2">Ihre aktuellen und abgeschlossenen Fertigungsprozesse.</p>
        </div>
        <button 
          onClick={() => setCurrentView('upload')}
          className="bg-zinc-900 text-white px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          + Neuer Auftrag
        </button>
      </div>

      <div className="w-full overflow-x-auto border border-zinc-200">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="bg-zinc-50 text-zinc-900 font-medium border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Bauteil / Projekt</th>
              <th className="px-6 py-4">Material</th>
              <th className="px-6 py-4">Menge</th>
              <th className="px-6 py-4">Wert</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-zinc-900">{order.id}</td>
                <td className="px-6 py-4 font-medium text-zinc-900">{order.name}</td>
                <td className="px-6 py-4">{order.material}</td>
                <td className="px-6 py-4">{order.qty}</td>
                <td className="px-6 py-4">{order.price}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-medium border ${
                    order.status === 'Im Druck' ? 'border-amber-200 text-amber-700 bg-amber-50' : 
                    order.status === 'Versandbereit' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                    'border-zinc-200 text-zinc-600 bg-zinc-50'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={() => setCurrentView('upload')}
                    className="text-xs font-medium text-zinc-900 hover:text-zinc-500 underline"
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

  const ViewUpload = () => {
    // Bluff-State für den interaktiven Preis-Kalkulator
    const [priceCalculated, setPriceCalculated] = useState(85.50);
    const [calcTrigger, setCalcTrigger] = useState(0);

    // Simuliert eine Berechnung, wenn sich Dropdowns ändern
    const triggerCalculation = () => {
      setPriceCalculated((prev) => prev + (Math.random() * 50 - 20));
      setCalcTrigger(prev => prev + 1);
    };

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-zinc-900 mb-2">Produktions-Konfigurator</h2>
        <p className="text-zinc-500 mb-8">Spezifizieren Sie Ihr Bauteil. Das System berechnet Preis und Machbarkeit in Echtzeit.</p>
        
        {/* Sektion 1: Upload */}
        <div className="border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center hover:bg-zinc-100 transition-colors cursor-pointer mb-8">
          <div className="text-zinc-400 mb-4 font-mono text-4xl">[ CAD ]</div>
          <p className="text-sm font-medium text-zinc-900">CAD-Dateien ablegen oder durchsuchen</p>
          <p className="text-xs text-zinc-500 mt-2">.STEP, .STL, .IGES (Max 500MB)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-zinc-200 pb-8">
          {/* Sektion 2: Material & Menge */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">1. Basis-Spezifikation</h3>
            
            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Produktionsvolumen</label>
               <select onChange={triggerCalculation} className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white">
                 <option>Einzelstück (Prototyp)</option>
                 <option>Kleinserie (10 - 50 Stück)</option>
                 <option>Vorserie (50 - 500 Stück)</option>
                 <option>Großproduktion (500+ Stück)</option>
               </select>
            </div>

            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Material / Verfahren</label>
               <select onChange={triggerCalculation} className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white">
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
               <select onChange={triggerCalculation} className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white">
                 <option>Standard (ISO 2768-m)</option>
                 <option>Präzision (± 0.05mm)</option>
               </select>
            </div>

            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Qualitätssicherung (QS)</label>
               <select onChange={triggerCalculation} className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white">
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
                <input type="checkbox" onChange={triggerCalculation} className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                <span>Gleitschleifen (Trowalisieren)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-zinc-700 cursor-pointer">
                <input type="checkbox" onChange={triggerCalculation} className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                <span>Gewindeeinsätze setzen (Helicoil)</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-zinc-700 cursor-pointer">
                <input type="checkbox" onChange={triggerCalculation} className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
                <span>Lackierung (RAL nach Wahl)</span>
              </label>
            </div>
          </div>

          {/* Sektion 5: Logistik */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold border-b border-zinc-200 pb-2">4. Logistik</h3>
            <div>
               <label className="block text-xs font-medium text-zinc-700 mb-1">Liefergeschwindigkeit</label>
               <select onChange={triggerCalculation} className="w-full border border-zinc-300 p-2.5 text-sm focus:outline-none focus:border-zinc-900 bg-white">
                 <option>Economy (7-9 Werktage)</option>
                 <option>Standard (4-6 Werktage)</option>
                 <option>Express (48 Stunden)</option>
                 <option>Overnight Sprint (Nur auf Anfrage)</option>
               </select>
            </div>
          </div>
        </div>

        {/* Live-Kalkulator & Checkout */}
        <div className="bg-zinc-50 border border-zinc-200 p-6 flex flex-col md:flex-row justify-between items-center mt-10">
          <div className="mb-4 md:mb-0">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Live-Kalkulation (Netto)</p>
            <p key={calcTrigger} className="text-3xl font-light text-zinc-900 animate-pulse">
              ~ {priceCalculated.toFixed(2).replace('.', ',')} €
            </p>
          </div>
          <button 
            onClick={() => {
              alert('Konfiguration übermittelt! Ihre Daten werden durch unser Engineering geprüft.');
              setCurrentView('dashboard');
            }}
            className="bg-zinc-900 text-white px-10 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors w-full md:w-auto"
          >
            Fertigung anfragen
          </button>
        </div>
      </div>
    );
  };

  const ViewSupport = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-zinc-900 mb-8">Engineering Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Hotline</h3>
          <p className="text-sm text-zinc-600 mb-2">Direkter Draht zu unseren Fertigungstechnikern.</p>
          <p className="text-xl font-mono text-zinc-900">+49 (0) 711 - 555 019 4</p>
          <p className="text-xs text-zinc-500 mt-2">Mo-Fr: 08:00 - 17:00 Uhr</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Anlagen-Standort</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            AERO // PRINT<br />
            Industriestraße 42<br />
            70771 Leinfelden-Echterdingen<br />
            Germany
          </p>
        </div>
      </div>
      
      <div className="mt-12 p-6 border border-zinc-200 bg-zinc-50">
        <h3 className="text-md font-medium text-zinc-900 mb-2">B2B Rahmenverträge</h3>
        <p className="text-sm text-zinc-600">Für API-Integration in Ihr ERP-System oder Serien-Abrufe kontaktieren Sie bitte: <span className="font-medium text-zinc-900">sales@aeroprint-proto.de</span></p>
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
        {currentView === 'upload' && <ViewUpload />}
        {currentView === 'support' && <ViewSupport />}
      </main>
      <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-400 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span>© 2026 AERO // PRINT. Industrielle additive Fertigung.</span>
          <div className="space-x-6">
            <span className="hover:text-zinc-600 cursor-pointer">Maschinenpark</span>
            <span className="hover:text-zinc-600 cursor-pointer">Impressum</span>
            <span className="hover:text-zinc-600 cursor-pointer">Datenschutz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
