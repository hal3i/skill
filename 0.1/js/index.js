window.onload = () => {
  function createSkillImage(parent, key, image) {
    var divSkillImage = document.createElement("div");
    divSkillImage.setAttribute("class", "skill-image");
    divSkillImage.addEventListener("click", {id: key, handleEvent: function(event) {
      if (obj["lang"][this.id] == undefined) {
        obj["lang"][this.id] = 1;
        var divSkillCell = document.getElementById(this.id);
        divSkillCell.setAttribute("class", "skill-cell enable");
        createSkillLvInfo(divSkillCell, this.id, obj["lang"][this.id]);
      }
      else {
        delete obj["lang"][this.id];
        
        var divSkillCell = document.getElementById(this.id);
        divSkillCell.setAttribute("class", "skill-cell disable");
        divSkillCell.removeChild(divSkillCell.lastChild); // remove Lvinfo
      }
      updateURL();
    }});
    parent.appendChild(divSkillImage);

    if (image != "") {
      var imgObj = document.createElement("img");
      imgObj.src = "./images/" + image;
      if (key == "Rust" || key == "Julia" || key == "Lua" || key == "PureScript"|| key == "Crystal" || key == "Markdown" || key == "CoffeeScript" || key == "Nim") {
        imgObj.style = "background-color: white; width: 24px; height :24px;";
      }
      divSkillImage.appendChild(imgObj);
    }
  }

  function createSkillName(parent, name) {
    var divSkillNameCell = document.createElement("div");
    divSkillNameCell.setAttribute("class", "skill-namecell");
    
    var divSkillName = document.createElement("div");
    divSkillName.setAttribute("class", "skill-name");
    divSkillName.innerText = name;

    divSkillNameCell.appendChild(divSkillName)

    parent.appendChild(divSkillNameCell);
  }

  function createSkillLvInfo(parent, key, level) {
    let divSkillLvInfo = document.createElement("div");
    divSkillLvInfo.setAttribute("class", "skill-lvinfo");
    
    let divSkillLvBar = document.createElement("div");
    divSkillLvBar.setAttribute("class", "skill-lvbar");

    let divLvFill = document.createElement("div");
    divLvFill.setAttribute("class", "lv-fill");
    divLvFill.style = "width: " + 10 * level + "%;";

    let divLvBorder = document.createElement("div");
    divLvBorder.setAttribute("class", "lv-border");
    divLvBorder.addEventListener("click", {id: key, handleEvent: function(event) {
      let x = event.offsetX;
      let selem = event.srcElement;
      let w = selem.clientWidth;
      let maxlv = 10;
      let lv = Math.floor(x * maxlv / w + 1);
      if (lv > maxlv) {
        lv = maxlv;
      }

      let divLvFill = selem.parentElement.firstChild;
      divLvFill.style = "width: " + 10 * lv + "%;";

      let divSkillLv = selem.parentElement.parentElement.lastChild;
      divSkillLv.innerText = "Lv." + lv;
      
      obj["lang"][this.id] = lv;

      updateURL();
    }});

    divSkillLvBar.appendChild(divLvFill);
    divSkillLvBar.appendChild(divLvBorder);
    
    let divSkillLv = document.createElement("div");
    divSkillLv.setAttribute("class", "skill-lv");
    divSkillLv.innerText = "Lv." + level;
    
    divSkillLvInfo.appendChild(divSkillLvBar);
    divSkillLvInfo.appendChild(divSkillLv);
    
    parent.appendChild(divSkillLvInfo);
  }

  function updateHP() {
    var hp = obj["profile"]['max_hp'] == 0 ? 0 : obj["profile"]['hp'] / obj["profile"]['max_hp'] * 100;
    elem = document.getElementById("hp-fill");
    elem.style = "width: " + hp + "%;";
  }

  function updateSP() {
    var sp = obj["profile"]['max_sp'] == 0 ? 0 : obj["profile"]['sp'] / obj["profile"]['max_sp'] * 100;
    elem = document.getElementById("sp-fill");
    elem.style = "width: " + sp + "%;";
  }

  function updateURL() {
    var json_str = JSON.stringify(obj);
    var base64 = btoa(unescape(encodeURIComponent(json_str)));
    var param = document.getElementById("url");
    param.value = window.location.href + "?" + base64;

    var elem = document.getElementById("url_warn");
    if (base64.length > 2000) {
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
      "lang": {},
      "ver": "0.1"
    };
  }

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
      createSkillLvInfo(divSkillCell, key, obj["lang"][key]);
    }
  }

  updateURL();
};
