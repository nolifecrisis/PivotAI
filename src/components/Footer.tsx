import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-center p-6 mt-12">
      © {new Date().getFullYear()} PivotAI · All Rights Reserved
    </footer>
  );
}
