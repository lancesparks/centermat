const muay_thai = [
  { class: "Mini Flyweight", maxWeightLbs: 105, maxWeightKg: 47.6 },
  { class: "Light Flyweight", maxWeightLbs: 108, maxWeightKg: 49.0 },
  { class: "Flyweight", maxWeightLbs: 112, maxWeightKg: 50.8 },
  { class: "Super Flyweight", maxWeightLbs: 115, maxWeightKg: 52.2 },
  { class: "Bantamweight", maxWeightLbs: 118, maxWeightKg: 53.5 },
  { class: "Super Bantamweight", maxWeightLbs: 122, maxWeightKg: 55.3 },
  { class: "Featherweight", maxWeightLbs: 126, maxWeightKg: 57.2 },
  { class: "Super Featherweight", maxWeightLbs: 130, maxWeightKg: 59.0 },
  { class: "Lightweight", maxWeightLbs: 135, maxWeightKg: 61.2 },
  { class: "Super Lightweight", maxWeightLbs: 140, maxWeightKg: 63.5 },
  { class: "Welterweight", maxWeightLbs: 147, maxWeightKg: 66.7 },
  { class: "Super Welterweight", maxWeightLbs: 154, maxWeightKg: 69.9 },
  { class: "Middleweight", maxWeightLbs: 160, maxWeightKg: 72.6 },
  { class: "Super Middleweight", maxWeightLbs: 168, maxWeightKg: 76.2 },
  { class: "Light Heavyweight", maxWeightLbs: 175, maxWeightKg: 79.4 },
  { class: "Cruiserweight", maxWeightLbs: 200, maxWeightKg: 90.7 },
  { class: "Heavyweight", maxWeightLbs: null, maxWeightKg: null } // 200+ lbs / 90.7+ kg
];

const greco_roman = [
  { class: "Bantamweight", maxWeightKg: 60, maxWeightLbs: 132.2 },
  { class: "Lightweight", maxWeightKg: 67, maxWeightLbs: 147.7 },
  { class: "Welterweight", maxWeightKg: 77, maxWeightLbs: 169.7 },
  { class: "Middleweight", maxWeightKg: 87, maxWeightLbs: 191.8 },
  { class: "Heavyweight", maxWeightKg: 97, maxWeightLbs: 213.8 },
  { class: "Super Heavyweight", maxWeightKg: 130, maxWeightLbs: 286.6 }
];

const freestyle = [
  { class: "Flyweight", maxWeightKg: 57, maxWeightLbs: 125.6 },
  {
    class: "Featherweight",
    maxWeightKg: 65,
    maxWeightLbs: 143.3
  },
  {
    class: "Welterweight",
    maxWeightKg: 74,
    maxWeightLbs: 163.1
  },
  {
    class: "Middleweight",
    maxWeightKg: 86,
    maxWeightLbs: 189.6
  },
  {
    class: "Light Heavyweight",
    maxWeightKg: 97,
    maxWeightLbs: 213.8
  },
  {
    class: "Heavyweight",
    maxWeightKg: 125,
    maxWeightLbs: 275.5
  },

  {
    class: "Women - Flyweight",
    maxWeightKg: 50,
    maxWeightLbs: 110.2
  },
  {
    class: "Women - Bantamweight",
    maxWeightKg: 53,
    maxWeightLbs: 116.8
  },
  {
    class: "Women - Lightweight",
    maxWeightKg: 57,
    maxWeightLbs: 125.6
  },
  {
    class: "Women - Middleweight",
    maxWeightKg: 62,
    maxWeightLbs: 136.6
  },
  {
    class: "Women - Light Heavyweight",
    maxWeightKg: 68,
    maxWeightLbs: 149.9
  },
  {
    class: "Women - Heavyweight",
    maxWeightKg: 76,
    maxWeightLbs: 167.5
  }
];

const mma = [
  { class: "Strawweight", maxWeightLbs: 115, maxWeightKg: 52.2 },
  { class: "Flyweight", maxWeightLbs: 125, maxWeightKg: 56.7 },
  { class: "Bantamweight", maxWeightLbs: 135, maxWeightKg: 61.2 },
  { class: "Featherweight", maxWeightLbs: 145, maxWeightKg: 65.8 },
  { class: "Lightweight", maxWeightLbs: 155, maxWeightKg: 70.3 },
  { class: "Welterweight", maxWeightLbs: 170, maxWeightKg: 77.1 },
  { class: "Middleweight", maxWeightLbs: 185, maxWeightKg: 83.9 },
  { class: "Light Heavyweight", maxWeightLbs: 205, maxWeightKg: 93.0 },
  { class: "Heavyweight", maxWeightLbs: 265, maxWeightKg: 120.2 }
];

const boxing = [
  {
    class: "Strawweight",
    maxWeightLbs: 105,
    maxWeightKg: 47.6
  },
  { class: "Light Flyweight", maxWeightLbs: 108, maxWeightKg: 49.0 },
  { class: "Flyweight", maxWeightLbs: 112, maxWeightKg: 50.8 },
  { class: "Super Flyweight", maxWeightLbs: 115, maxWeightKg: 52.2 },
  { class: "Bantamweight", maxWeightLbs: 118, maxWeightKg: 53.5 },
  { class: "Super Bantamweight", maxWeightLbs: 122, maxWeightKg: 55.3 },
  { class: "Featherweight", maxWeightLbs: 126, maxWeightKg: 57.2 },
  { class: "Super Featherweight", maxWeightLbs: 130, maxWeightKg: 59.0 },
  { class: "Lightweight", maxWeightLbs: 135, maxWeightKg: 61.2 },
  { class: "Super Lightweight", maxWeightLbs: 140, maxWeightKg: 63.5 },
  { class: "Welterweight", maxWeightLbs: 147, maxWeightKg: 66.7 },
  { class: "Super Welterweight", maxWeightLbs: 154, maxWeightKg: 69.9 },
  { class: "Middleweight", maxWeightLbs: 160, maxWeightKg: 72.6 },
  { class: "Super Middleweight", maxWeightLbs: 168, maxWeightKg: 76.2 },
  { class: "Light Heavyweight", maxWeightLbs: 175, maxWeightKg: 79.4 },
  { class: "Cruiserweight", maxWeightLbs: 200, maxWeightKg: 90.7 },
  { class: "Heavyweight", maxWeightLbs: null, maxWeightKg: null } // 200+ lbs / 90.7+ kg
];

export const weightClassesBySport = {
  muay_thai,
  greco_roman,
  freestyle,
  mma,
  boxing
};
