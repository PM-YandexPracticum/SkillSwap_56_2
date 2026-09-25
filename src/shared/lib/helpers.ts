

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

function parseCalendarDate(dateString: string): Date {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)

  if (!dateOnlyMatch) {
    return new Date(dateString)
  }

  const [, year, month, day] = dateOnlyMatch
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return new Date(Number.NaN)
  }

  return date
}

/** dd.MM.yyyy (формат DatePicker) → yyyy-MM-dd (ISO, формат хранения) */
export function toIsoDate(value: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)

  if (!match) {
    return value
  }

  const [, day, month, year] = match

  return `${year}-${month}-${day}`
}

/** yyyy-MM-dd (ISO) → dd.MM.yyyy (формат DatePicker), другие форматы не трогает */
export function toDisplayDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return value
  }

  const [, year, month, day] = match

  return `${day}.${month}.${year}`
}

/** Возвращает полный возраст или null для невалидной/будущей даты */
export function getAge(birthDate: string, currentDate = new Date()): number | null {
  const birthday = parseCalendarDate(birthDate)

  if (
    Number.isNaN(birthday.getTime()) ||
    Number.isNaN(currentDate.getTime()) ||
    birthday > currentDate
  ) {
    return null
  }

  const years = currentDate.getFullYear() - birthday.getFullYear()
  const hasBirthdayPassed =
    currentDate.getMonth() > birthday.getMonth() ||
    (currentDate.getMonth() === birthday.getMonth() &&
      currentDate.getDate() >= birthday.getDate())

  return hasBirthdayPassed ? years : years - 1
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Возвращает подходящую форму слова для числа */
export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const lastDigit = abs % 10

  if (abs > 10 && abs < 20) return forms[2]
  if (lastDigit > 1 && lastDigit < 5) return forms[1]
  if (lastDigit === 1) return forms[0]

  return forms[2]
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}
