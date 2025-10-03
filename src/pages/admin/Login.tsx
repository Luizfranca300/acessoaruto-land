import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle, Car } from "lucide-react";
import { login } from "../../lib/api";
import { saveToken } from "../../lib/auth";
import AcessorautoLogo from "../../components/AcessorautoLogo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      saveToken(response.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-800 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Imagem de fundo com parallax */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80')",
            backgroundBlendMode: "multiply",
          }}
        ></div>
      </div>

      {/* Gradiente animado overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 via-red-600/60 to-red-800/80 animate-gradient"></div>

      {/* Animação de fundo com formas geométricas */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {/* Círculos animados */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Formas geométricas flutuantes */}
          <div className="absolute top-20 right-1/4 w-32 h-32 border-2 border-white/10 rounded-lg rotate-45 animate-float"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-white/10 rounded-full animate-float-delayed"></div>
          <div
            className="absolute top-1/2 left-20 w-40 h-40 border-2 border-white/10 rotate-12 animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Ícone de carro decorativo */}
          <div className="absolute top-1/3 right-10 opacity-10 animate-float-delayed">
            <Car size={120} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo e Título */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-2xl">
            <AcessorautoLogo size={48} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-red-100">Acesse o sistema de gerenciamento</p>
        </div>

        {/* Card de Login */}
        <div
          className="bg-white rounded-lg shadow-2xl p-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-shadow"
                  placeholder="Usuário"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link para voltar */}
        <div
          className="text-center mt-6 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-red-100 transition-colors text-sm font-medium"
          >
            ← Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
}
