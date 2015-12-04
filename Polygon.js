var Polygon = function(coords){
  this.coords = coords;
  var size = coords.length;
  this.x_min = coords[0][0];
  this.x_max = coords[0][0];
  this.y_min = coords[0][1];
  this.y_max = coords[0][1];
  for(var i = 0 ; i < size-1 ; i++){
    if(this.x_max < coords[i][0]){
      this.x_max = coords[i][0];
    }
    if(this.x_min > coords[i][0]){
      this.x_min = coords[i][0];
    }
    if(this.y_max < coords[i][1]){
      this.y_max = coords[i][1];
    }
    if(this.y_min > coords[i][1]){
      this.y_min = coords[i][1];
    }
  }
};

Polygon.prototype.lines = function(){
  var size = this.coords.length;
  var out = [];
  for(var i = 0; i < size-1; i++){
    out.push(new Line([this.coords[i][0], this.coords[i][1]], [this.coords[i+1][0], this.coords[i+1][1]]));
  }
  out.push(new Line([this.coords[size-1][0],this.coords[size-1][1]],[this.coords[0][0], this.coords[0][1]]));
  return out;
};

Polygon.prototype.bbox = function(){
  return [[this.x_min, this.y_min], [this.x_max, this.y_max]];
};

Polygon.prototype.size = function(){
  return this.coords.length;
}
