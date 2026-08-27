import { Navbar } from './components/layout/Navbar';
import { AuditWorkspace } from './features/simulation/components/AuditWorkspace';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eef2f6]">
      <Navbar />

      <main className="flex-1 p-6 flex flex-col gap-5 max-w-7xl w-full mx-auto">
        <AuditWorkspace />
      </main>
    </div>
  );
}
