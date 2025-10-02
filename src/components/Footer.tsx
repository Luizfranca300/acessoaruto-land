import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const companyName =
    import.meta.env.VITE_COMPANY_NAME || "Acessorauto Veículos";
  const companyPhone = import.meta.env.VITE_COMPANY_PHONE || "(34) 3222-9303";
  const companyWhatsApp =
    import.meta.env.VITE_COMPANY_WHATSAPP || "5534999989303";
  const companyEmail =
    import.meta.env.VITE_COMPANY_EMAIL || "contato@acessorauto.com.br";
  const companyAddress =
    import.meta.env.VITE_COMPANY_ADDRESS || "Av. João Pinheiro, 1722";
  const companyNeighborhood =
    import.meta.env.VITE_COMPANY_NEIGHBORHOOD || "Nossa Sra. Aparecida";
  const companyCity = import.meta.env.VITE_COMPANY_CITY || "Uberlândia";
  const companyState = import.meta.env.VITE_COMPANY_STATE || "MG";
  const companyZip = import.meta.env.VITE_COMPANY_ZIP || "38400-712";

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{companyName}</h3>
            <p className="text-sm mb-4">
              Sua loja de confiança para compra e venda de veículos seminovos em
              {companyCity}. Qualidade e transparência em cada negócio.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={`https://wa.me/${companyWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-600 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="text-brand-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm">{companyPhone}</p>
                  <p className="text-sm">
                    ({companyWhatsApp.slice(2, 4)}){" "}
                    {companyWhatsApp.slice(4, 9)}-{companyWhatsApp.slice(9)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-brand-600 mt-1 flex-shrink-0" />
                <p className="text-sm">{companyEmail}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-brand-600 mt-1 flex-shrink-0"
                />
                <p className="text-sm">
                  {companyAddress}
                  <br />
                  {companyNeighborhood}
                  <br />
                  {companyCity} - {companyState}, {companyZip}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Horário de Funcionamento
            </h3>
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
          <p>
            &copy; {new Date().getFullYear()} {companyName}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
