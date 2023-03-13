//TO-DO --> UI for changing dummy variables
//TO-DO --> Graph shows highest/lowest size, speed, and angular speed to show range
// ^ https://stackoverflow.com/questions/37866992/filling-area-between-two-lines-chart-js-v2
var population, populationChart, sizeChart, speedChart, angleSpeedChart;
var date = new Date();
const width = 800,
    height = 1125;
var slider = document.getElementById("fpsSlider");
var speedSlider = document.getElementById("simulationSpeed");
var speedCSlider = document.getElementById("speedCCoef");
var sizeSlider = document.getElementById("sizeCoef");
var mutationSlider = document.getElementById("mutationCoef");
var reproductionSlider = document.getElementById("reproductionCoef");
var hpSlider = document.getElementById("hpCoef");
var eatSlider = document.getElementById("eatCoef");
var compareSlider = document.getElementById("compareCoef");
var costSlider = document.getElementById("costCoef");
var initialSlider = document.getElementById("initialCoef");

let mutationRate = 0.1,
    reproductionRate = 0.2,
    initialPop = 50;
let sizeCoef = 50,
    speedCoef = 500,
    hpCoef = 100,
    eatCoef = 1,
    compareCoef = 1.25,
    costCoef = 18.5;
const minSize = 0.1,
    minSpeed = 0.1,
    minAngleSpeed = 0.0;

//Brief description of the above hyperparameters:
/*
mutationRate: The chance that a gene will mutate
reproductionRate: The chance that a gene will be passed on to the next generation
initialPop: The initial population size
sizeCoef: The coefficient for the size of the individual
speedCoef: The coefficient for the speed of the individual
hpCoef: The coefficient for the health of the individual
eatCoef: The coefficient for the amount of food the individual eats
compareCoef: The coefficient for the proportion of the individual's size to the food's size to be able to eat it
costCoef: The coefficient for the cost of the individual proportional to its size
minSize: The minimum size of the individual
minSpeed: The minimum speed of the individual
minAngleSpeed: The minimum angular speed of the individual
*/

