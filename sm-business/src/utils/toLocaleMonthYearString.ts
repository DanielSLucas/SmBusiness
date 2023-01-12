export function toLocaleMonthYearString(monthYear: string) {
  const [month, year] = monthYear.split('/').map(Number);

  const date = new Date(year, month-1);

  return Intl.DateTimeFormat('pt-BR', {
    month: "short",
    year: "2-digit",    
  }).format(date).replace('. de ', '/')
}
