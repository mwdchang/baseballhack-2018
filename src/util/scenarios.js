const sc1 = {
  players: [
    { id: 'thomafr04', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/e/e31675e7_davis.jpg' },
    { id: 'troutmi01', img: 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/f/f322d40f_mlbam.jpg' }
  ],
  xaxis: ['Underrated', 'Overrated'],
  yaxis: ['Replacement-level', 'Hall worthy']
};

const scenarios = [
  sc1
];


export default class Scenarios {
  static getScenario() {
    return scenarios[0];
  }
}
