import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, Tag, Mail, FileText, LogOut, User, Plus } from "lucide-react";
import { getProfile } from "../../lib/api";
import { getToken, removeToken } from "../../lib/auth";

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Painel Administrativo
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Acessorauto - Gerenciamento
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5" />
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-red-100">
            Gerencie veículos, marcas e visualize contatos dos clientes.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Car />}
            title="Veículos"
            value="8"
            color="bg-blue-600"
            onClick={() => navigate("/admin/vehicles")}
          />
          <StatCard
            icon={<Tag />}
            title="Marcas"
            value="10"
            color="bg-purple-600"
            onClick={() => navigate("/admin/brands")}
          />
          <StatCard
            icon={<Mail />}
            title="Contatos"
            value="—"
            color="bg-green-600"
            onClick={() => navigate("/admin/contacts")}
          />
          <StatCard
            icon={<FileText />}
            title="Avaliações"
            value="—"
            color="bg-orange-600"
            onClick={() => navigate("/admin/valuations")}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adicionar Veículo */}
            <Link
              to="/admin/vehicles/new"
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Adicionar Veículo</p>
                <p className="text-sm text-gray-400">
                  Cadastre um novo veículo no estoque
                </p>
              </div>
            </Link>

            {/* Gerenciar Veículos */}
            <Link
              to="/admin/vehicles"
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Gerenciar Veículos</p>
                <p className="text-sm text-gray-400">
                  Editar e visualizar veículos
                </p>
              </div>
            </Link>

            {/* Adicionar Marca */}
            <Link
              to="/admin/brands/new"
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Adicionar Marca</p>
                <p className="text-sm text-gray-400">
                  Cadastre uma nova marca de veículo
                </p>
              </div>
            </Link>

            {/* Ver Site */}
            <Link
              to="/"
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Ver Site</p>
                <p className="text-sm text-gray-400">
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
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors text-left w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </button>
  );
}
