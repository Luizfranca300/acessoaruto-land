import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";
import { createContactInquiry, ContactInquiry } from "../lib/api";

export default function About() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function handleSubmitContact(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const inquiry: ContactInquiry = {
        ...contactForm,
        inquiry_type: "general",
      };

      await createContactInquiry(inquiry);

      setSubmitSuccess(true);
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre a Acessorauto Veículos
          </h1>
          <p className="text-xl text-red-50 max-w-2xl mx-auto">
            Sua parceira de confiança na compra e venda de veículos seminovos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Nossa História
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                A Acessorauto Veículos nasceu do sonho de oferecer ao mercado
                uma experiência diferenciada na compra e venda de veículos
                seminovos. Com mais de 15 anos de atuação, nos consolidamos como
                referência em qualidade, transparência e atendimento
                personalizado.
              </p>
              <p>
                Nossa missão é conectar pessoas aos seus veículos ideais,
                oferecendo um processo simples, seguro e confiável. Cada veículo
                em nosso estoque passa por rigorosa vistoria técnica, garantindo
                a procedência e qualidade que nossos clientes merecem.
              </p>
              <p>
                Acreditamos que comprar um carro é mais do que uma transação
                comercial - é realizar um sonho, conquistar autonomia e abrir
                novas possibilidades. Por isso, tratamos cada cliente de forma
                única, entendendo suas necessidades e oferecendo soluções
                personalizadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award size={24} className="text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">15+</h3>
              <p className="text-gray-600">Anos de Experiência</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users size={24} className="text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">10.000+</h3>
              <p className="text-gray-600">Clientes Satisfeitos</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield size={24} className="text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">100%</h3>
              <p className="text-gray-600">Veículos Vistoriados</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Veículos em Estoque</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nossos Diferenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-red-700" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  Garantia Mecânica
                </h3>
                <p className="text-gray-600 text-sm">
                  Todos os veículos com garantia de motor e câmbio por 3 meses
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
                <h3 className="font-bold text-gray-800 mb-2">
                  Procedência Garantida
                </h3>
                <p className="text-gray-600 text-sm">
                  Documentação completa e histórico transparente
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
                <h3 className="font-bold text-gray-800 mb-2">Test Drive</h3>
                <p className="text-gray-600 text-sm">
                  Experimente o veículo antes de comprar
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
                <h3 className="font-bold text-gray-800 mb-2">
                  Financiamento Facilitado
                </h3>
                <p className="text-gray-600 text-sm">
                  Parceria com principais instituições financeiras
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
                <h3 className="font-bold text-gray-800 mb-2">
                  Retomamos seu Usado
                </h3>
                <p className="text-gray-600 text-sm">
                  Avaliação justa e uso como parte do pagamento
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
                <h3 className="font-bold text-gray-800 mb-2">
                  Atendimento Especializado
                </h3>
                <p className="text-gray-600 text-sm">
                  Equipe treinada para orientar você na melhor escolha
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Entre em Contato
            </h2>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle
                  size={48}
                  className="text-green-600 mx-auto mb-3"
                />
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-green-700">
                  Obrigado pelo contato. Responderemos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Nome Completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="E-mail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  placeholder="Telefone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <textarea
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="Sua mensagem"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin
                    size={24}
                    className="text-red-700 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Endereço</h3>
                    <p className="text-gray-600">
                      Av. João Pinheiro, 1722
                      <br />
                      Nossa Sra. Aparecida - Uberlândia/MG
                      <br />
                      CEP 38400-712
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone
                    size={24}
                    className="text-red-700 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Telefones</h3>
                    <p className="text-gray-600">
                      (34) 3222-9303
                      <br />
                      (34) 99998-9303 (WhatsApp)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-red-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">E-mail</h3>
                    <p className="text-gray-600">contato@acessorauto.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock
                    size={24}
                    className="text-red-700 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Horário de Funcionamento
                    </h3>
                    <p className="text-gray-600">
                      Segunda a Sexta: 8h às 19h
                      <br />
                      Sábado: 8h às 13h
                      <br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-700 to-red-800 text-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">Visite Nossa Loja</h3>
              <p className="mb-6 text-red-50">
                Venha conhecer nosso showroom e equipe. Teremos prazer em
                atendê-lo!
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-red-700 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
              >
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
