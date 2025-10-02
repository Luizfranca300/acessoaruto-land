import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function AcessorautoLogo({
  size = 40,
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Círculo de fundo */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="currentColor"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />

        {/* Carro estilizado */}
        <g transform="translate(20, 35)">
          {/* Carroceria principal */}
          <path
            d="M5 20 L10 10 L35 10 L50 15 L55 20 L55 25 L5 25 Z"
            fill="rgba(220, 38, 38, 0.9)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1"
          />

          {/* Teto */}
          <path
            d="M15 10 L15 5 L40 5 L45 10"
            fill="rgba(220, 38, 38, 0.7)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1"
          />

          {/* Rodas */}
          <circle cx="15" cy="25" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="45" cy="25" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="15" cy="25" r="2" fill="rgba(220, 38, 38, 1)" />
          <circle cx="45" cy="25" r="2" fill="rgba(220, 38, 38, 1)" />

          {/* Para-brisa */}
          <path
            d="M18 10 L18 7 L37 7 L42 10"
            fill="rgba(255,255,255,0.3)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.5"
          />

          {/* Farol */}
          <circle cx="52" cy="18" r="2" fill="rgba(255,255,255,0.8)" />

          {/* Detalhes */}
          <line
            x1="25"
            y1="15"
            x2="35"
            y2="15"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
        </g>

        {/* Letra "A" estilizada */}
        <g transform="translate(15, 15)">
          <path
            d="M10 15 L15 5 L20 15 M12 12 L18 12"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Elemento decorativo - engrenagem */}
        <g transform="translate(65, 15)">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.8)" />
          {/* Dentes da engrenagem */}
          <g stroke="rgba(255,255,255,0.6)" strokeWidth="1">
            <line x1="10" y1="2" x2="10" y2="6" />
            <line x1="10" y1="14" x2="10" y2="18" />
            <line x1="2" y1="10" x2="6" y2="10" />
            <line x1="14" y1="10" x2="18" y2="10" />
            <line x1="4.5" y1="4.5" x2="7" y2="7" />
            <line x1="13" y1="13" x2="15.5" y2="15.5" />
            <line x1="15.5" y1="4.5" x2="13" y2="7" />
            <line x1="7" y1="13" x2="4.5" y2="15.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}
