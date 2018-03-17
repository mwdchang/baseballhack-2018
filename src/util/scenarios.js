const players = [
  { id: 'thomafr04', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/e/e31675e7_davis.jpg' },
  { id: 'troutmi01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/f/f322d40f_mlbam.jpg' },
  { id: 'hamiljo03', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/c/c5530155_mlbam.jpg' },
  { id: 'belleal01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/1/1d993b9b_davis.jpg' },
  { id: 'kershcl01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/0/0caa3053_mlbam.jpg' },
  { id: 'harpebr03', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/c/c61e922e_mlbam.jpg' },
  { id: 'stantmi03', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/8/87f6986b_mlbam.jpg' }
];

const sc1 = {
  id: 'hall-worth',
  name: 'Hall of fame worthy',
  players: players,
  xaxis: ['Underrated', 'Overrated'],
  yaxis: ['Replacement-level', 'Hall worthy']
};

const sc2 = {
  id: 'talented-jerk',
  name: 'Talented or just a jerk',
  players: players,
  xaxis: ['Jerk', 'Nice'],
  yaxis: ['Pedestrian', 'Talented']
};

const sc3 = {
  id: 'bench-or-start',
  name: 'Starter or bench warmer',
  players: players,
  xaxis: ['Bench', 'Start'],
  yaxis: ['', '']
};

const sc4 = {
  id: 'sc4',
  name: 'Taking our the aggresions',
  players: players,
  xaxis: ['Too passive', 'Too aggressive'],
  yaxis: ['Bad player', 'Good player']
};

const sc5 = {
  id: 'sc5',
  name: 'Contract salary - what do they deserve',
  players: players,
  xaxis: ['1 million', '15 million'],
  yaxis: ['1 year', '7 years']
};

const sc6 = {
  id: 'sc6',
  name: 'Worst signing/trade ever',
  players: players,
  xaxis: ['Worst', 'Best'],
  yaxis: ['Low impact', 'High impact']
};


const scenarios = [
  sc1, sc2, sc3, sc4, sc5, sc6
];


export default class Scenarios {
  static getScenario() {
    return scenarios[4];
  }

  static getRandomScenario() {
    const idx = Math.floor(Math.random() * scenarios.length);
    return scenarios[idx];
  }
}
