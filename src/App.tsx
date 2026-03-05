import { Dashboard } from "./dashboard";

const App = () => {
  return (
    <main className="min-h-screen w-full p-5">
      <div>
        <h1 className="text-3xl font-medium">
          Aviator Frontend PoC - Market Making Workstation
        </h1>
        <Dashboard />
      </div>
    </main>
  );
};

export default App;
