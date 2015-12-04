Player = {
  init: function(){
    this.x     = 200;
    this.y     = 250;
    this.dst_x = this.x;
    this.dst_y = this.y;
    this.speed = 140;
    this.dx    = 0;
    this.dy    = 0;
    this.moved = false;
    this.pts   = [new Point(200,250)];
    this.distance=0;

    return this;
  },

  move: function(){
    Player.dst_x = Player.dst_x + Player.dx * Player.distance;
    Player.dst_y = Player.dst_y + Player.dy * Player.distance;

    var int_x = Math.ceil(Player.dst_x);
    var int_y = Math.ceil(Player.dst_y);

    var last = Player.pts.length -1;

    if(int_x != Player.x) {
      Player.x = int_x;
      Player.pts[last].x = Player.x;
      Video.need_redraw = true;
    }
    if(int_y != Player.y) {
      Player.y = int_y;
      Player.pts[last].y = Player.y;
      Video.need_redraw = true;
    }
  },
  
  stop: function(){
    Player.dx = 0;
    Player.dy = 0;
  },

  ping: function(){
    if(Player.dx ==  0 && Player.dy == -1){
    };
    if(Player.dx ==  0 && Player.dy ==  1){
    };
    if(Player.dx == -1 && Player.dy ==  0){
    };
    if(Player.dx ==  1 && Player.dy ==  0){
    };
  }
}

