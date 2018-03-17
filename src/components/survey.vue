<template>
  <div class="main-container">
    <div class="survey">
      <span v-if="scenario">{{scenario.id}} (You)</span>
      <div class="survey-container">
        <svg class="canvas"></svg>
      </div>
      <div class="button" @click="submit">Submit</div>
    </div>
    <div class="result">
      <span v-if="scenario">{{scenario.id}} (Everyone else)</span>
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
      scenario: null
    }
  },
  watch: {
    sc: function scChanged() {
      if (this.sc === null) return;

      this.canvas = d3.select('.canvas');
      this.canvas.selectAll('*').remove();

      this.scenario = _.cloneDeep(this.sc);
      this.initialize();
      this.create();
    }
  },
  mounted() {
    d3.select('.survey-container')
      .style('width', W+'px')
      .style('height', H+'px');
    /*
    this.initialize();
    this.create();
    */
  },
  methods: {
    submit() {
      const data = this.canvas.selectAll('.player').data();
      const key = (new Date()).getTime();

      FB.writeDB('/bh2018' + this.scenario.id + '/' + key, {'test':1});
    },
    create() {
      this.scenario.players.forEach( player => {
        player.x = Math.random()*W;
        player.y = Math.random()*H;
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
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y)
        .call(drag);
    },
    initialize() {
      const xmid = W * 0.5;
      const ymid = H * 0.5;

      const xaxis = this.scenario.xaxis;
      const yaxis = this.scenario.yaxis;

      this.canvas.append('rect')
        .attr('x', 0)
        .attr('y', ymid)
        .attr('width', W)
        .attr('height', 1)
        .style('stroke', null)
        .style('fill', '#CCC');

      this.canvas.append('rect')
        .attr('x', xmid)
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', H)
        .style('stroke', null)
        .style('fill', '#CCC');
      
      this.canvas.append('text')
        .attr('x', 0)
        .attr('y', ymid)
        .text(xaxis[0]);

      this.canvas.append('text')
        .attr('x', W)
        .attr('y', ymid)
        .style('text-anchor', 'end')
        .text(xaxis[1]);

      this.canvas.append('text')
        .attr('x', xmid)
        .attr('y', 15)
        .style('text-anchor', 'middle')
        .text(yaxis[1]);

      this.canvas.append('text')
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

