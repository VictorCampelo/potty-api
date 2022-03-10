export interface ScheduleProperties {
  seg: [start: string, end: string];
  ter: [start: string, end: string];
  qua: [start: string, end: string];
  qui: [start: string, end: string];
  sex: [start: string, end: string];
  sab: [start: string, end: string];
  dom: [start: string, end: string];
}

export enum DispatchTypes {
  DELIVERY = "delivery",
  WITHDRAWAL = "withdrawal",
  ALL = "all"
}
