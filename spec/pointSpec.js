describe("New Point", function() {
  it("Sets coordinates", function() {
    var p = new Point(1,2);
    expect(p.x).toEqual(1);
    expect(p.y).toEqual(2);
  });
});

