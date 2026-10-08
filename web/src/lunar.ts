import { SolarDate } from "@nghiavuive/lunar_date_vi";
export function vietnameseLunar(date:Date){const solar=new SolarDate({day:date.getDate(),month:date.getMonth()+1,year:date.getFullYear()});const lunar=solar.toLunarDate();const data=lunar.get();return {day:data.day,month:data.month,year:data.year,leap:data.leap_month,dayName:lunar.getDayName(),yearName:lunar.getYearName()};}
