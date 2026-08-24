export const BUSINESS_CONTACT = {
  name: 'Refacciones aire acondicionado y venta de Minisplit SMM',
  phone: '528139109310',
  coordinates: '25.6671356,-100.4375599',
  mapsUrl: 'https://www.google.com/maps/place/Refacciones+aire+acondicionado+y+venta+de+Minisplit+smm/@25.6592011,-100.518251,12z',
  mapsEmbedUrl: 'https://www.google.com/maps?q=25.6671356,-100.4375599&z=15&output=embed',
  whatsappMessage: 'Hola SMM, me gustaría recibir información sobre sus servicios.'
} as const;

export const BUSINESS_CONTACT_LINKS = {
  whatsapp: `https://wa.me/${BUSINESS_CONTACT.phone}?text=${encodeURIComponent(BUSINESS_CONTACT.whatsappMessage)}`
} as const;
