window.onload = () => {
  function createSkillImage(parent, key, image) {
    var divSkillImage = document.createElement("div");
    divSkillImage.setAttribute("class", "skill-image");
    divSkillImage.addEventListener("click", {id: key, handleEvent: function(event) {
      if (obj["lang"][this.id] == undefined) {
        obj["lang"][this.id] = 1;
        var divSkillCell = document.getElementById(this.id);
        divSkillCell.setAttribute("class", "skill-cell enable");
        createSkillLvbar(divSkillCell, this.id, obj["lang"][this.id]);
        createSkillLv(divSkillCell, obj["lang"][this.id]);
      }
      else {
        delete obj["lang"][this.id];
        
        var divSkillCell = document.getElementById(this.id);
        divSkillCell.setAttribute("class", "skill-cell disable");
        divSkillCell.removeChild(divSkillCell.lastChild); // remove Lv
        divSkillCell.removeChild(divSkillCell.lastChild); // remove bar
      }
      updateURL();
    }});
    parent.appendChild(divSkillImage);

    if (image != "") {
      var imgObj = document.createElement("img");
      imgObj.src = "./images/" + image;
      if (key == "Rust" || key == "Julia" || key == "Lua" || key == "PureScript" || key == "Crystal" || key == "Markdown" || key == "CoffeeScript") {
        imgObj.style = "background-color: white; width: 24px; height :24px;";
      }
      divSkillImage.appendChild(imgObj);
    }
  }

  function createSkillName(parent, name) {
    var divSkillName = document.createElement("div");
    divSkillName.setAttribute("class", "skill-name");
    divSkillName.innerHTML = "<span style=\"vertical-align: bottom;\">" + key + "</span>";
    parent.appendChild(divSkillName);
  }

  function createSkillLvbar(parent, key, level) {
    var divSkillBarBorder = document.createElement("div");
    divSkillBarBorder.setAttribute("class", "skill-barborder");
    divSkillBarBorder.addEventListener("click", {id: key, handleEvent: function(event) {
      var x = event.offsetX;
      if (x <= 0) {
        x = 1;
      }
      var y = event.offsetY;
      var selem = event.srcElement;
      var divSkillBar = selem.className == "skill-bar" ? selem : selem.firstChild;
      var w = divSkillBar.parentElement.clientWidth;
      if (x == w) {
        return;
      }
      let maxlv = 10;
      var lv = Math.floor(x * maxlv / w + 1);
      if (lv > maxlv) {
        lv = maxlv;
      }

      divSkillBar.style = "width: " + 10 * lv + "%;";

      var divSkillLv = divSkillBar.parentElement.parentElement.lastChild;
      divSkillLv.innerText = "Lv." + lv;
      
      obj["lang"][this.id] = lv;

      updateURL();
    }});
    parent.appendChild(divSkillBarBorder);

    var divSkillBar = document.createElement("div");
    divSkillBar.setAttribute("class", "skill-bar");
    divSkillBar.style = "width: " + 10 * level + "%;";
    divSkillBarBorder.appendChild(divSkillBar);
  }

  function createSkillLv(parent, level) {
    var divLv = document.createElement("div");
    divLv.setAttribute("class", "skill-lv");
    divLv.innerText = "Lv." + level;
    parent.appendChild(divLv);
  }
  
  function createURL() {
    obj["ver"] = "0.0.2";
    var json_str = JSON.stringify(obj);
    var base64 = btoa(unescape(encodeURIComponent(json_str)));
    return window.location.origin  + "/skill/0.0/?" + base64;
}
  
  function updateHP() {
    var hp = obj["profile"]['max_hp'] == 0 ? 0 : obj["profile"]['hp'] / obj["profile"]['max_hp'] * 100;
    elem = document.getElementById("hpbar");
    elem.style = "width: " + hp + "%;";
  }

  function updateSP() {
    var sp = obj["profile"]['max_sp'] == 0 ? 0 : obj["profile"]['sp'] / obj["profile"]['max_sp'] * 100;
    elem = document.getElementById("spbar");
    elem.style = "width: " + sp + "%;";
  }

  function updateURL() {
    var param = document.getElementById("url");
    param.value = createURL();

    var elem = document.getElementById("url_warn");
    if (param.value.length > 2000) {
      elem.innerText = "URL長が2000字を超えています。";
    }
  }

  function loadCode() {
    try {
      var queryString = window.location.search;
      var obj = JSON.parse(decodeURIComponent(escape(atob(queryString.substr(1)))));
    }
    catch (e) {
      //window.alert(e);
    }
    return obj;
  }
  
  //
  // メイン処理
  //

  // URLからデータの取得
  var obj = loadCode();
  if (obj == undefined) {
    obj = {
      "profile": {
        "name": "ゲスト",
        "lv": 1,
        "job": "プログラマー",
        "status": "良",
        "hp": 16,
        "max_hp": 16,
        "sp": 4,
        "max_sp": 4,
        "exp": 0
      },
      "lang": {}
    };
  }

  let e = document.getElementById("info");
  e.innerHTML = '旧バージョンを表示しています。<a href="' + window.location.origin + '/skill/">最新版を表示する。</a>';

  for (key in obj["profile"]) {
    var elem = document.getElementById(key);
    elem.value = obj["profile"][key];
  }

  // プロフィール
  let textbox_id = ["name", "lv", "job", "status", "exp"];

  for (tid in obj["profile"]) {
    var elem = document.getElementById(tid);
    elem.addEventListener("blur", { id: tid, handleEvent: function(event) {
      obj["profile"][this.id] = event.currentTarget.value;
      if (this.id == "name" || this.id == "lv" || this.id == "job" || this.id == "status" || this.id == "exp") {
        updateURL();
      }
      else if (this.id == "hp" || this.id == "max_hp") {
        updateHP();
      }
      else if (this.id == "sp" || this.id == "max_sp") {
        updateSP();
      }
    }});
  }
  updateHP();
  updateSP();

  // 獲得言語
  let langlist = {
    "proglang": Programming,
    "markupmarkdown": MarkupMarkdown,
    "stylesheet": StyleSheet,
    "query": Query,
    "hardwaredescription": HardwareDescription
  };

  for (lang in langlist) {
    elem = document.getElementById(lang);

    for (key in langlist[lang]) {
      var divSkillCell = document.createElement("div");
      divSkillCell.id = key;
      
      if (obj["lang"][key] == undefined) {
        divSkillCell.setAttribute("class", "skill-cell disable");
      }
      else {
        divSkillCell.setAttribute("class", "skill-cell enable");
      }
      elem.appendChild(divSkillCell);

      createSkillImage(divSkillCell, key, langlist[lang][key].image);
      createSkillName(divSkillCell, key);

      if (obj["lang"][key] == undefined) {
        continue;
      }

    　// レベルゲージと数値追加
      createSkillLvbar(divSkillCell, key, obj["lang"][key]);
      createSkillLv(divSkillCell, obj["lang"][key]);
    }
  }

  updateURL();
};