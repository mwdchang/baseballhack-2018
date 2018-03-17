let batting = {};

export default class Stats {

  static loadBatting(data) {
    data.forEach( d => {
      let id = d.playerID;
      if (!batting.hasOwnProperty(id)) {
        batting[id] = {
          HR: 0,
          AB: 0,
          H: 0
        };
      }
      batting[id].HR += +d['HR'];
      batting[id].H += +d['H'];
      batting[id].AB += +d['AB'];
    });
    console.log('batting', batting['thomafr04']);
  }

  static getPlayer(id) {
    return batting[id];
  }
}
