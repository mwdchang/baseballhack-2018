<template>
  <div class="main-container">

    <div class="survey">
      <span v-if="scenario"><strong>{{scenario.name}}</strong></span>
      <div class="survey-container">
        <svg class="canvas-survey">
          <g></g>
        </svg>
      </div>
      <div style="display:flex; flex-direction: row">
        <div class="button" @click="submit">Submit</div>
        <div class="button" @click="view">View</div>
      </div>
    </div>

    <div class="result" v-if="showResult === true">
      <span v-if="scenario"><strong>{{scenario.name}} (Average opinion)</strong></span>
      <div class="result-container">
        <svg class="canvas-result">
          <g></g>
        </svg>
      </div>
      <div class="button" @click="animate">Animate</div>
    </div>

    <div class="chart" v-if="showResult === true">
      <span><strong>Difference</strong></span>
      <div class="chart-container">
        <svg class="canvas-chart">
          <g></g>
        </svg>
      </div>
    </div>


  </div>
</template>

<script>

const H = 470;
const W = 470;

const formatter = d3.format(',');

import FB from '../util/firebase';
import Stats from '../util/stats';

export default {
  name: 'survey',
  props: ['sc'],
  data() {
    return {
      scenario: null,
      showResult: false
    }
  },
  watch: {
    sc: function scChanged() {
      if (this.sc === null) return;

      this.showResult = false;
      this.canvas = d3.select('.canvas-survey').select('g');
      this.canvas.selectAll('*').remove();

      this.scenario = _.cloneDeep(this.sc);
      this.initialize(this.canvas);
      this.create();
    }
  },
  mounted() {
  },
  methods: {
    animate() {
      const resultCanvas = d3.select('.canvas-result').select('g');
      resultCanvas.selectAll('.player')
        .transition()
        .duration(800)
        .ease(d3.easeLinear)
        .attr('x', (d) => {
          return _.find(this.scenario.players, p => p.id === d.id).x;
        })
        .attr('y', (d) => {
          return _.find(this.scenario.players, p => p.id === d.id).y;
        });

      setTimeout(()=> {
        resultCanvas.selectAll('.player')
          .transition()
          .duration(800)
          .ease(d3.easeLinear)
          .attr('x', (d) => {
            return d.x;
          })
          .attr('y', (d) => {
            return d.y;
          });
      }, 1000);
    },
    view() {
      setTimeout(() => {
        this.showResult = true;
        this.processResults();
      }, 300);
    },
    submit() {
      const data = this.canvas.selectAll('.player').data();
      const key = (new Date()).getTime();

      FB.writeDB('/bh2018' + this.scenario.id + '/' + key, this.scenario.players);
      this.showResult = true;
      setTimeout(() => {
        this.processResults();
      }, 300);
    },
    processResults() {
      FB.readDB('/bh2018' + this.scenario.id).then( resp => {
        const results = resp.val();
        const len = Object.keys(results).length;
        const agg = {};

        _.forEach(results, (v, k) => {
          v.forEach( player => {
            const id = player.id;
            if (agg.hasOwnProperty(id) === false) {
              agg[id] = {x:0, y:0, img: player.img};
            }
            agg[id].x += player.x;
            agg[id].y += player.y;
          });
        });

        _.forEach(agg, (v, k) => {
          v.x /= len;
          v.y /= len;
        });

        this.renderOther(agg);
      });
    },
    renderOther(agg) {
      const chartCanvas = d3.select('.canvas-chart').select('g');
      chartCanvas.selectAll('*').remove();

      const resultCanvas = d3.select('.canvas-result').select('g');
      resultCanvas.selectAll('*').remove();
      this.initialize(resultCanvas);

      let players = [];
      _.forEach(agg, (v, k) => {
        players.push({
          id: k,
          x: v.x,
          y: v.y,
          img: v.img
        });
      });

      resultCanvas.selectAll('.player')
        .data(players)
        .enter()
        .append('image')
        .classed('player', true)
        .attr('xlink:href', d => d.img)
        .attr('width', 50)
        .attr('height', 50)
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y)
        .style('opacity', 0.85)
        .on('mouseover', (d) => {
          const player = Stats.getPlayer(d.id);
          resultCanvas.append('rect')
            .classed('annotation', true)
            .attr('x', d.x-2)
            .attr('y', d.y-2)
            .attr('width', 54)
            .attr('height', 54)
            .style('fill', 'none')
            .style('stroke', '#389')
            .style('stroke-width', 1);

          resultCanvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+10)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('AB: ' + formatter(player['AB']));
          resultCanvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+30)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('H: ' + formatter(player['H']));
          resultCanvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+50)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('HR: ' + formatter(player['HR']));
        })
        .on('mouseout', ()=> {
          d3.selectAll('.annotation').remove();
        })
        .on('click', (d) => {
          let url = 'https://www.baseball-reference.com/players/' + d.id.substring(0, 1) + '/' + d.id + '.shtml';
          window.open(url);
        });

      let bars = chartCanvas.selectAll('.bar')
        .data(this.scenario.players)
        .enter()
        .append('g')
        .classed('bar', true)
        .attr('transform', (d, i) => {
          return 'translate(10,' + (5 + i*60) + ')';
        });

      bars.append('image')
        .attr('width', 50)
        .attr('height', 50)
        .attr('xlink:href', d => d.img)
        .style('cursor', 'pointer')
        .on('click', (d) => {
          let url = 'https://www.baseball-reference.com/players/' + d.id.substring(0, 1) + '/' + d.id + '.shtml';
          window.open(url);
        });


      bars.append('rect')
        .attr('x', 50)
        .attr('y', 20)
        .attr('height', 20)
        .attr('width', (d) => {

          const o = agg[d.id];
          const dist = Math.sqrt( (o.x - d.x)*(o.x - d.x) + (o.y - d.y)*(o.y - d.y) );
          return dist * 0.25;
        })
        .style('fill', '#F11');

    },
    create() {
      this.scenario.players.forEach( player => {
        player.x = 25 + Math.random()*(W - 50);
        player.y = 25 + Math.random()*(H - 50);
      });

      function dragstarted(d) {
        d3.selectAll('.annotation').remove();
      }
      function dragged(d) {
        d3.select(this)
          .attr("x", () => {
            d.x = d3.event.x;
            return d.x;
          })
          .attr("y", () => {
            d.y = d3.event.y;
            return d.y;
          });
      }
      function dragended(d) {
      }

      const drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
        
      this.canvas.selectAll('.player')
        .data(this.scenario.players)
        .enter()
        .append('image')
        .classed('player', true)
        .attr('xlink:href', d => d.img)
        .attr('width', 50)
        .attr('height', 50)
        .style('opacity', 0.85)
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y)
        .on('mouseover', (d) => {
          const player = Stats.getPlayer(d.id);
          this.canvas.append('rect')
            .classed('annotation', true)
            .attr('x', d.x-2)
            .attr('y', d.y-2)
            .attr('width', 54)
            .attr('height', 54)
            .style('fill', 'none')
            .style('stroke', '#389')
            .style('stroke-width', 1);

          this.canvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+10)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('AB: ' + formatter(player['AB']));
          this.canvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+30)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('H: ' + formatter(player['H']));
          this.canvas.append('text')
            .classed('annotation', true)
            .attr('x', d.x+65)
            .attr('y', d.y+50)
            .style('stroke', 'none')
            .style('fill', '#389')
            .style('font-size', '13')
            .text('HR: ' + formatter(player['HR']));
        })
        .on('mouseout', ()=> {
          d3.selectAll('.annotation').remove();
        })
        .on('click', (d) => {
          let url = 'https://www.baseball-reference.com/players/' + d.id.substring(0, 1) + '/' + d.id + '.shtml';
          window.open(url);
        })
        .call(drag);
    },
    initialize(canvas) {
      d3.select('.survey-container')
        .style('width', W+'px')
        .style('height', H+'px');

      d3.select('.result-container')
        .style('width', W+'px')
        .style('height', H+'px');

      d3.select('.chart-container')
        .style('width', '200px')
        .style('height', H+'px');


      const xmid = W * 0.5;
      const ymid = H * 0.5;

      const xaxis = this.scenario.xaxis;
      const yaxis = this.scenario.yaxis;

      canvas.append('rect')
        .attr('x', 10)
        .attr('y', ymid)
        .attr('width', W-20)
        .attr('height', 1)
        .style('stroke', null)
        .style('fill', '#AAA');

      canvas.append('rect')
        .attr('x', xmid)
        .attr('y', 10)
        .attr('width', 1)
        .attr('height', H-20)
        .style('stroke', null)
        .style('fill', '#AAA');
      
      canvas.append('text')
        .attr('x', 10)
        .attr('y', ymid)
        .style('font-weight', 600)
        .text(xaxis[0]);

      canvas.append('text')
        .attr('x', W-10)
        .attr('y', ymid)
        .style('font-weight', 600)
        .style('text-anchor', 'end')
        .text(xaxis[1]);

      canvas.append('text')
        .attr('x', xmid)
        .attr('y', 20)
        .style('font-weight', 600)
        .style('text-anchor', 'middle')
        .text(yaxis[1]);

      canvas.append('text')
        .attr('x', xmid)
        .attr('y', H-10)
        .style('font-weight', 600)
        .style('text-anchor', 'middle')
        .text(yaxis[0]);
    }
  }
}
</script>

<style>
.main-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.survey, .result {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}

.button {
  margin: 5px;
  padding: 3px;
  background: #ddd;
  border: 1px solid #444;
  border-radius: 4px;
  font-weight: 600;
}

.button:hover {
  background: #eee;
  cursor: pointer;
}

svg {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.player {
  width: 30;
  height: 30;
  cursor: grab;
}
</style>

