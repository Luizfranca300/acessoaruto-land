import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">AutoGaragem</h3>
            <p className="text-sm mb-4">
              Sua garagem de confiança para compra e venda de veículos seminovos. Qualidade e transparência em cada negócio.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/5534998884444"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">(34) 3235-3324</p>
                  <p className="text-sm">(34) 99888-4444</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <p className="text-sm">contato@autogaragem.com.br</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  Av. Principal, 1234<br />
                  Centro - Cidade/UF<br />
                  CEP 12345-678
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Horário de Funcionamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Segunda a Sexta:</span>
                <span className="text-white font-medium">8h às 19h</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado:</span>
                <span className="text-white font-medium">8h às 13h</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo:</span>
                <span className="text-white font-medium">Fechado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AutoGaragem. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
