<template>
  <div class="survey">
    <div class="container">
      <svg class="canvas"></svg>
    </div>
    <div class="button">Submit</div>
  </div>
</template>

<script>
export default {
  name: 'survey',
  data() {
    return {
      players: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4}
      ],
      xaxis: ['Underrated', 'Overrated'],
      yaxis: ['Replacement-level', 'Hall worthy']
    }
  },
  mounted() {
    this.canvas = d3.select('.canvas');
    this.initialize();
    this.createScenario();
  },
  methods: {
    createScenario() {
      const testImg = 'https://d3k2oh6evki4b7.cloudfront.net/req/201802130/images/headshots/e/e31675e7_davis.jpg';
      function dragstarted(d) {
      }
      
      function dragged(d) {
        d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
      }
      
      function dragended(d) {
      }

      const drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
        
      this.canvas.selectAll('.avatar')
        .data(this.players)
        .enter()
        .append('image')
        .classed('avatar', true)
        .attr('xlink:href', testImg)
        .attr('width', 50)
        .attr('height', 50)
        .attr('x', (d, i) => i*100)
        .attr('y', (d, i) => i*100)
        .call(drag);
    },
    initialize() {
      const xmid = 250;
      const ymid = 250;

      this.canvas.append('rect')
        .attr('x', 0)
        .attr('y', ymid)
        .attr('width', 500)
        .attr('height', 1)
        .style('stroke', null)
        .style('fill', '#BBB');

      this.canvas.append('rect')
        .attr('x', xmid)
        .attr('y', 0)
        .attr('width', 1)
        .attr('height', 500)
        .style('stroke', null)
        .style('fill', '#BBB');
      }
  }
}
</script>

<style>
.survey {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 500px;
  height: 500px;
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

.avatar {
  width: 30;
  height: 30;
}

</style>

