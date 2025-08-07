/**
 * Utilitários para manipulação de imagens
 */

/**
 * Constrói a URL completa da imagem baseada no caminho relativo do backend
 * @param relativePath - Caminho relativo da imagem (ex: /uploads/images/filename.jpg)
 * @returns URL completa da imagem ou URL de placeholder
 */
export const getImageUrl = (relativePath: string | null | undefined): string => {
  if (!relativePath) {
    return 'https://picsum.photos/300/200?text=Sem+Imagem';
  }

  // Caminho local fixo para garantir que funcione
  const LOCAL_PATH = 'file:///C:/Users/v.gomes.germano/OneDrive%20-%20Avanade/Documents/Projeto/proxima-parada-backend/Presentation.API/wwwroot';
  
  // Verificar se relativePath já é um caminho completo
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('file:///')) {
    return relativePath;
  }
  
  // Garantir que relativePath comece com /
  const formattedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  console.log(`🔄 Convertendo caminho relativo: ${formattedPath} para caminho local completo`);
  return `${LOCAL_PATH}${formattedPath}`;
};

/**
 * Extrai informações da imagem de um objeto de pacote do backend
 * @param packageData - Dados do pacote do backend
 * @returns Objeto com URL e alt text da imagem
 */
export const extractImageInfo = (packageData: any) => {
  const imagesData = packageData.images;
  const imageArray = imagesData?.$values || imagesData || [];
  const mainImage = Array.isArray(imageArray) ? imageArray[0] : null;
  
  const imageRelativePath = mainImage?.url || mainImage?.ImageUrl;
  const imageUrl = getImageUrl(imageRelativePath);
  const imageAlt = mainImage?.altText || mainImage?.AltText || packageData.title || packageData.Name || 'Imagem do pacote';
  
  return {
    url: imageUrl,
    alt: imageAlt,
    hasImage: !!imageRelativePath
  };
};
