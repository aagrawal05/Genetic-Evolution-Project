var population,maxpop;
let mutationRate, reproductionRate;
let width, height;
let minGene, maxGene;
var slider = document.getElementById("SlIdEr");
function setup() {
  width = 1280;
  height = 720;
  createCanvas(width,height);
  frameRate(5);
  mutationRate = 0.01;
  reproductionRate = 0.005;
  minGene = 0.5;
  maxGene = 1;
  maxpop = 50;
  population = new Population(maxpop);
}
function draw() {
  background(51);
  population.run();
  frameRate((int)(slider.value));
  //text(population.bestspecies(),10,10);
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
  eat(pop) { // Perhaps make it so that people who eat more get a higher reproduction chance to further support fitness
    var toRemove = [];
    for (var i = pop.length-1; i >= 0; i--) {
      for (var j = pop.length-1; j >= 0; j--) {
        if (j != i){
          var d = p5.Vector.dist(pop[i].position, pop[j].position);
          if (d < pop[i].size/2 && pop[i].size>pop[j].size/*(1.2)*/) { // Maybe times 1.2?
            pop[i].hp += Math.floor(pop[j].hp*0.75);; // Perhaps unbalanced?
            toRemove.push(pop[j]);
          }
        }
      }  
    }
    pop = pop.filter((x) => !toRemove.includes(x));
    return pop;
  }
  // bestspecies(){
  //   var unique = set(this.POP);
  //   var uniqueCount = [0]*unique.length;
  //   for(var i = 0; i<unique.length; i++){
  //     for(var j = 0; j<this.POP.length; j++){
  //       if (this.POP[i] = unique[i]){
  //         uniqueCount[i]+=1
  //       }
  //     }
  //   }
  //   var species = ((Math.trunc(unique[uniqueCount.indexOf(max(uniqueCount))].dna.genes[0]))*10).toString()+((Math.trunc(unique[uniqueCount.indexOf(max(uniqueCount))].dna.genes[1]))*10).toString();
  //   return "S"+species;
  // }
}
class Individual{
  constructor(Vect,DnA){
    this.position = Vect;
    if(DnA != null){
      this.dna = DnA
    } else {
      this.dna = new DNA();
    }
    this.size = Math.floor(this.dna.genes[0]*100);
    this.speed = Math.floor(50/this.dna.genes[0] * this.dna.genes[1]*2);
    this.hp = Math.floor(this.dna.genes[0]*200);
  }
  update(){
    if (this.position.x < -this.size) this.position.x = width+this.size;
    if (this.position.y < -this.size) this.position.y = height +this.size;
    if (this.position.x > width+this.size) this.position.x = -this.size;
    if (this.position.y > height+this.size) this.position.y = -this.size;
    this.position.x += random(-this.speed,this.speed);
    this.position.y += random(-this.speed,this.speed);
    this.hp-=this.dna.genes[1];
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
    this.update();
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
        random(minGene,maxGene), //SIZE
        random(minGene,maxGene), //METABOLISM
      ];
    }
  }
  mutate() {
    for (var i = 0; i < this.genes.length; i++) {
      if (random() < mutationRate) {
        this.genes[i] = random(minGene,maxGene);
      }
    }
  }
}