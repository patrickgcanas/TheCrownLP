// Só no navegador: reduz a foto para no máximo `ladoMaximo` px no lado maior e converte para JPG.
// Fica nítida em tela cheia e leve (~300-500 KB). Falha com formatos que o navegador não abre (ex.: HEIC).
export async function reduzirFoto(file: File, ladoMaximo = 2000): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("falha ao converter"))), "image/jpeg", 0.85),
  );
}
