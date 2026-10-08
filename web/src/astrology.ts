import * as Astronomy from "astronomy-engine";

export type Placement = { name: string; longitude: number; sign: string; degree: number; retrograde: boolean };
export type Aspect = { first: string; second: string; type: string; angle: number; orb: number };
const signs = ["Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ", "Thiên Bình", "Bọ Cạp", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư"];
const bodies: [string, Astronomy.Body][] = [
  ["Mặt Trời", Astronomy.Body.Sun], ["Mặt Trăng", Astronomy.Body.Moon], ["Sao Thủy", Astronomy.Body.Mercury],
  ["Sao Kim", Astronomy.Body.Venus], ["Sao Hỏa", Astronomy.Body.Mars], ["Sao Mộc", Astronomy.Body.Jupiter],
  ["Sao Thổ", Astronomy.Body.Saturn], ["Sao Thiên Vương", Astronomy.Body.Uranus],
  ["Sao Hải Vương", Astronomy.Body.Neptune], ["Sao Diêm Vương", Astronomy.Body.Pluto],
];
const norm = (longitude: number) => ((longitude % 360) + 360) % 360;

/** Geocentric apparent ecliptic longitudes at a UTC instant; not house/ascendant data. */
export function calculatePlacements(date: Date): Placement[] {
  if (!Number.isFinite(date.getTime())) throw new Error("Thời điểm sinh không hợp lệ.");
  return bodies.map(([name, body]) => {
    const longitudeAt = (at: Date) => body === Astronomy.Body.Moon
      ? Astronomy.EclipticGeoMoon(at).lon
      : Astronomy.Ecliptic(Astronomy.GeoVector(body, at, true)).elon;
    const longitude = norm(longitudeAt(date));
    const before = norm(longitudeAt(new Date(date.getTime() - 12 * 3600000)));
    const after = norm(longitudeAt(new Date(date.getTime() + 12 * 3600000)));
    const movement = ((after - before + 540) % 360) - 180;
    const index = Math.floor(longitude / 30);
    return { name, longitude, sign: signs[index], degree: Number((longitude % 30).toFixed(2)), retrograde: movement < 0 };
  });
}

/** Major aspects using explicitly declared conventional angle/orb cutoffs. */
export function calculateAspects(placements: Placement[]): Aspect[] {
  const targets: Array<[number, string, number]> = [[0, "Giao hội", 8], [60, "Lục hợp", 5], [90, "Vuông góc", 6], [120, "Tam hợp", 6], [180, "Đối đỉnh", 8]];
  const aspects: Aspect[] = [];
  for (let i = 0; i < placements.length; i++) for (let j = i + 1; j < placements.length; j++) {
    const raw = Math.abs(placements[i].longitude - placements[j].longitude);
    const separation = Math.min(raw, 360 - raw);
    const nearest = targets.map(([angle, type, orb]) => ({ angle, type, orb, delta: Math.abs(separation - angle) }))
      .filter(item => item.delta <= item.orb).sort((a, b) => a.delta - b.delta)[0];
    if (nearest) aspects.push({ first: placements[i].name, second: placements[j].name, type: nearest.type, angle: nearest.angle, orb: Number(nearest.delta.toFixed(2)) });
  }
  return aspects.sort((a, b) => a.orb - b.orb);
}

export function localBirthToUtc(value: string, offsetMinutes: number): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match || !Number.isInteger(offsetMinutes) || Math.abs(offsetMinutes) > 14 * 60) throw new Error("Nhập ngày, giờ sinh và múi giờ hợp lệ.");
  const [, y, mo, d, h, mi] = match.map(Number);
  const utc = Date.UTC(y, mo - 1, d, h, mi) - offsetMinutes * 60000;
  const date = new Date(utc);
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d || h > 23 || mi > 59) throw new Error("Ngày hoặc giờ sinh không hợp lệ.");
  return date;
}
