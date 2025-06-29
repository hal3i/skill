var queryString = window.location.search;

if (queryString) {
  let elem = document.getElementById("info");
  elem.innerHTML = '<div>旧バージョンを表示しています。<a href="' + window.location.origin + '/skill/">最新版を表示する。</a></div>';
  try {
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
        if (ver[0] == "0" && ver[1] == "0") {
          window.location.href = window.location.origin + "/skill/" + ver[0] + "." + ver[1] + "/" + queryString;
        }
      }
    }
  }
  catch {
    elem.innerHTML += '<div>不正なURLです。正しくスキルを表示できません。</div>';
  }

}
