'use strict'
window.onload = () => {
  function Skill(id, item) {
    this.id = id;
    this.item = item;

    Skill.prototype.initLv = function() {
      // 外枠を作る
      let elem = document.getElementById(this.item.name);
      
      // 取得済みか未取得か
      let value = person["skill"][this.id] > 0 ? "skill-cell enable" : "skill-cell disable";
      elem.setAttribute("class", value);

      if (person["skill"][this.id] > 0) {
      　// レベルゲージと数値追加
        this.createLvInfo(elem);

        if (this.item.child != undefined) {
          for (let c of this.item.child) {
            let id = this.item.name + "-" + c;
            let line = document.getElementById(id);
            line.setAttribute("class", "line enable");
          }
        }
      }
    }

    Skill.prototype.addImageEvent = function() {
      
      let mouseoverEventObject = () => document.getElementById(this.item.name).setAttribute("class", "skill-cell enable");
      let mouseoutEventObject = () => document.getElementById(this.item.name).setAttribute("class", "skill-cell disable");
      
      let elem = document.getElementById(this.item.name);

      if (person["skill"][this.id] == 0) {
        elem.firstElementChild.addEventListener("mouseover", mouseoverEventObject);
        elem.firstElementChild.addEventListener("mouseout", mouseoutEventObject);
      }
      
      // .NET
      if (this.id == "11" || this.id == "20" || this.id == "49") {
        let val = person["skill"][11] + person["skill"][20] + person["skill"][49];
        if (val > 0) {
          let text = document.getElementById(".NET-Framework");
          text.setAttribute("class", "enable");
        }
      }
      // NestJS
      else if (this.id == "89" || this.id == "90") {
        let val = person["skill"][89] + person["skill"][90];
        if (val > 0) {
          let text = document.getElementById("NestJS-Framework");
          text.setAttribute("class", "enable");
        }
      }

      elem.firstElementChild.addEventListener("click", () => {
        let cell = document.getElementById(this.item.name);

        if (person["skill"][this.id] == 0) {
          person["skill"][this.id] = 1;
          cell.setAttribute("class", "skill-cell enable");
          this.createLvInfo(cell);

          if (this.item.child != undefined) {
            for (let c of this.item.child) {
              let id = this.item.name + "-" + c;
              let line = document.getElementById(id);
              line.setAttribute("class", "line enable");
            }
            // .NET
            if (this.id == "11" || this.id == "20" || this.id == "49") {
              let val = person["skill"][11] + person["skill"][20] + person["skill"][49];
              if (val > 0) {
                let text = document.getElementById(".NET-Framework");
                text.setAttribute("class", "enable");
              }
            }
            // NestJS
            else if (this.id == "89" || this.id == "90") {
              let val = person["skill"][89] + person["skill"][90];
              if (val > 0) {
                let text = document.getElementById("NestJS-Framework");
                text.setAttribute("class", "enable");
              }
            }
          }

          elem.firstElementChild.removeEventListener("mouseover", mouseoverEventObject);
          elem.firstElementChild.removeEventListener("mouseout", mouseoutEventObject);
        }
        else {
          person["skill"][this.id] = 0;
          cell.setAttribute("class", "skill-cell disable");
          cell.removeChild(cell.lastChild); // remove Lvinfo
          
          if (this.item.child != undefined) {
            for (let c of this.item.child) {
              let id = this.item.name + "-" + c;
              let line = document.getElementById(id);
              line.setAttribute("class", "line disable");
            }
            // .NET
            if (this.id == "11" || this.id == "20" || this.id == "49") {
              let val = person["skill"][11] + person["skill"][20] + person["skill"][49];
              if (val == 0) {
                let text = document.getElementById(".NET-Framework");
                text.setAttribute("class", "disable");
              }
            }
            // NestJS
            else if (this.id == "89" || this.id == "90") {
              let val = person["skill"][89] + person["skill"][90];
              if (val == 0) {
                let text = document.getElementById("NestJS-Framework");
                text.setAttribute("class", "disable");
              }
            }
          }
          elem.firstElementChild.addEventListener("mouseover", mouseoverEventObject);
          elem.firstElementChild.addEventListener("mouseout", mouseoutEventObject);
        }
        updateURL();
      });
    }

    Skill.prototype.createLvInfo = function(parent) {
      let divLvBorder = document.createElement("div");
      divLvBorder.setAttribute("class", "lv-border");
      divLvBorder.addEventListener("click", {id: this.id, name: this.name, handleEvent: function(event) {
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
        
        person["skill"][this.id] = lv;

        updateURL();
      }});

      let divLvFill = document.createElement("div");
      divLvFill.setAttribute("class", "lv-fill");
      divLvFill.style = "width: " + 10 * person["skill"][this.id] + "%;";

      let divSkillLvBar = document.createElement("div");
      divSkillLvBar.setAttribute("class", "skill-lvbar");
      divSkillLvBar.appendChild(divLvFill);
      divSkillLvBar.appendChild(divLvBorder);
      
      let divSkillLv = document.createElement("div");
      divSkillLv.setAttribute("class", "skill-lv");
      divSkillLv.innerText = "Lv." + person["skill"][this.id];
      
      let divSkillLvInfo = document.createElement("div");
      divSkillLvInfo.setAttribute("class", "skill-lvinfo");
      divSkillLvInfo.appendChild(divSkillLvBar);
      divSkillLvInfo.appendChild(divSkillLv);
      
      parent.appendChild(divSkillLvInfo);
    }
  }

  var person = {
    profile: { name: "ゲスト", lv: 1, job: "プログラマー", status: "良", hp: 16, max_hp: 16, sp: 4, max_sp: 4, exp: 0 },
    _profile_enable: true,
    get profile_enable() { return this._profile_enable },
    set profile_enable(value) {
      this._profile_enable = value;

      let e = document.getElementById("profile_contents");
      if (value == false) {
        e.setAttribute("class", "invisible");
      }
      else {
        e.removeAttribute("class");
      }
    },
    
    recovery: function() {
      try {
        let skill_query_index = queryString.search(/\?s\=|\&s\=/);
        let prof_query_index = queryString.search(/\?p\=|\&p\=/);
        let base64skill = "";
        let base64profile = "";
        let skill = undefined;
        let profile = undefined;
        if (prof_query_index >= 0) {
          if (prof_query_index > skill_query_index) {
            base64skill = queryString.substr(skill_query_index + 3, prof_query_index - skill_query_index - 3);
            base64profile = queryString.substr(prof_query_index + 3);
          }
          else {
            base64profile = queryString.substr(prof_query_index + 3, skill_query_index - prof_query_index - 3);
            base64skill = queryString.substr(skill_query_index + 3);
          }
          if (base64skill === "f") {
            skill = new Uint8Array(2 + SkillList.length);
            skill.fill(10);
            skill[0] = version.major;
            skill[1] = version.minar;
          }
          else {
            skill = base64uri.decode(base64skill);
          }
          profile = base64uri.decode(base64profile);
        }
        else {
          base64skill = queryString.substr(skill_query_index + 3);
          if (base64skill === "f") {
              skill = new Uint8Array(2 + SkillList.length);
              skill.fill(10);
              skill[0] = version.major;
              skill[1] = version.minar;
          }
          else {
              skill = base64uri.decode(base64skill);
          }
        }
    
        let ver = skill.slice(0, 2);
        if (ver[0] == version.major && ver[1] == version.minar) {
          // 最新データ
          this.skill.set(skill.slice(2), 0);
          if (profile != undefined) {
            let arr = new TextDecoder().decode(profile).split(",");
            this.profile.name = arr[0];
            this.profile.lv = arr[1];
            this.profile.job = arr[2];
            this.profile.status = arr[3];
            this.profile.hp = arr[4];
            this.profile.max_hp = arr[5];
            this.profile.sp = arr[6];
            this.profile.max_sp = arr[7];
            this.profile.exp = arr[8];
          }
          else {
            this.profile_enable = false;
          }
        }
      }
      catch (e) {
      }
    }
  };
  person.skill = new Uint8Array(SkillList.length + (3 - SkillList.length % 3));
  person.skill.fill(0);
  person.recovery();

  function updateHP() {
    let hp = person["profile"]['max_hp'] == 0 ? 0 : person["profile"]['hp'] / person["profile"]['max_hp'] * 100;
    let elem = document.getElementById("hp-fill");
    elem.style = "width: " + hp + "%;";
  }

  function updateSP() {
    let sp = person["profile"]['max_sp'] == 0 ? 0 : person["profile"]['sp'] / person["profile"]['max_sp'] * 100;
    let elem = document.getElementById("sp-fill");
    elem.style = "width: " + sp + "%;";
  }

  function updateURL() {
    // profile 
    let arr = new Array();
    for (let key in person.profile) {
      arr.push(person.profile[key]);
    }
    let profile = new TextEncoder().encode(arr.join());
    let base64profile = base64uri.encode(profile);

    // info
    let info = new Uint8Array(2);
    info[0] = version.major;
    info[1] = version.minar;

    // skill
    let skill = new Uint8Array(info.length + person.skill.length);
    skill.set(info, 0);
    skill.set(person.skill, info.length);
  
    let base64skill = base64uri.encode(skill);

    let param = document.getElementById("url");
    let url = window.location.origin + "/skill/?s=" + base64skill;
    if (person.profile_enable) {
      url += "&p=" + base64profile;
    }
    param.value = url;

    let elem = document.getElementById("url_warn");
    if (param.value.length > 2000) {
      elem.innerText = "URL長が2000字を超えています。";
    }
    elem = document.getElementById("move");
    elem.onclick = function() {
      window.location.href = url;
    };

    makeCode();
  }

  let qrcode = new QRCode("qrcode", {
    correctLevel : QRCode.CorrectLevel.L
  });

  function makeCode() {
    var elem = document.getElementById("url");
    qrcode.makeCode(elem.value);
  }
  
  //
  // メイン処理
  //

  for (let key in person["profile"]) {
    let elem = document.getElementById(key);
    elem.value = person["profile"][key];
  }

  // プロフィール
  for (let tid in person["profile"]) {
    let elem = document.getElementById(tid);
    elem.addEventListener("blur", { key: tid, handleEvent: function(event) {
      person["profile"][this.key] = event.currentTarget.value;
      if (this.key == "hp" || this.key == "max_hp") {
        updateHP();
      }
      else if (this.key == "sp" || this.key == "max_sp") {
        updateSP();
      }
      updateURL();
    }});
  }
  updateHP();
  updateSP();

  for (let i in SkillList) {
    let item = SkillList[i];
    let skill = new Skill(i, item);
    skill.initLv();
    skill.addImageEvent();
  }
  updateURL();

  let elem = document.getElementById("profile_invisible");
  elem.addEventListener("click", function(){
    person.profile_enable = !person.profile_enable;
    updateURL();
  });
  elem.checked = !person.profile_enable;

  function doAttributeRecursive(elem, callback) {
    callback(elem);
    if (!elem.hasChildNodes) {
      return;
    }
    for (let child of elem.children) {
      doAttributeRecursive(child, callback);
    }
  }
  doAttributeRecursive(document.getElementById("qrcode-contents"), (e) => e.setAttribute("class", "invisible"));  

  elem = document.getElementById("qrcode_visible");
  elem.addEventListener("click", function(){
    let qrcode_contents = document.getElementById("qrcode-contents");
    let callback = this.checked ? (e) => e.removeAttribute("class") : (e) => e.setAttribute("class", "invisible");
    doAttributeRecursive(qrcode_contents, callback);
  });
};

var base64uri = {
  encode: function(skill) {
    let deflate = new Zlib.Deflate(skill);
    let compressed = deflate.compress();
    let binary_str = String.fromCharCode(...compressed);
    let base64 = btoa(binary_str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_");
  },
  decode: function(string) {
    let binary_str = atob(string.replace(/-/g, "+").replace(/_/g, "/"));
    const uint8a = new Uint8Array(string.length);
    for (let i = 0; i < uint8a.length; i++) {
      uint8a[i] = binary_str.charCodeAt(i);
    }
    let inflate = new Zlib.Inflate(uint8a, { 'resize': true });
    let plain = inflate.decompress();

    return plain;
  }
}
