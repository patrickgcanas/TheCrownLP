// Meios de contato da banda, usados na página Contato e no rodapé
// Encaminhado pelo ImprovMX para o Gmail da banda (thecrownlptribute@gmail.com)
export const EMAIL_BANDA = "contato@thecrownlp.com.br";

// Número com DDI e DDD, só dígitos (ex: "5511999998888"). Vazio = o botão de WhatsApp não aparece.
export const WHATSAPP_NUMERO = "";

export const whatsappUrl = WHATSAPP_NUMERO
  ? `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Olá! Vim pelo site da The Crown LP.")}`
  : null;
