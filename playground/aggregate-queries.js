UserFavourites.aggregate([
  {
    $lookup: {
      from: "contents",
      // localField:{ $ifNull: [ "$content_id", 0 ] },
      localField: "content_id", // fieldname in userfavourites
      foreignField: "ID", // ref to contents
      as: "content_data"
    }
  },
  { $match: { user_id: user_id } } 
]).exec(function(error, content) {
  if (error || content.length < 1)
    res
      .status(403)
      .send(
        JSON.stringify({
          success: false,
          errorcode: 1009,
          message: config.errorcodes["1009"]
        })
      );
  else {
    if (content[0].content_data.length > 0) {
      content[0].content_data.reverse();
      var fav_content = {};
      fav_content.read = [];
      fav_content.listen = [];
      fav_content.watch = [];
      var counter = 0;
      content[0].content_data.forEach(function(cont) {
        counter++;
        var fav_data = mylistcontentprocess(cont);
        if (fav_data.status == true && fav_data.asset_type == "READ") {
          fav_content.read.push(fav_data);
        }
        if (fav_data.status == true && fav_data.asset_type == "LISTEN") {
          fav_content.listen.push(fav_data);
        }
        if (fav_data.status == true && fav_data.asset_type == "WATCH") {
          fav_content.watch.push(fav_data);
        }
        if (counter == content[0].content_data.length) {
          res
            .status(200)
            .send(JSON.stringify({ success: true, contents: fav_content }));
        }
      });
    } else
      res
        .status(403)
        .send(
          JSON.stringify({
            success: false,
            errorcode: 1009,
            message: config.errorcodes["1009"]
          })
        );
  }
});
