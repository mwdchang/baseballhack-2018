<template>
  <div class="container">
    <svg class="canvas"></svg>
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
      ]
    }
  },
  mounted() {
    const canvas = d3.select('.canvas');
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
      
    canvas.selectAll('.avatar')
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
  }

}
</script>

<style>
.container {
  width: 500px;
  height: 500px;
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

