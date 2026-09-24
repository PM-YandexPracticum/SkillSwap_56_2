export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Не удалось загрузить изображение'))
    reader.onabort = () => reject(new Error('Загрузка изображения отменена'))

    reader.readAsDataURL(file)
  })
