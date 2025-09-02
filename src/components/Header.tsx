import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">PivotAI</h1>
      <nav>
        <ul className="flex space-x-6 text-gray-700">
          <li><a href="/features" className="hover:text-indigo-600 transition">Features</a></li>
          <li><a href="#pricing" className="hover:text-indigo-600">Pricing</a></li>
          <li><a href="#about" className="hover:text-indigo-600">About</a></li>
        </ul>
      </nav>
      
    </header>
  );
}
