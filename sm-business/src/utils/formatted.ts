import moment from "moment";
import 'moment/locale/pt';

export function formatted(dateTime: string) {
  const dbTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/g;
  const fullDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/g;
  const monthYear = /^\d{1,2}\/\d{4}$/g;    

  if (dbTimestamp.test(dateTime)) {    
    return moment(dateTime, "YYYY-MM-DD").format("DD/MM/YYYY");
  }

  if (fullDate.test(dateTime)) {
    return moment(dateTime, "D/M/YYYY").format("DD/MM/YYYY");
  }

  if (monthYear.test(dateTime)) {
    return moment(dateTime, "M/YYYY").format("MMM/YYYY")
  }
  
  return dateTime;  
}