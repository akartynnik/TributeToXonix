var Board = {}

Board.init = function(){
  nodes = [
    {x    : 0,
     y    : 0,
     up   : false,
     down : true,
     left : false,
     right: true
    },
    {x    : 0,
     y    : 300,
     up   : true,
     down : false,
     left : false,
     right: true
    },
    {x    : 300,
     y    : 300,
     up   : true,
     down : false,
     left : true,
     right: false
    },
    {x    : 300,
     y    : 0,
     up   : false,
     down : true,
     left : true,
     right: false
    }
  ];
};
