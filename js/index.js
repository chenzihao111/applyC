(function(){
	//设置高度并且自适应屏幕变化
    getWeiyunContentH()
    function getWeiyunContentH(){
		var headerH = tools.$(".user")[0].offsetHeight;
	    var weiyunContent = tools.$('.weiyun-content')[0];
	    var clientH = document.documentElement.clientHeight;
    	weiyunContent.style.height = clientH - headerH + 'px';
    	window.onresize = getWeiyunContentH;
    }

    //取数据
    var datas = data.files;

    //file-list 容器
    var fileList = tools.$(".file-list")[0];
    
    //tree-menu 容器
    var treeMenu = tools.$('.tree-menu')[0]
    
    //path-nav 容器
    var pathNav = tools.$('.path-nav')[0]
    
    //初始化容器内容
    function init(fileId){   
	    //file-list 容器
	    fileList.innerHTML = createFilesHtml(datas,fileId);
	    //ttree-menu 容器
	    treeMenu.innerHTML = treeHtml(datas,-1)
	    //path-nav 容器
	    pathNav.innerHTML = createPathNavHtml(datas,fileId);
	    //var positionId = 0;  //定位到属性菜单的上
		positionTreeById(fileId)    	
    }
    init(0);
    

	//利用事件委托，点击树形菜单的区域，找到事件源就可以
	tools.addEvent(treeMenu,"click",function(ev){
		var target = ev.target;
		if( tools.parents(target,".tree-title") ){
			target = tools.parents(target,".tree-title");

			//找到div身上的id 
			//console.dir(target);

			var fileId = target.dataset.fileId;
			
			var xrDOM = new RenderNavFilesTree(fileId);
		}
	});

	//利用事件委托，点击path-nav的区域，找到事件源就可以
	tools.addEvent(pathNav,"click",function(ev){
		var target = ev.target;
		console.log(ev)
		if( target.tagName == 'A'){
			var fileId = target.dataset.fileId;
			
			var xrDOM = new RenderNavFilesTree(fileId);
		}
	});	

	//利用事件委托，点击file-list的区域，找到事件源就可以
	tools.addEvent(fileList,"click",function(ev){
		var target = ev.target;
		if( tools.parents(target,".item") ){
			target = tools.parents(target,".item");

			//找到div身上的id 
			//console.dir(target);

			var fileId = target.dataset.fileId;
			console.log(fileId)
			var xrDOM = new RenderNavFilesTree(fileId);
		}
	});		

    //通过指定的id渲染文件区域，文件导航区域，树形菜单
    function RenderNavFilesTree(fileId){

    	this.empty = tools.$(".g-empty")[0];  //没有文件提醒的结构

		//如果指定的id没有子数据，需要提醒
		this.hasChild = dataControl.hasChilds(datas,fileId);

		if( this.hasChild ){  //如果有子数据，就渲染出子数据的结构
			//找到当前这个id下所有的子数据，渲染在文件区域中
			this.empty.style.display = "none";
			fileList.innerHTML = createFilesHtml(datas,fileId);
		}else{
			this.empty.style.display = "block";
			fileList.innerHTML = createFilesHtml(datas,fileId);
		} 
	    //path-nav 容器
	    pathNav.innerHTML = createPathNavHtml(datas,fileId);

		//需要给点击的div添加上样式，其余的div没有样式
		this.treeNav = tools.$(".tree-nav",treeMenu)[0];	  
        tools.removeClass(this.treeNav,'tree-nav')
	    //定位到属性菜单的上
		positionTreeById(fileId)  	         
    }
      
    /*页面交互*/

	//找到文件区域下所有的文件
	var fileItem = tools.$(".file-item",fileList);
	var checkboxs = tools.$(".checkbox",fileList);

	tools.each(fileItem,function(item,index){
		var checkbox = tools.$(".checkbox",item)[0];
		tools.addEvent(item,"mouseenter",function(ev){
			var target = ev.target;

			tools.addClass(target,"file-checked");
		});	
		tools.addEvent(item,"mouseleave",function(ev){
			if( !tools.hasClass(checkbox,"checked") ){
				tools.removeClass(this,"file-checked");
			}
		});	
		//给checkbox添加点击处理

		tools.addEvent(checkbox,"click",function(ev){
			var isaddClass = tools.toggleClass(this,"checked");

			if( isaddClass ){
				//判断一下是否所有的checkbox是都都勾选了


				if( whoSelect().length == checkboxs.length ){
					tools.addClass(item,"file-checked");
					tools.addClass(checkedAll,"checked");
				}

			}else{
				//只要当前这个checkbox没有被勾选，那么肯定全选按钮就没有class为checked
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkedAll,"checked");
			}

			//阻止冒泡，目的：防止触发fileList上的点击
			ev.stopPropagation();
		})					
	})

	//获取到全选按钮
	var checkedAll = tools.$(".checked-all")[0];

	tools.addEvent(checkedAll,"click",function(){
		/*
			toggleClass的返回值是一个布尔值
				true 有添加class
				flase 没有添加的class
		*/
		var isAddClass = tools.toggleClass(this,"checked"); 

		if( isAddClass ) {
			tools.each(fileItem,function(item,index){
				tools.addClass(item,"file-checked");
				//找到每个文件下对应checkbox
				tools.addClass(checkboxs[index],"checked");
			})
		}else{
			tools.each(fileItem,function(item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkboxs[index],"checked");
			})
		}
	});

	//作用：找到所有checkbox勾选的文件
	function whoSelect(){
		var arr = [];
		//找一下checkbox如果有class为checked，那么就放在数组中
		tools.each(checkboxs,function (checkbox,index){
			if( tools.hasClass(checkbox,"checked") ){
				arr.push(fileItem[index]);
			}
		});

		return arr;	
	}	

	//新建文件的功能
	var createFile = tools.$(".create")[0];
	var isCreate = false;
	tools.addEvent(createFile,'mouseup',function(){
		if(isCreate)return;
		isCreate = true;
		empty = tools.$(".g-empty")[0];  //没有文件提醒的结构
		empty.style.display = 'none'
		var newFile = createFileElement({
			title:"",
			id : new Date().getTime()			
		})
		var currentPath = tools.$(".current-path")[0];
		var fileTitle = tools.$(".file-title",newFile)[0];
		var fileEdtor = tools.$(".file-edtor",newFile)[0];
		var item = tools.$(".item",newFile)[0];		
        var fullTipBox = tools.$(".full-tip-box")[0];	
		fileList.insertBefore(newFile,fileList.firstElementChild);

		
		fileTitle.style.display = 'none';
		fileEdtor.style.display = 'block';
		fileEdtor.children[0].focus()
		fileEdtor.children[0].select();
		tools.addEvent(fileEdtor.children[0],'blur',function(){
			if(fileEdtor.children[0].value == ''){
				fileList.removeChild(fileList.firstElementChild);
			}else{
				fileTitle.innerHTML = fileEdtor.children[0].value;
				fileTitle.style.display = 'block';
				fileEdtor.style.display = 'none';	
				datas.push({
					title:fileEdtor.children[0].value,
					id : item.dataset.fileId,
					pid : currentPath.dataset.fileId,
					type : 'file'
				})	
			    //tree-menu 容器
			    var xrDOM = new RenderNavFilesTree(currentPath.dataset.fileId); 
			    treeMenu.innerHTML = treeHtml(datas,-1) 
			    positionTreeById(currentPath.dataset.fileId)    

			    fullTipBox.style.top = 0;      
			    fullTipBox.children[0].style.background = '#75bc0f'  
			    fullTipBox.children[0].children[0].children[0].style.backgroundPosition = '0 -9px'  	

 	            setTimeout(function(){
                    fullTipBox.style.top = "-32px";	
			    },1000)  
			}
		})
	    setTimeout(function(){
            isCreate = false;
	    },1000)  	
	})
    
	//框选的功能

	/*
		1. 生成一个框选的div
		2. 碰撞检测
	*/
     var pageX=0;
     var pageY=0;
     var newDiv = null;
     tools.addEvent(document,'mousedown',function(ev){
        pageX = ev.clientX;
        pageY = ev.clientY;
        tools.addEvent(document,'mousemove',fnMove)
        tools.addEvent(document,'mouseup',fnUp)
        ev.preventDefault();
     })
     
     function fnMove(ev){
		if( Math.abs(ev.clientX - pageX) > 10 || Math.abs(ev.clientY - pageY) > 10 ){
	     	if(!newDiv){
	          newDiv = document.createElement('div');
	          newDiv.className = "selectTab";   
	          document.body.appendChild(newDiv);		
	     	}    

			newDiv.style.width = 0;
			newDiv.style.height = 0;
			newDiv.style.display = "block";
			newDiv.style.left = pageX + "px";
			newDiv.style.top = pageY + "px";

			var w = ev.clientX - pageX;
			var h = ev.clientY - pageY;

			newDiv.style.width = Math.abs(w) + "px";
			newDiv.style.height = Math.abs(h) + "px";
			newDiv.style.left = Math.min(ev.clientX,pageX) + "px";
			newDiv.style.top = Math.min(ev.clientY,pageY) + "px"; 	

			//做一个碰撞检测
			//拖拽的newDiv和那些文件碰上了，如果碰上的话就给碰上的文件添加样式，没碰上取消掉样式
            var fileItem = tools.$(".file-item",fileList);
            tools.each(fileItem,function(item,index){
            	if(tools.collisionRect(item,newDiv)){
      				tools.addClass(item,"file-checked");
				    //找到每个文件下对应checkbox
				    tools.addClass(checkboxs[index],"checked");                    
            	}else{
      				tools.removeClass(item,"file-checked");
				    //找到每个文件下对应checkbox
				    tools.removeClass(checkboxs[index],"checked");                		
            	}
				if( whoSelect().length == checkboxs.length ){

						tools.addClass(checkedAll,"checked");

				}else{
					//只要当前这个checkbox没有被勾选，那么肯定全选按钮就没有class为checked

					tools.removeClass(checkedAll,"checked");
				}            	
            })


        }
     }
     function fnUp(ev){
        tools.removeEvent(document,'mousemove',fnMove)
        tools.removeEvent(document,'mouseup',fnUp)   
        if(newDiv) newDiv.style.display = "none";
     }

}())