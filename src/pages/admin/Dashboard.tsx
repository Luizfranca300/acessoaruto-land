import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Car,
  Tag,
  Mail,
  FileText,
  LogOut,
  User,
  Plus,
  Settings,
} from "lucide-react";
import { getProfile } from "../../lib/api";
import { getToken, removeToken } from "../../lib/auth";
import AcessorautoLogo from "../../components/AcessorautoLogo";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = getToken();

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const profile = await getProfile(token);
        setUser(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        removeToken();
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  function handleLogout() {
    removeToken();
    navigate("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 shadow-lg relative overflow-hidden">
        {/* Imagem de fundo no header */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=1920&q=80')",
              backgroundBlendMode: "multiply",
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <AcessorautoLogo size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Painel Administrativo
                </h1>
                <p className="text-red-100 text-sm mt-0.5">
                  Acessorauto - Gerenciamento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg">
                <User className="w-5 h-5" />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-red-100">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/admin/settings")}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                title="Configurações"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-800/30 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bem-vindo, {user?.name}! 👋
            </h2>
            <p className="text-red-50 text-lg">
              Gerencie veículos, marcas e visualize contatos dos clientes.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Car />}
            title="Veículos"
            value="8"
            color="bg-gradient-to-br from-red-500 to-red-600"
            onClick={() => navigate("/admin/vehicles")}
          />
          <StatCard
            icon={<Tag />}
            title="Marcas"
            value="10"
            color="bg-gradient-to-br from-red-600 to-red-700"
            onClick={() => navigate("/admin/brands")}
          />
          <StatCard
            icon={<Mail />}
            title="Contatos"
            value="—"
            color="bg-gradient-to-br from-red-700 to-red-800"
            onClick={() => navigate("/admin/contacts")}
          />
          <StatCard
            icon={<FileText />}
            title="Avaliações"
            value="—"
            color="bg-gradient-to-br from-red-800 to-red-900"
            onClick={() => navigate("/admin/valuations")}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adicionar Veículo */}
            <Link
              to="/admin/vehicles/new"
              className="flex items-center gap-3 p-5 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg transition-all duration-200 text-left border border-red-200 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Adicionar Veículo</p>
                <p className="text-sm text-gray-600">
                  Cadastre um novo veículo no estoque
                </p>
              </div>
            </Link>

            {/* Gerenciar Veículos */}
            <Link
              to="/admin/vehicles"
              className="flex items-center gap-3 p-5 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg transition-all duration-200 text-left border border-red-200 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Gerenciar Veículos
                </p>
                <p className="text-sm text-gray-600">
                  Editar e visualizar veículos
                </p>
              </div>
            </Link>

            {/* Adicionar Marca */}
            <Link
              to="/admin/brands/new"
              className="flex items-center gap-3 p-5 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg transition-all duration-200 text-left border border-red-200 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-800 rounded-lg flex items-center justify-center shadow-md">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Adicionar Marca</p>
                <p className="text-sm text-gray-600">
                  Cadastre uma nova marca de veículo
                </p>
              </div>
            </Link>

            {/* Ver Site */}
            <Link
              to="/"
              className="flex items-center gap-3 p-5 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-lg transition-all duration-200 text-left border border-red-200 hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ver Site</p>
                <p className="text-sm text-gray-600">
                  Visualizar o site público
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  onClick?: () => void;
};

function StatCard({ icon, title, value, color, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 text-left w-full border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center shadow-md`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </button>
  );
}
