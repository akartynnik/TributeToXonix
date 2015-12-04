var Video = {}

Video.init = function(documentId, width, height){
  this.canvas        = document.getElementById(documentId);
  this.canvas.width  = 400;
  this.canvas.height = 300;
  this.ctx           = this.canvas.getContext("2d");
  this.need_redraw   = true;
}

Video.clear = function(){
  this.ctx.fillStyle = "#CCC";
  this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
}

Video.drawPlayer = function(x, y){
  this.ctx.beginPath();
  this.ctx.arc(Player.x, Player.y, 5, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = 'red';
  this.ctx.fill();
  this.ctx.lineWidth = 2;
  this.ctx.strokeStyle = 'black';
  this.ctx.stroke();
}

Video.drawPath = function(pts){
  this.ctx.beginPath();
  this.ctx.moveTo(pts[0].x, pts[0].y);
  for(var i = 0 ; i < pts.length; i++) {
    this.ctx.lineTo(pts[i].x, pts[i].y);
  }
  this.ctx.lineWidth = 2;
  this.ctx.strokeStyle = 'black';
  this.ctx.stroke();
 
}

Video.drawPolygons = function(polygons){
  this.ctx.beginPath();
  var count = polygons.length;
  for(var i = 0 ; i < count ; i++){
    var polygon = polygons[i];
    var edges = polygon.size();
    var x1 = polygon.coords[0][0];
    var y1 = polygon.coords[0][1];
    this.ctx.moveTo(x1,y1);
    var xp = x1;
    var yp = y1;
    for(var j = 1 ; j < edges ; j++){
      var x2 = polygon.coords[j][0];
      var y2 = polygon.coords[j][1];
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
    }
    this.ctx.stroke();
  }
}
