describe("New Polygon", function() {
  it("Sets polygon points", function() {
    var p = new Polygon([[0,0],[1,0],[1,1],[0,1]]);
    expect(p.coords).toEqual([[0,0],[1,0],[1,1],[0,1]]);
  });
});

describe("polygon.edges", function(){
  it("return all edges", function(){
    var p = new Polygon([[0,0],[0,100],[100,100],[100,0]]);
    expect(p.lines()).toEqual([new Line([0,0],[0,100]), new Line([0,100],[100,100]), new Line([100,100],[100,0]), new Line([100,0],[0,0])]);
  });
});

describe("polygon.bbox", function(){
  it("return bounding box", function(){
    var p = new Polygon([[0,0],[0,100],[100,100],[100,0]]);
    expect(p.bbox()).toEqual([[0,0],[100,100]]);
  });
});
