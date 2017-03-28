var tools = (function(){
	var toolsObj = {
		$ : function(selector,context){
        /*
          queryselector '.class a' '#id li'
          标签 'a'
          id   '#div'
          class '.class'
         */
        context = context || document;
        if(selector.indexOf(" ") !== -1){
            return context.querySelectorAll(selector)
        }else if(selector.charAt(0) === "#"){
            return document.getElementById(selector.slice(1))
        }else if(selector.charAt(0) === "."){
            return context.getElementsByClassName(selector.slice(1));
        }else{
          return context.getElementsByTagName(selector); //标签
        }
		},
    addClass : function(obj,clsName){
       if(typeof clsName === 'string'){
           if(!tools.hasClass(obj,clsName)){
               obj.className += ' ' + clsName
           }
       }
    },
    hasClass:function(ele,classNames){
      
        var classNameArr = ele.className.split(" ");
        for( var i = 0; i < classNameArr.length; i++ ){
          if( classNameArr[i] === classNames ){
            return true;
          }
        }

        return false;
    },
    removeClass : function(obj,clsName){
        var classNameArr = obj.className.split(' ');
        for (var i = classNameArr.length - 1; i >= 0; i--) {
          if(classNameArr[i] == clsName){
            classNameArr.splice(i,1);
            i--;
          }
        }
        obj.className = classNameArr.join(" ");
    },
    toggleClass : function(obj,clsName){
        if( tools.hasClass(obj,clsName) ){
          tools.removeClass(obj,clsName);
          return false;
        }else{
          tools.addClass(obj,clsName);
          return true;
        }
    },
    addEvent : function(ele,eventName,eventFn){
        ele.addEventListener(eventName,eventFn,false);
    },
    removeEvent:function(ele,eventName,eventFn){
        ele.removeEventListener(eventName,eventFn,false);
    },
    parents:function(obj,selector){
        /*

         * selector
         * id
         * class
         * 标签
         * */

        if( selector.charAt(0) === "#" ){
          while(obj.id !== selector.slice(1)){
            obj = obj.parentNode;
          }
        }else if( selector.charAt(0) === "." ){
          while((obj && obj.nodeType !== 9) && !tools.hasClass(obj,selector.slice(1))){
            obj = obj.parentNode;
          }
        }else{
          while(obj && obj.nodeType !== 9 && obj.nodeName.toLowerCase() !== selector){
            obj = obj.parentNode;
          }
        }
        return obj && obj.nodeType === 9  ? null : obj;
    },
    each : function(obj,fn){
        for (var i = obj.length - 1; i >= 0; i--) {
          fn && fn(obj[i],i)
        }
    },
    getEleRect:function(obj){
      return obj.getBoundingClientRect();
    },
    collisionRect:function(obj1,obj2){
      var obj1Rect = tools.getEleRect(obj1);
      var obj2Rect = tools.getEleRect(obj2);

      var obj1W = obj1Rect.width;
      var obj1H = obj1Rect.height;
      var obj1L = obj1Rect.left;
      var obj1T = obj1Rect.top;

      var obj2W = obj2Rect.width;
      var obj2H = obj2Rect.height;
      var obj2L = obj2Rect.left;
      var obj2T = obj2Rect.top;
      //碰上返回true 否则返回false
      if( obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H ){
        return true
      }else{
        return false;
      }
    }
	}
  return toolsObj;
}())
