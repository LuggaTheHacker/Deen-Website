import { useState } from 'react';

export default function App() {
  // Navigation State (Der Bluff für den Router)
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dummy-Daten für das Portal
  const [orders, setOrders] = useState([
    { id: 'PRJ-8821', name: 'Gehäuse-Prototyp V4', material: 'PA12 (Nylon)', status: 'Im Druck', date: '22.06.2026' },
    { id: 'PRJ-8819', name: 'Zahnrad-Modul (Test)', material: 'Resin (Tough)', status: 'Versandbereit', date: '20.06.2026' },
    { id: 'PRJ-8790', name: 'Halterung Konzept A', material: 'PETG', status: 'Abgeschlossen', date: '15.05.2026' },
  ]);

  // --- UI KOMPONENTEN ---

  const Header = () => (
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-sm font-medium tracking-wide text-zinc-900">
        <div 
          className="cursor-pointer font-bold tracking-widest"
          onClick={() => setCurrentView('home')}
        >
          AERO // PRINT
        </div>
        <nav className="flex space-x-8 items-center">
          <button onClick={() => setCurrentView('home')} className="hover:text-zinc-500 transition-colors">Start</button>
          <button onClick={() => setCurrentView('support')} className="hover:text-zinc-500 transition-colors">Support</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => setCurrentView('upload')} className="hover:text-zinc-500 transition-colors">Neuer Upload</button>
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
      <div className="max-w-2xl">
        <h1 className="text-5xl font-light tracking-tight text-zinc-900 mb-6 leading-tight">
          Ihre Produktidee. <br />
          <span className="font-semibold">Physische Präzision.</span>
        </h1>
        <p className="text-lg text-zinc-500 mb-10 leading-relaxed font-light">
          Industrieller 3D-Druck für Rapid Prototyping. Laden Sie Ihre technischen Zeichnungen hoch und halten Sie Ihr Modell in kürzester Zeit in den Händen. Kompromisslos, maßhaltig, funktional.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={() => isLoggedIn ? setCurrentView('upload') : setCurrentView('login')}
            className="bg-zinc-900 text-white px-8 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Projekt starten
          </button>
          <button 
            onClick={() => setCurrentView('support')}
            className="border border-zinc-300 bg-transparent text-zinc-900 px-8 py-4 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Spezifikationen ansehen
          </button>
        </div>
      </div>
    </div>
  );

  const ViewLogin = () => (
    <div className="max-w-md mx-auto mt-24 border border-zinc-200 p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-2">Portal Zugang</h2>
      <p className="text-sm text-zinc-500 mb-8">Melden Sie sich an, um Aufträge zu verwalten.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">E-Mail Adresse</label>
          <input type="email" placeholder="name@unternehmen.de" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900" />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1">Passwort</label>
          <input type="password" placeholder="••••••••" className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900" />
        </div>
        <button 
          onClick={() => {
            setIsLoggedIn(true);
            setCurrentView('dashboard');
          }}
          className="w-full bg-zinc-900 text-white p-3 text-sm font-medium hover:bg-zinc-800 transition-colors mt-4"
        >
          Anmelden
        </button>
      </div>
    </div>
  );

  const ViewDashboard = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-zinc-900">Ihre Aufträge</h2>
          <p className="text-zinc-500 mt-2">Status und Historie Ihrer Prototypen.</p>
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
              <th className="px-6 py-4">Auftrags-ID</th>
              <th className="px-6 py-4">Bauteil / Projekt</th>
              <th className="px-6 py-4">Material</th>
              <th className="px-6 py-4">Datum</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4 font-medium text-zinc-900">{order.name}</td>
                <td className="px-6 py-4">{order.material}</td>
                <td className="px-6 py-4 text-zinc-500">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-block px-3 py-1 text-xs font-medium border ${
                    order.status === 'Im Druck' ? 'border-amber-200 text-amber-700 bg-amber-50' : 
                    order.status === 'Versandbereit' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                    'border-zinc-200 text-zinc-600 bg-zinc-50'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ViewUpload = () => (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-zinc-900 mb-2">CAD / Zeichnung hochladen</h2>
      <p className="text-zinc-500 mb-8">Akzeptierte Formate: .STL, .STEP, .IGES, .PDF (für 2D Zeichnungen).</p>
      
      <div className="border-2 border-dashed border-zinc-300 bg-zinc-50 p-16 text-center hover:bg-zinc-100 transition-colors cursor-pointer mb-6">
        <div className="text-zinc-400 mb-4 font-mono text-4xl">[ + ]</div>
        <p className="text-sm font-medium text-zinc-900">Dateien hier ablegen oder durchsuchen</p>
        <p className="text-xs text-zinc-500 mt-2">Maximal 500 MB pro Datei.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
           <label className="block text-xs font-medium text-zinc-700 mb-1">Gewünschtes Material</label>
           <select className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
             <option>PA12 (Nylon) - Selektives Lasersintern</option>
             <option>Resin (Tough) - SLA</option>
             <option>Aluminium (AlSi10Mg) - SLM</option>
           </select>
        </div>
        <div>
           <label className="block text-xs font-medium text-zinc-700 mb-1">Toleranz-Anforderung</label>
           <select className="w-full border border-zinc-300 p-3 text-sm focus:outline-none focus:border-zinc-900 bg-white">
             <option>Standard (± 0.2mm)</option>
             <option>Präzision (± 0.05mm)</option>
           </select>
        </div>
      </div>

      <button 
        onClick={() => {
          alert('Upload-Simulation erfolgreich! Auftrag wird geprüft.');
          setCurrentView('dashboard');
        }}
        className="bg-zinc-900 text-white px-8 py-4 text-sm font-medium hover:bg-zinc-800 transition-colors w-full"
      >
        Upload starten & Prüfen
      </button>
    </div>
  );

  const ViewSupport = () => (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-zinc-900 mb-8">Technischer Support & Kontakt</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Hotline</h3>
          <p className="text-sm text-zinc-600 mb-2">Für dringende Fragen zu laufenden Aufträgen oder Toleranzen.</p>
          <p className="text-xl font-mono text-zinc-900">+49 (0) 711 - 555 019 4</p>
          <p className="text-xs text-zinc-500 mt-2">Mo-Fr: 08:00 - 17:00 Uhr</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Standort / Fertigung</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            AERO // PRINT<br />
            Industriestraße 42<br />
            70771 Leinfelden-Echterdingen<br />
            Germany
          </p>
        </div>
      </div>
      
      <div className="mt-12 p-6 border border-zinc-200 bg-zinc-50">
        <h3 className="text-md font-medium text-zinc-900 mb-2">Allgemeine Anfragen</h3>
        <p className="text-sm text-zinc-600 mb-4">Schreiben Sie uns direkt an: <span className="font-medium text-zinc-900">engineering@aeroprint-proto.de</span></p>
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
        <div className="max-w-6xl mx-auto px-6 flex justify-between">
          <span>© 2026 AERO // PRINT Prototyping. All rights reserved.</span>
          <div className="space-x-4">
            <span className="hover:text-zinc-600 cursor-pointer">Impressum</span>
            <span className="hover:text-zinc-600 cursor-pointer">Datenschutz</span>
            <span className="hover:text-zinc-600 cursor-pointer">AGB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
