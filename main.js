//TO-DO --> UI for changing dummy variables
//TO-DO --> Graph shows highest/lowest size, speed, and angular speed to show range
// ^ https://stackoverflow.com/questions/37866992/filling-area-between-two-lines-chart-js-v2
var population, populationChart, sizeChart, speedChart, angleSpeedChart;
var date = new Date();
const width=800, height=800;
var slider = document.getElementById("fpsSlider");
var speedSlider = document.getElementById("simulationSpeed");
const mutationRate = 0.1, reproductionRate = 0.0005, initialPop = 100;
const sizeCoef=50, speedCoef=500, hpCoef=100, eatCoef=0.5, compareCoef=1.2, costCoef=5;
const minSize = 0.1, minSpeed = 0.1, minAngleSpeed = 0.0;
function setup() {
  var simulationCanvas = createCanvas(width,height);
  simulationCanvas.parent("simulation");
  frameRate(60);
  population = new Population(initialPop);

  let ctx = document.getElementById('populationChart').getContext('2d');
  populationChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data: [{x:0, y:initialPop}],
          label: 'Population',
          fill: false,
          borderColor: '#000000',
          cubicInterpolationMode: 'monotone',
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
          x: {
              type: 'realtime',
              realtime: {
                  onRefresh: chart => {
                      chart.data.datasets[0].data.push({
                          x: Date.now(),
                          y: population.POP.length
                      });
                  }
              }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: initialPop*1.5
          }
      }
    }
  });
  ctx = document.getElementById("sizeChart").getContext('2d');
  sizeChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data: [],
          label: 'Average Size Gene',
          fill: false,
          borderColor: '#ff0000',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Min Size Gene',
          fill: false,
          borderColor: '#ff0000',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Max Size Gene',
          fill: '-1',
          backgroundColor: '#ff6863',
          borderColor: '#ff0000',
          cubicInterpolationMode: 'monotone',
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
            type: 'realtime',
            realtime: {
                onRefresh: chart => {
                    chart.data.datasets[0].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((acc, curr) => acc + curr.dna.genes[0], 0)/population.POP.length
                    })
                    chart.data.datasets[1].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[0] < curr.dna.genes[0] ? prev : curr}).dna.genes[0]
                    })
                    chart.data.datasets[2].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[0] > curr.dna.genes[0] ? prev : curr}).dna.genes[0]
                    })
                }
            }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 1
        }
      }
    }
  });
  ctx = document.getElementById("speedChart").getContext('2d');
  speedChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data: [],
          label: 'Average Speed Gene',
          fill: false,
          borderColor: '#00ff00',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Min Size Gene',
          fill: false,
          borderColor: '#00ff00',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Max Size Gene',
          fill: '-1',
          backgroundColor: '#90ee90',
          borderColor: '#00ff00',
          cubicInterpolationMode: 'monotone',
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
            type: 'realtime',
            realtime: {
                onRefresh: chart => {
                    chart.data.datasets[0].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((acc, curr) => acc + curr.dna.genes[1], 0)/population.POP.length
                    });
                    chart.data.datasets[1].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[1] < curr.dna.genes[1] ? prev : curr}).dna.genes[1]
                    })
                    chart.data.datasets[2].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[1] > curr.dna.genes[1] ? prev : curr}).dna.genes[1]
                    })
                }
            }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 1
        }
      }
    }
  });
  ctx = document.getElementById("angularSpeedChart").getContext('2d');
  angleSpeedChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data: [],
          label: 'Average Angular Speed Gene',
          fill: false,
          borderColor: '#0000ff',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Min Size Gene',
          fill: false,
          borderColor: '#0000ff',
          cubicInterpolationMode: 'monotone',
        },
        {
          data: [],
          label: 'Max Size Gene',
          fill: '-1',
          backgroundColor: '#add8e6',
          borderColor: '#0000ff',
          cubicInterpolationMode: 'monotone',
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
            type: 'realtime',
            realtime: {
                onRefresh: chart => {
                    chart.data.datasets[0].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((acc, curr) => acc + curr.dna.genes[2], 0)/population.POP.length
                    });
                    chart.data.datasets[1].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[2] < curr.dna.genes[2] ? prev : curr}).dna.genes[2]
                    })
                    chart.data.datasets[2].data.push({
                        x: Date.now(),
                        y: population.POP.reduce((prev, curr) => {return prev.dna.genes[2] > curr.dna.genes[2] ? prev : curr}).dna.genes[2]
                    })
                }
            }
        },
        y: {
          suggestedMin: 0,
          suggestedMax: 1
        }
      }
    }
  });
  document.body.style.zoom = "90%" 
}
function draw() {
  background(51);
  if (population.POP.length == 0){
    population = new Population(initialPop);
  }
  population.run();
  frameRate((int)(slider.value));
}
function mousePressed(){
  if(mouseX<width && mouseX>0 && mouseY<height && mouseY>0){
    population.POP.push(new Individual(createVector(mouseX, mouseY)));
  }
}
function mouseDragged(){
  if(mouseX<width && mouseX>0 && mouseY<height && mouseY>0){
    population.POP.push(new Individual(createVector(mouseX, mouseY)));
  }  
}
class Population {
  constructor(pop) {
      this.POP = [];
      for (var i = 0; i<pop; i++){
        this.POP.push(new Individual(createVector(random(width),random(height))));
      }
  }
  run(){
    this.POP = this.eat(this.POP);
    for (var i = this.POP.length-1; i >= 0; i--) {
      this.POP[i].Run();
      var child = this.POP[i].reproduce();
      if (child != null) this.POP.push(child);
      if (this.POP[i].dead()) {
        this.POP.splice(i,1);
      }
    }
  }
  eat(pop) {
    var toRemove = [];
    for (var i = pop.length-1; i >= 0; i--) {
      for (var j = pop.length-1; j >= 0; j--) {
        if (j != i){
          var d = p5.Vector.dist(pop[i].position, pop[j].position);
          if (d < pop[i].size/2 && pop[i].size>pop[j].size*compareCoef) {
            pop[i].hp += Math.floor(pop[j].hp*eatCoef);
            toRemove.push(pop[j]);
          }
        }
      }  
    }
    pop = pop.filter((x) => !toRemove.includes(x));
    return pop;
  }
}
class Individual {
  constructor(Vect,DnA){
    this.position = Vect;
    if(DnA != null){
      this.dna = DnA
    } else {
      this.dna = new DNA();
    }
    this.size = Math.floor(this.dna.genes[0]*sizeCoef);
    this.speed = Math.floor(this.dna.genes[1]*speedCoef);
    this.angleSpeed = this.dna.genes[2]*TWO_PI;
    this.hp = Math.floor(this.dna.genes[0]*hpCoef);
    this.angle = random(TWO_PI);
  }
  update(dt){
    this.angle += random(-this.angleSpeed*dt, this.angleSpeed*dt);
    this.position.x += cos(this.angle) * this.speed * dt;
    this.position.y += sin(this.angle) * this.speed * dt;
    if (this.position.x < -this.size) this.position.x = width+this.size;
    if (this.position.y < -this.size) this.position.y = height +this.size;
    if (this.position.x > width+this.size) this.position.x = -this.size;
    if (this.position.y > height+this.size) this.position.y = -this.size;
    this.hp-=  this.dna.genes[0] * costCoef * dt;
  }
  show(){
    ellipseMode(CENTER);
    stroke(0,this.hp);
    fill(0, this.hp);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
  reproduce() {
    if (random(1) < reproductionRate) {
      var childDNA = this.dna;
      childDNA.mutate();
      return new Individual(createVector(random(width),random(height)), childDNA);
    } 
    else {
      return null;
    } 
  }
  Run(){
    this.update(((int)(speedSlider.value))/((int)(slider.value)));
    this.show();
  }
  dead() {
    if (this.hp <= 0.0) {
      return true;
    } 
    else {
      return false;
    }
  }
}
class DNA{
  constructor(newgenes){
    if(newgenes != null){
      this.genes = newgenes;
    } else {
      this.genes = [
        random(minSize, 1), //SIZE
        random(minSpeed, 1), //SPEED
        random(minAngleSpeed, PI/2), //ANGLESPEED
      ];
    }
  }
  mutate() {
    for (var i = 0; i < this.genes.length; i++) {
      if (random() < mutationRate) {
        this.genes[i] = random();
      }
    }
  }
}