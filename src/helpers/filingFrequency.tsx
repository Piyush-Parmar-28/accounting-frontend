// For getting the preference for given month and year

const filingFreq: {
  [key: string]: { id: number; months: [string, string, string] };
} = {
  Q1: { id: 2, months: ["Apr", "May", "Jun"] },
  Q2: { id: 3, months: ["Jul", "Aug", "Sep"] },
  Q3: { id: 4, months: ["Oct", "Nov", "Dec"] },
  Q4: { id: 1, months: ["Jan", "Feb", "Mar"] }
};

const findFilingFreq = (freq: any, month: string, year: string) => {
  let quarter = Object.keys(filingFreq)?.find(quar =>
    filingFreq[quar].months.includes(month)
  );
  let type = freq.find(
    (ob: any) => ob?.quarter === quarter && ob?.year === year
  );
  return type?.preference === "Q" ? "Quarterly" : "Monthly";
};

export const FilingFreqency = {
  findFilingFreq
};

export default FilingFreqency;
