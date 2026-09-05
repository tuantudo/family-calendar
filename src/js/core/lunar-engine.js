/**
 * lunar-engine.js — Vietnamese Lunar Calendar Computation Engine (Ho Ngoc Duc)
 * Astronomical calculations for Solar <-> Lunar conversion in GMT+7 (Asia/Ho_Chi_Minh).
 */
const LunarCal = {
    INT: (d) => Math.floor(d),
    jdFromDate: function(dd, mm, yy) {
        let a = this.INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
        let jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - this.INT(y / 100) + this.INT(y / 400) - 32045;
        if (jd < 2299161) jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT(y / 4) - 32083;
        return jd;
    },
    getNewMoonDay: function(k, timeZone = 7.0) {
        let T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
        C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
        C1 += 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
        C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
        C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
        C1 += 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
        let deltat = (T < -11) ? (0.001 + 0.000839 * T + 0.0002261 * T2) : (-0.000078 + 0.000044 * T + 0.0000207 * T2);
        return this.INT(Jd1 + C1 - deltat + 0.5 + timeZone / 24);
    },
    getSunLongitude: function(dayNumber, timeZone = 7.0) {
        let T = (dayNumber - 2451545.5 - timeZone / 24) / 36525, dr = Math.PI / 180;
        let M = 357.52910 + 35999.05029 * T, L0 = 280.46645 + 36000.76983 * T;
        let DL = (1.914602 - 0.004817 * T) * Math.sin(dr * M) + 0.019993 * Math.sin(dr * 2 * M);
        let L = (L0 + DL) * dr;
        L = L - Math.PI * 2 * this.INT(L / (Math.PI * 2));
        return this.INT(L / (Math.PI / 6));
    },
    getLunarMonth11: function(yy, timeZone = 7.0) {
        let off = this.jdFromDate(31, 12, yy) - 2415021;
        let k = this.INT(off / 29.530588853);
        let nm = this.getNewMoonDay(k, timeZone);
        if (this.getSunLongitude(nm, timeZone) >= 9) nm = this.getNewMoonDay(k - 1, timeZone);
        return nm;
    },
    getLeapMonthOffset: function(a11, timeZone = 7.0) {
        let k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0, i = 1, arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        while (arc !== last && i < 14) { last = arc; i++; arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone); }
        return i - 1;
    },
    CAN: ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
    CHI: ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"],
    getYearCanChi: function(year) { return this.CAN[(year + 6) % 10] + " " + this.CHI[(year + 8) % 12]; },
    convertSolar2Lunar: function(dd, mm, yy, timeZone = 7.0) {
        let dayNumber = this.jdFromDate(dd, mm, yy);
        let k = this.INT((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = this.getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) monthStart = this.getNewMoonDay(k, timeZone);
        let a11, a11next, lunarYear;
        if (monthStart >= this.getLunarMonth11(yy, timeZone)) {
            a11 = this.getLunarMonth11(yy, timeZone);
            a11next = this.getLunarMonth11(yy + 1, timeZone);
            lunarYear = yy + 1;
        } else {
            a11 = this.getLunarMonth11(yy - 1, timeZone);
            a11next = this.getLunarMonth11(yy, timeZone);
            lunarYear = yy;
        }
        let lunarDay = dayNumber - monthStart + 1;
        let diff = this.INT((monthStart - a11) / 29);
        let lunarLeap = 0, lunarMonth = diff + 11;
        if ((a11next - a11) > 365) {
            let leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff === leapMonthDiff) lunarLeap = 1;
            }
        }
        if (lunarMonth > 12) lunarMonth -= 12;
        if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
        return {
            day: lunarDay, month: lunarMonth, year: lunarYear, isLeap: lunarLeap === 1,
            canChi: this.getYearCanChi(lunarYear),
            fullText: `${lunarDay < 10 ? '0' + lunarDay : lunarDay}/${lunarMonth < 10 ? '0' + lunarMonth : lunarMonth}${lunarLeap === 1 ? ' (Nhuận)' : ''} ÂL · Năm ${this.getYearCanChi(lunarYear)}`
        };
    }
};
