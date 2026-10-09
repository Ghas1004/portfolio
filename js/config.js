/**
 * ============================================================
 * CONFIGURAÇÃO DO PORTFÓLIO
 * ALTERE AQUI as informações pessoais, links e caminhos de imagem.
 * ============================================================
 */
window.PORTFOLIO_CONFIG = {
  name: "Gustavo Henrique",
  role: "Desenvolvimento de Software | Tecnologia da Informação",

  // Pasta e nomes das fotos do carrossel (sem a extensão).
  // O script tenta .jpg, .jpeg, .png e .webp automaticamente.
  photosFolder: "images/",
  photoExtensions: ["jpg", "jpeg", "png", "webp"],

  photo: "Foto1",
  photoAlt: "Fotografia de Gustavo Henrique",

  carouselSlides: [
    {
      name: "Foto1",
      alt: "Fotografia de Gustavo Henrique — foto 1",
      caption: "Apresentação",
    },
    {
      name: "foto2",
      alt: "Fotografia de Gustavo Henrique — foto 2",
      caption: "Perfil profissional",
    },
    {
      name: "foto3",
      alt: "Fotografia de Gustavo Henrique — foto 3",
      caption: "Disponível para oportunidades",
    },
  ],

  email: "gustavocmservicossolucoes@gmail.com",
  whatsapp: "5515991276630",
  instagram: "ghas_1004",

  formEndpoint: "",
  formMethod: "POST",
};