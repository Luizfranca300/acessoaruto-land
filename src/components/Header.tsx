import { Menu, X } from "lucide-react";
import { useState } from "react";
import AcessorautoLogo from "./AcessorautoLogo";

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const companyName =
    import.meta.env.VITE_COMPANY_NAME || "Acessorauto Veículos";

  const menuItems = [
    { id: "home", label: "Início" },
    { id: "inventory", label: "Estoque" },
    { id: "sell", label: "Venda seu Carro" },
    { id: "financing", label: "Financiamento" },
    { id: "about", label: "Sobre" },
  ];

  return (
    <header className="bg-brand-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <AcessorautoLogo size={32} />
            <span className="text-2xl font-bold">{companyName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium hover:text-red-200 transition-colors ${
                  currentPage === item.id
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-red-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-brand-900 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-brand-700">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium hover:bg-brand-900 transition-colors ${
                  currentPage === item.id
                    ? "bg-brand-900 text-white"
                    : "text-red-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
