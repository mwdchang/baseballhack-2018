<template>
  <div id="app">
    <h2>The Opinionator <i class="fa fa-refresh refresh" @click="switchScenario"></i></h2>
    <div><small>Your opinion matters!!</small></div>
    <survey :sc="scenario"/>
  </div>
</template>

<script>
import Survey from './components/survey';
import Scenarios from './util/scenarios';
import FB from './util/firebase';
import Stats from './util/stats';

export default {
  name: 'App',
  data() {
    return {
      scenario: null
    };
  },
  components: {
    Survey
  },
  mounted() {
    FB.init();
    this.scenario = Scenarios.getScenario();
    d3.csv('static/Batting.csv', function(data) {
      Stats.loadBatting(data);
    });
  },
  methods: {
    switchScenario() {
      this.scenario = Scenarios.getRandomScenario();
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

h3, h2 {
  margin-bottom: 5px;
  margin-top: 5px;
}


.refresh:hover {
  color: #F80;
  cursor: pointer;
}

body {
  background: #FCFCFC;
}

</style>
