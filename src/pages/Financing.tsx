import { useState } from 'react';
import { CreditCard, Calculator, CheckCircle, TrendingDown } from 'lucide-react';
import { supabase, ContactInquiry } from '../lib/supabase';

export default function Financing() {
  const [simulationValues, setSimulationValues] = useState({
    vehiclePrice: 50000,
    downPayment: 10000,
    installments: 48,
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const interestRate = 0.0149;

  function calculateInstallment() {
    const financedAmount = simulationValues.vehiclePrice - simulationValues.downPayment;
    const rate = interestRate;
    const n = simulationValues.installments;

    if (rate === 0) return financedAmount / n;

    const installment = (financedAmount * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    return installment;
  }

  const monthlyInstallment = calculateInstallment();
  const totalAmount = monthlyInstallment * simulationValues.installments + simulationValues.downPayment;
  const totalInterest = totalAmount - simulationValues.vehiclePrice;

  async function handleSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const inquiry: ContactInquiry = {
        ...contactForm,
        inquiry_type: 'financing',
      };

      const { error } = await supabase.from('contact_inquiries').insert([inquiry]);

      if (error) throw error;

      setSubmitSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <CreditCard size={64} className="mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Financiamento de Veículos</h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto">
            Realize o sonho do seu carro novo com condições especiais e taxas competitivas
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingDown size={32} className="text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Taxas Competitivas</h3>
            <p className="text-gray-600">A partir de 1,49% ao mês com as melhores condições do mercado</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aprovação Rápida</h3>
            <p className="text-gray-600">Análise e aprovação de crédito em até 24 horas</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator size={32} className="text-red-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Até 60 Parcelas</h3>
            <p className="text-gray-600">Prazos flexíveis para caber no seu bolso</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calculator size={28} className="text-red-700" />
              Simulador de Financiamento
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor do Veículo: R$ {simulationValues.vehiclePrice.toLocaleString('pt-BR')}
                </label>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={simulationValues.vehiclePrice}
                  onChange={(e) =>
                    setSimulationValues({ ...simulationValues, vehiclePrice: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>R$ 20.000</span>
                  <span>R$ 200.000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entrada: R$ {simulationValues.downPayment.toLocaleString('pt-BR')}
                </label>
                <input
                  type="range"
                  min="0"
                  max={simulationValues.vehiclePrice * 0.5}
                  step="1000"
                  value={simulationValues.downPayment}
                  onChange={(e) =>
                    setSimulationValues({ ...simulationValues, downPayment: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sem entrada</span>
                  <span>50% do valor</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Parcelas: {simulationValues.installments}x
                </label>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="6"
                  value={simulationValues.installments}
                  onChange={(e) =>
                    setSimulationValues({ ...simulationValues, installments: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12x</span>
                  <span>60x</span>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-700 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Valor Financiado:</span>
                  <span className="text-xl font-bold text-gray-800">
                    R${' '}
                    {(simulationValues.vehiclePrice - simulationValues.downPayment).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-red-200">
                  <span className="text-gray-700 font-semibold">Parcela Mensal:</span>
                  <span className="text-3xl font-bold text-red-700">
                    R$ {monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-200">
                  <div>
                    <p className="text-sm text-gray-600">Total a Pagar</p>
                    <p className="text-lg font-bold text-gray-800">
                      R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Juros</p>
                    <p className="text-lg font-bold text-gray-800">
                      R$ {totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600">
                  * Simulação com taxa de juros de {(interestRate * 100).toFixed(2)}% ao mês. Valores sujeitos à
                  aprovação de crédito. Taxas podem variar conforme análise cadastral.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Como Funciona?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Escolha seu Veículo</h3>
                    <p className="text-gray-600">Navegue pelo nosso estoque e escolha o carro ideal</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Faça uma Simulação</h3>
                    <p className="text-gray-600">Use nossa calculadora para ver as condições de pagamento</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Envie sua Proposta</h3>
                    <p className="text-gray-600">Preencha o formulário com seus dados</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Análise de Crédito</h3>
                    <p className="text-gray-600">Analisamos seu perfil em até 24 horas</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Retire seu Carro</h3>
                    <p className="text-gray-600">Aprovado! Venha buscar seu novo veículo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicite uma Proposta</h2>

              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-green-800 mb-2">Proposta Enviada!</h3>
                  <p className="text-green-700">
                    Recebemos sua solicitação. Nossa equipe entrará em contato em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Nome Completo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="E-mail"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="Telefone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Conte-nos sobre o veículo de interesse e suas condições desejadas"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
                  >
                    {submitting ? 'Enviando...' : 'Solicitar Financiamento'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
