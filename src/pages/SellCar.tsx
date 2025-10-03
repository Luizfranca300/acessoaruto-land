import { useState } from "react";
import { DollarSign, CheckCircle, Car } from "lucide-react";
import { createValuation, VehicleValuation } from "../lib/api";

export default function SellCar() {
  const [formData, setFormData] = useState<VehicleValuation>({
    name: "",
    email: "",
    phone: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    condition: "good",
    additional_info: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createValuation(formData);

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        condition: "good",
        additional_info: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting valuation:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <DollarSign size={64} className="mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Venda seu Carro
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto">
            Avaliação gratuita e rápida. Oferecemos o melhor valor pelo seu
            veículo!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Por que vender conosco?
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} className="text-red-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Avaliação Justa
                  </h3>
                  <p className="text-gray-600">
                    Analisamos o mercado e oferecemos o melhor preço pelo seu
                    veículo
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} className="text-red-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Processo Rápido
                  </h3>
                  <p className="text-gray-600">
                    Pagamento imediato e documentação facilitada. Você vende e
                    recebe na hora!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} className="text-red-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Sem Burocracia
                  </h3>
                  <p className="text-gray-600">
                    Cuidamos de toda a documentação e transferência para você
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} className="text-red-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Todas as Marcas
                  </h3>
                  <p className="text-gray-600">
                    Aceitamos veículos de qualquer marca, modelo e ano
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-700 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Como Funciona?
              </h3>
              <ol className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-red-700">1.</span>
                  <span>Preencha o formulário com os dados do seu veículo</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-700">2.</span>
                  <span>Nossa equipe entrará em contato em até 24 horas</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-700">3.</span>
                  <span>Agendamos uma vistoria presencial gratuita</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-700">4.</span>
                  <span>Fazemos uma proposta justa pelo seu carro</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-red-700">5.</span>
                  <span>Aceite a proposta e receba o pagamento imediato!</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Solicite sua Avaliação
            </h2>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle
                  size={64}
                  className="text-green-600 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Avaliação Solicitada!
                </h3>
                <p className="text-green-700 mb-6">
                  Recebemos sua solicitação. Nossa equipe entrará em contato em
                  breve para agendar a vistoria.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Fazer Nova Avaliação
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Ex: Toyota, Chevrolet..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      placeholder="Ex: Corolla, Onix..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ano *
                    </label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quilometragem *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.mileage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mileage: parseInt(e.target.value),
                        })
                      }
                      placeholder="Em km"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado de Conservação *
                  </label>
                  <select
                    required
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        condition: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="excellent">
                      Excelente - Sem avarias, bem conservado
                    </option>
                    <option value="good">Bom - Pequenas marcas de uso</option>
                    <option value="fair">
                      Regular - Necessita pequenos reparos
                    </option>
                    <option value="poor">
                      Ruim - Necessita reparos significativos
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Informações Adicionais (opcional)
                  </label>
                  <textarea
                    value={formData.additional_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additional_info: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Conte-nos mais sobre o veículo: opcionais, histórico de manutenção, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Car size={20} />
                      Solicitar Avaliação Gratuita
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
