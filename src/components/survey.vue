<template>
  <div class="main-container">
    <div class="survey">
      <span v-if="scenario">{{scenario.id}} (You)</span>
      <div class="survey-container">
        <svg class="canvas-survey"></svg>
      </div>
      <div style="display:flex; flex-direction: row">
        <div class="button" @click="submit">Submit</div>
        <div class="button" @click="view">View</div>
      </div>
    </div>
    <div class="result" v-if="showResult === true">
      <span v-if="scenario">{{scenario.id}} (Everyone else)</span>
      <div class="result-container">
        <svg class="canvas-result"></svg>
      </div>
      <div class="button" @click="animate">Animate</div>
    </div>
  </div>
</template>

<script>

const H = 400;
const W = 400;

import FB from '../util/firebase';

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
      this.canvas = d3.select('.canvas-survey');
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
      const resultCanvas = d3.select('.canvas-result');
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
      this.showResult = true;
      this.processResults();
    },
    submit() {
      const data = this.canvas.selectAll('.player').data();
      const key = (new Date()).getTime();

      FB.writeDB('/bh2018' + this.scenario.id + '/' + key, this.scenario.players);
      this.showResult = true;
      setTimeout(() => {
        this.processResults();
      }, 200);
    },
    processResults() {
      FB.readDB('/bh2018' + this.scenario.id).then( resp => {
        const results = resp.val();
        const len = Object.keys(results).length;
        const agg = {};

        console.log('processing result');
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
      const resultCanvas = d3.select('.canvas-result');
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
        .style('opacity', 0.85);
    },
    create() {
      this.scenario.players.forEach( player => {
        player.x = 15 + Math.random()*(W - 30);
        player.y = 15 + Math.random()*(H - 30);
      });

      function dragstarted(d) {
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
        .call(drag);
    },
    initialize(canvas) {
      d3.select('.survey-container')
        .style('width', W+'px')
        .style('height', H+'px');

      d3.select('.result-container')
        .style('width', W+'px')
        .style('height', H+'px');


      const xmid = W * 0.5;
      const ymid = H * 0.5;

      const xaxis = this.scenario.xaxis;
      const yaxis = this.scenario.yaxis;

      canvas.append('rect')
        .attr('x', 0)
        .attr('y', ymid)
        .attr('width', W)
        .attr('height', 1)
        .style('stroke', null)
        .style('fill', '#CCC');

      canvas.append('rect')
        .attr('x', xmid)
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', H)
        .style('stroke', null)
        .style('fill', '#CCC');
      
      canvas.append('text')
        .attr('x', 0)
        .attr('y', ymid)
        .text(xaxis[0]);

      canvas.append('text')
        .attr('x', W)
        .attr('y', ymid)
        .style('text-anchor', 'end')
        .text(xaxis[1]);

      canvas.append('text')
        .attr('x', xmid)
        .attr('y', 15)
        .style('text-anchor', 'middle')
        .text(yaxis[1]);

      canvas.append('text')
        .attr('x', xmid)
        .attr('y', H-5)
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
  margin: 3px;
  padding: 3px;
  background: #bbb;
  border: 1px solid #444;
}

.button:hover {
  background: #ddd;
  cursor: pointer;
}

svg {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}

.player {
  width: 30;
  height: 30;
}
</style>

