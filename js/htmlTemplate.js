//准备文件区域的html模板
function filesHtml(fileData){
	var fileHtml = `
           
            <div class="item" data-file-id="${fileData.id}">
                <lable class="checkbox"></lable>
                <div class="file-img">
                    <i></i>
                </div>
                <p class="file-title-box">
                    <span class="file-title">${fileData.title}</span>
                    <span class="file-edtor">
                        <input class="edtor" value="${fileData.title}" type="text"/>
                    </span>
                </p>
            </div>
        
	`
	return fileHtml;
}
//返回指定id下所有子数据的html结构
function createFilesHtml(data,id){
    var childs = dataControl.getChildById(data,id);
    var html = '';
    childs.forEach(function(item){
         html += `<div class="file-item">${filesHtml(item)}</div>`
    }) 
    return html;
}

function createFileElement(filedata){
    var newDiv = document.createElement('div');
    newDiv.className = 'file-item';
    newDiv.innerHTML = filesHtml(filedata)
    return newDiv
}


//准备树形菜单的html模板
function treeHtml(data,treePid){
	var childs = dataControl.getChildById(data,treePid);
	if(!childs)return; 
    var Html = '<ul>';
    childs.forEach(function(item){
		//获取到当前数据的层级 通过id获取	
		var level = dataControl.getLevelById(data,item.id)
		//判断当前这个数据有没有子数据 通过id判断
		//contro 没有子数据  ''有子数据
        var hasChild = dataControl.hasChilds(data,item.id)?'tree-contro':'';

        Html += `

		        <li>
		            <div class="tree-title  ${hasChild}" data-file-id=${item.id} style="padding-left:${level*12}px"">
		                <span>
		                    <strong class="ellipsis">${item.title}</strong>
		                    <i class="ico"></i>
		                </span>
		            </div>
                    ${treeHtml(data,item.id)}
		        </li>

		`
    })
    Html+='</ul>'
    return Html;
}

function positionTreeById(positionId){
	var ele = document.querySelector(".tree-title[data-file-id='"+positionId+"']");
	tools.addClass(ele,'tree-nav')
};

//通过id得到当前这个id所有的父数据，得到一个结构
function createPathNavHtml(datas,fileId){
     //找到指定id所有的父数据
     var parents = dataControl.getParents(datas,fileId).reverse();//[1,2]
     var len = parents.length;
     var last = len-1;
     var html = '';
     parents.forEach(function(item,index){
     	  if(index == parents.length-1)return;   	  
          html += `<a href="javascript:;" style="z-index:${len--}" data-file-id="${item.id}">${item.title}</a>`
     })
     html+= `<span class="current-path" style="z-index:${len--}" data-file-id="${parents[last].id}">${parents[last].title}</span>`                   
     return html;                            
}