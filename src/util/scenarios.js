const sc1 = {
  id: 'hall-worth',
  players: [
    { id: 'thomafr04', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/e/e31675e7_davis.jpg' },
    { id: 'troutmi01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/f/f322d40f_mlbam.jpg' },
    { id: 'hamiljo03', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/c/c5530155_mlbam.jpg' }
  ],
  xaxis: ['Underrated', 'Overrated'],
  yaxis: ['Replacement-level', 'Hall worthy']
};

const sc2 = {
  id: 'talented-jerk',
  players: [
    { id: 'belleal01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/1/1d993b9b_davis.jpg' },
    { id: 'hamiljo03', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/c/c5530155_mlbam.jpg' }
  ],
  xaxis: ['Jerk', 'Nice guy'],
  yaxis: ['Pedestrian', 'Talented']
};


const scenarios = [
  sc1, sc2
];


export default class Scenarios {
  static getScenario() {
    return scenarios[1];
  }

  static getRandomScenario() {
    const idx = Math.floor(Math.random() * scenarios.length);
    return scenarios[idx];
  }
}
