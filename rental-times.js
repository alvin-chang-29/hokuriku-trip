'use strict';
const RentalTimes = (() => {
  const windows = ['08:00','10:00','12:30','13:00','14:30-15:15','15:15'];
  function schedule(inputs) {
    const saved = inputs.rentalStarts || windows.map(w => w.split('-')[0]);
    const journey = windows.map((w,i) => {
      const [first,last=first] = w.split('-');
      const start = ReturnCore.minutes(saved[i]) ?? ReturnCore.minutes(first);
      return {start,end:start + ReturnCore.minutes(last) - ReturnCore.minutes(first)};
    });
    const arrival = journey[5].start;
    const airportSteps = [5, 25, 55].map((offset, index) => {
      const start = ReturnCore.minutes(saved[6 + index]) ?? Math.min(1439, arrival + offset);
      return {start, end:start};
    });
    return journey.concat(airportSteps);
  }
  function shift(inputs,index,value) {
    const rows = schedule(inputs), next = ReturnCore.minutes(value);
    if(next === null || (index && next < rows[index-1].start)) throw Error('請輸入不早於上一個行程點的時間。');
    const delta = next - rows[index].start;
    const arrivalIndex = 5;
    const returnIndex = 4;
    const starts = rows.map((row, i) => row.start + (i >= index ? delta : 0));
    if (delta !== 0 && index <= returnIndex) {
      // The original plan reaches the terminal at the end of the return window.
      // An earlier manual arrival is an absolute target, not extra transfer time.
      const arrival = rows[returnIndex].end + delta;
      for (let i = arrivalIndex; i < rows.length; i++) {
        starts[i] = arrival + rows[i].start - rows[arrivalIndex].start;
      }
    }
    if (starts.some((start, i) => start < 0 || start + rows[i].end - rows[i].start >= 1440)) {
      throw Error('調整後超出12/10，請重新設定時間。');
    }
    inputs.rentalStarts = starts.map(ReturnCore.time);
    inputs.rentalEta = inputs.rentalStarts[arrivalIndex];
  }
  function duration(n) {
    return Math.floor(Math.abs(n)/60)+'小時 '+Math.abs(n)%60+'分';
  }
  function flight(inputs) {
    const departure=ReturnCore.minutes(inputs.departure || '18:35');
    const boarding=(departure+1440-60)%1440;
    return {departure,boarding:ReturnCore.time(boarding),boardingLabel:(departure<60?'前一天 ':'')+ReturnCore.time(boarding)};
  }
  function setBoarding(inputs, value) {
    const boarding = ReturnCore.minutes(value);
    const previous = flight(inputs).departure - 60;
    const delta = boarding - previous;
    const rows = schedule(inputs);
    const eta = ReturnCore.minutes(inputs.rentalEta);
    if (boarding === null || boarding < 90 || boarding + 60 >= 1440 ||
        rows[0].start + delta < 0 || rows.at(-1).end + delta >= 1440 ||
        (eta !== null && (eta + delta < 0 || eta + delta >= 1440))) {
      throw Error('請選擇能讓取車、登機及起飛都在12/10當天的時間。');
    }
    inputs.departure = ReturnCore.time(boarding + 60);
    inputs.rentalStarts = rows.map(row => ReturnCore.time(row.start + delta));
    if (eta !== null) inputs.rentalEta = ReturnCore.time(eta + delta);
  }
  return {schedule,shift,duration,flight,setBoarding};
})();
