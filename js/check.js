'use strict'
var queryString = window.location.search;
if (queryString) {
  if (queryString.substr(1,6) == "eyJwcm") {
    // <= ver 0.1
    var obj = JSON.parse(decodeURIComponent(escape(atob(queryString.substr(1)))));
    if (obj["ver"] == undefined) {
      obj["ver"] = "0.0.2";
      var json_str = JSON.stringify(obj);
      var base64 = btoa(unescape(encodeURIComponent(json_str)));
      window.location.href = window.location.origin + "/skill/0.0/?" + base64;
    }
    else {
      let ver = obj["ver"].split(".");
      if (ver[0] != undefined && ver[1] != undefined) {
        let latest = latest_version.split(".");
        let is_latest = ver[0] == latest[0] && ver[1] == latest[1];

        if (is_latest == false) {
          window.location.href = window.location.origin + "/skill/" + ver[0] + "." + ver[1] + "/" + queryString;
        }
      }
    } 
  }
}
