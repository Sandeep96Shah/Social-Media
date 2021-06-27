module.exports.index = function (req, res) {
    return res.json(200, {
      message: "Bingo!!! You Are In Version 2",
      posts: [],
    });
  };
  