function setup() {
    var simulationCanvas = createCanvas(width, height);
    simulationCanvas.parent("canvasParent");
    frameRate(60);
    population = new Population(initialPop);

    let ctx = document.getElementById("populationChart").getContext("2d");
    populationChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    data: [{ x: Date.now(), y: initialPop }],
                    label: "Population",
                    fill: false,
                    borderColor: "#000000",
                    cubicInterpolationMode: "monotone",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "realtime",
                    realtime: {
                        onRefresh: (chart) => {
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y: population.POP.length,
                            });
                        },
                    },
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: initialPop * 1.5,
                },
            },
        },
    });
    ctx = document.getElementById("sizeChart").getContext("2d");
    sizeChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    data: [],
                    label: "Average Size Gene",
                    fill: false,
                    borderColor: "#ff0000",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Min Size Gene",
                    fill: false,
                    borderColor: "#ff0000",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Max Size Gene",
                    fill: "-1",
                    backgroundColor: "#ff6863",
                    borderColor: "#ff0000",
                    cubicInterpolationMode: "monotone",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "realtime",
                    realtime: {
                        onRefresh: (chart) => {
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y:
                                    population.POP.reduce(
                                        (acc, curr) => acc + curr.dna.genes[0],
                                        0
                                    ) / population.POP.length,
                            });
                            chart.data.datasets[1].data.push({
                                x: Date.now(),
                                y: population.POP.reduce((prev, curr) => {
                                    return prev.dna.genes[0] < curr.dna.genes[0]
                                        ? prev
                                        : curr;
                                }).dna.genes[0],
                            });
                            chart.data.datasets[2].data.push({
                                x: Date.now(),
                                y: population.POP.reduce((prev, curr) => {
                                    return prev.dna.genes[0] > curr.dna.genes[0]
                                        ? prev
                                        : curr;
                                }).dna.genes[0],
                            });
                        },
                    },
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: 1,
                },
            },
        },
    });
    ctx = document.getElementById("speedChart").getContext("2d");
    speedChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    data: [],
                    label: "Average Speed Gene",
                    fill: false,
                    borderColor: "#00ff00",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Min Speed Gene",
                    fill: false,
                    borderColor: "#00ff00",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Max Speed Gene",
                    fill: "-1",
                    backgroundColor: "#90ee90",
                    borderColor: "#00ff00",
                    cubicInterpolationMode: "monotone",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "realtime",
                    realtime: {
                        onRefresh: (chart) => {
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y:
                                    population.POP.reduce(
                                        (acc, curr) => acc + curr.dna.genes[1],
                                        0
                                    ) / population.POP.length,
                            });
                            chart.data.datasets[1].data.push({
                                x: Date.now(),
                                y: population.POP.reduce((prev, curr) => {
                                    return prev.dna.genes[1] < curr.dna.genes[1]
                                        ? prev
                                        : curr;
                                }).dna.genes[1],
                            });
                            chart.data.datasets[2].data.push({
                                x: Date.now(),
                                y: population.POP.reduce((prev, curr) => {
                                    return prev.dna.genes[1] > curr.dna.genes[1]
                                        ? prev
                                        : curr;
                                }).dna.genes[1],
                            });
                        },
                    },
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: 1,
                },
            },
        },
    });
    ctx = document.getElementById("angularSpeedChart").getContext("2d");
    angleSpeedChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [
                {
                    data: [],
                    label: "Average Angular Speed Gene",
                    fill: false,
                    borderColor: "#0000ff",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Min Angular Speed Gene",
                    fill: false,
                    borderColor: "#0000ff",
                    cubicInterpolationMode: "monotone",
                },
                {
                    data: [],
                    label: "Max Angular Speed Gene",
                    fill: "-1",
                    backgroundColor: "#add8e6",
                    borderColor: "#0000ff",
                    cubicInterpolationMode: "monotone",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "realtime",
                    realtime: {
                        onRefresh: (chart) => {
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y:
                                    population.POP.reduce(
                                        (acc, curr) => acc + curr.dna.genes[2],
                                        0
                                    ) /
                                    population.POP.length /
                                    (PI / 2),
                            });
                            chart.data.datasets[1].data.push({
                                x: Date.now(),
                                y:
                                    population.POP.reduce((prev, curr) => {
                                        return prev.dna.genes[2] <
                                            curr.dna.genes[2]
                                            ? prev
                                            : curr;
                                    }).dna.genes[2] /
                                    (PI / 2),
                            });
                            chart.data.datasets[2].data.push({
                                x: Date.now(),
                                y:
                                    population.POP.reduce((prev, curr) => {
                                        return prev.dna.genes[2] >
                                            curr.dna.genes[2]
                                            ? prev
                                            : curr;
                                    }).dna.genes[2] /
                                    (PI / 2),
                            });
                        },
                    },
                },
                y: {
                    suggestedMin: 0,
                    suggestedMax: 1,
                },
            },
        },
    });
}
function restart() {
    population = new Population(initialPop);
}
function draw() {
    background(51);
    if (population.POP.length == 0) {
        restart();
    }
    population.run(int(speedSlider.value) / int(slider.value));
    frameRate(int(slider.value));
    sizeCoef = float(sizeSlider.value);
    mutationRate = float(mutationSlider.value);
    reproductionRate = float(reproductionSlider.value);
    hpCoef = float(hpSlider.value);
    eatCoef = float(eatSlider.value);
    compareCoef = float(compareSlider.value);
    costCoef = float(costSlider.value);
    speedCoef = float(speedCSlider.value);
    initialPop = int(initialSlider.value);
}
function mousePressed() {
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        population.POP.push(new Individual(createVector(mouseX, mouseY)));
    }
}
function mouseDragged() {
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        population.POP.push(new Individual(createVector(mouseX, mouseY)));
    }
}
class Population {
    constructor(pop) {
        this.POP = [];
        for (var i = 0; i < pop; i++) {
            this.POP.push(
                new Individual(createVector(random(width), random(height)))
            );
        }
    }
    run(dt) {
        this.POP = this.eat(this.POP);
        for (var i = this.POP.length - 1; i >= 0; i--) {
            this.POP[i].Run();
            var child = this.POP[i].reproduce(dt);
            if (child != null) this.POP.push(child);
            if (this.POP[i].dead()) {
                this.POP.splice(i, 1);
            }
        }
    }
    eat(pop) {
        var toRemove = [];
        for (var i = pop.length - 1; i >= 0; i--) {
            for (var j = pop.length - 1; j >= 0; j--) {
                if (j != i) {
                    var d = p5.Vector.dist(pop[i].position, pop[j].position);
                    if (
                        d < pop[i].size / 2 &&
                        pop[i].size > pop[j].size * compareCoef
                    ) {
                        pop[i].hp += Math.floor(pop[j].hp * eatCoef);
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
    constructor(Vect, DnA) {
        this.position = Vect;
        if (DnA != null) {
            this.dna = DnA;
        } else {
            this.dna = new DNA();
        }
        this.size = Math.floor(this.dna.genes[0] * sizeCoef);
        this.speed = Math.floor(this.dna.genes[1] * speedCoef);
        this.angleSpeed = this.dna.genes[2] * TWO_PI;
        this.hp = Math.floor(this.dna.genes[0] * hpCoef);
        this.angle = random(TWO_PI);
    }
    update(dt) {
        this.angle += random(-this.angleSpeed * dt, this.angleSpeed * dt);
        this.position.x += cos(this.angle) * this.speed * dt;
        this.position.y += sin(this.angle) * this.speed * dt;
        if (this.position.x < -this.size) this.position.x = width + this.size;
        if (this.position.y < -this.size) this.position.y = height + this.size;
        if (this.position.x > width + this.size) this.position.x = -this.size;
        if (this.position.y > height + this.size) this.position.y = -this.size;
        this.hp -= this.dna.genes[0] * costCoef * dt;
    }
    show() {
        ellipseMode(CENTER);
        stroke(0, this.hp);
        fill(
            this.dna.genes[0] * 255,
            this.dna.genes[1] * 255,
            this.dna.genes[2] * 255,
            this.hp
        );
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
    reproduce(dt) {
        if (random() < reproductionRate * dt) {
            var childDNA = new DNA(JSON.parse(JSON.stringify(this.dna.genes)));
            childDNA.mutate();
            return new Individual(
                createVector(random(width), random(height)),
                childDNA
            );
        } else {
            return null;
        }
    }
    Run() {
        this.update(int(speedSlider.value) / int(slider.value));
        this.show();
    }
    dead() {
        if (this.hp <= 0.0) {
            return true;
        } else {
            return false;
        }
    }
}
class DNA {
    constructor(newgenes) {
        if (newgenes != null) {
            this.genes = newgenes;
        } else {
            this.genes = [
                random(minSize, 1), //SIZE
                random(minSpeed, 1), //SPEED
                random(minAngleSpeed, 1), //ANGLESPEED
            ];
        }
    }
    mutate() {
        for (var i = 0; i < this.genes.length; i++) {
            if (random() < mutationRate) {
                switch (i) {
                    case 0:
                        this.genes[i] = random(minSize, 1);
                        break;
                    case 1:
                        this.genes[i] = random(minSpeed, 1);
                        break;
                    case 2:
                        this.genes[i] = random(minAngleSpeed, 1);
                        break;
                }
            }
        }
    }
}
