var dataControl = {
	getChildById : function(data,id){
        var datas = [];
        for(var i=0; i<data.length; i++){
        	if(data[i].pid == id){
        		datas.push(data[i])
        	}
        }
        return datas;
	},
	//获取当前id的所有的父级
	getParents : function (data,currentId){
		var arr = [];
		for( var i = 0; i < data.length; i++ ){
			if( data[i].id == currentId ){
				arr.push(data[i]);
				arr = arr.concat(dataControl.getParents(data,data[i].pid))   //拿子级的pid去配对父级的id 找到push到数组里去
				break;
			}
		}
		return arr;   //[子子子集，子子集，子集，父级]
	},
	//获取当前id在第几层
	getLevelById : function(data,id){
        return dataControl.getParents(data,id).length; 
	},
	hasChilds : function(data,id){
		for(i=0; i<data.length; i++){
			if(id == data[i].pid){
				return true;
				break;
			}			
		}
        return false; 
	}
}