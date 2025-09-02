export default function Navigation() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-indigo-600">PivotAI</h1>
      <div className="space-x-6">
        <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
        <a href="#pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a>
        <a href="#login" className="text-gray-700 hover:text-indigo-600">Login</a>
      </div>
    </nav>
  );
}
