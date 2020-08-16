;$$loading = (function(){

  var __options = {
    className : "mynt-loading",
    type      : "loading_1.html",
    parent    : null
  };

  var MAIN = function(options){
    this.options = this.setOptions(options);
    // this.init();
    if(!this.options.parent){
      new LIB().event(window , "resize" , (function(){this.resize()}).bind(this));
    }
    this.setCSS();
    this.setInitView(this.options.type);
  };

  // MAIN.prototype.init = function(){
  //   var target  = this.options.target;
  //   var clsName = this.options.className;
  //   if(!target){return;}
  //   var targets = document.querySelectorAll(target);
  //   if(!targets || !targets.length){return;}
  //   for(var i=0; i<targets.length; i++){
  //     if(targets[i].classList && targets[i].classList.contains(clsName)){continue;}
  //     targets[i].classList.add(clsName);
  //   }
  // };

  MAIN.prototype.setOptions = function(options){
    options = options || {};
    var res = JSON.parse( JSON.stringify(__options) );
    for (var i in options) {res[i] = options[i];}
    return res;
  };

  // set-css
  MAIN.prototype.setCSS = function(){
    if(document.querySelector("link[data-loading='1']")){return}
    var myScript = new LIB().currentScriptTag;
    var href = myScript.replace(".js",".css");
    var link = document.createElement("link");
    link.setAttribute("data-loading","1");
    link.rel = "stylesheet";
    link.href = href;
    var head = document.getElementsByTagName("head");
    head[0].appendChild(link);
  };

  MAIN.prototype.view = function(message){
    if(document.querySelector("."+ this.options.className + "-base")){
      console.log("Error. Already exist '."+ this.options.className +"'");
      return;
    }

    var div = this.make(message);
    var parent = this.options.parent || document.body;
    if(!div){return;}
    switch(document.readyState){
      case "complete"    : {
        parent.appendChild(div);
        break;
      }
      default            : {
        new LIB().event(window , "load" , (function(div , parent){
          parent.appendChild(div);
        }).bind(this , div , parent));
        break;
      }
		}
    // 
  };
  MAIN.prototype.hide = function(){
    var target = document.querySelector("."+ this.options.className + "-base");
    if(!target){return;}
    target.parentNode.removeChild(target);
  };

  MAIN.prototype.make = function(message){
    if(typeof this.loading_template === "undefined" || !this.loading_template){
      console.log("Error. No view-data.");
      return;
    }
    var base = document.createElement("div");
    base.className = this.options.className + "-base";
    var pos = this.getSize();
    base.style.setProperty("width"  , pos.x + "px","");
    base.style.setProperty("height" , pos.y + "px","");
    if(!this.options.parent){
      base.setAttribute("data-type","body");
    }
    base.innerHTML = this.loading_template;

    // message
    if(message){
      var msg = document.createElement("div");
      msg.className = this.options.className +"-message";
      base.appendChild(msg);
    }
    return base;
  };

  // template
  MAIN.prototype.setInitView = function(file){
    var myScript = new LIB().currentScriptTag;
    var urlinfo = new LIB().urlinfo(myScript);
    var path    = urlinfo.dir + file;
    new AJAX({
      url : path,
      method : "get",
      onSuccess : (function(res){
        if(!res){return;}
        this.loading_template = res;
        this.view();
      }).bind(this)
    });
  };

  MAIN.prototype.resize = function(){
    var target = document.querySelector("."+ this.options.className + "-base");
    if(!target){return;}
    var pos = this.getSize();
    target.style.setProperty("width"  , pos.x + "px","");
    target.style.setProperty("height" , pos.y + "px","");
  };

  MAIN.prototype.getSize = function(){
    var pos = {x : null , y : null};
    if(this.options.parent){
      pos.x = this.options.parent.offsetWidth;
      pos.y = this.options.parent.offsetHeight;
    }
    else{
      pos.x = window.innerWidth;
      pos.y = window.innerHeight;
    }
    return pos;
  };



  var LIB = function(){};

	LIB.prototype.event = function(target, mode, func){
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};

	LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2] ? sp[2] : ""
    , protocol : sp[0] ? sp[0].replace(":","") : ""
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };

  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();


  var AJAX = function(options){
    if(!options){return}
		var httpoj = this.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = this.setOption(options);

		// queryデータ
		var data = this.setQuery(option);
		if(!data.length){
			option.method = "get";
		}

		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		if(option.type){
			httpoj.setRequestHeader('Content-Type', option.type);
		}
		
		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
			if (this.readyState==4 && httpoj.status == 200){
				//コールバック
				option.onSuccess(this.responseText);
			}
		};

		// FormData 送信用
		if(typeof option.form === "object" && Object.keys(option.form).length){
			httpoj.send(option.form);
		}
		// query整形後 送信
		else{
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		}
		
  };
	AJAX.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		form:{},
		async:"true",		// [trye:非同期 false:同期]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // ["text/javascript" , "text/plane"]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	AJAX.prototype.option = {};
	AJAX.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	AJAX.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	AJAX.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.datas !== "undefined"){

			// data = option.data;
			for(var key of option.datas.keys()){
				data.push(key + "=" + option.datas.get(key));
			}
		}
		if(typeof option.query !== "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys !== "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};


  


  return MAIN;
})();