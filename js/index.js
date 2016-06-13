/////准备
$(function(){
  ///页面中的数组
var contacts = [],
   $findlist = $('.findlist'),    
   $ul = $('.ul'),
   $contacts = $('.contacts');

 ///编辑页 dom对象
var $tips = $(".tips"),
    $card = $(".card"),
    $quxiao = $(".delete"),
    $submit = $(".submit"),
    $add = $(".add");
///删除
var $shanchu = $(".tips .remove");
var $name = $("input[name=name]");
var $phone = $("input[name=phone]");
 var $beizhu = $("input[name=beizhu]");


///获取数据库中的数据 放在页面数组中 更新本地数组
if(localStorage.contacts){
  contacts = JSON.parse(localStorage.contacts); 
  render(); 
}else{
  _.ajax("/php/huoqulianxiren.php",function(data){
      contacts = JSON.parse(data);
      localStorage.contacts = JSON.stringify(contacts);
      render();
  })
}



////渲染  给页面上添加信息
function render(){
  var dict = {};
  $ul.html('');
  $contacts.html('');

  ///获取组名 对数据进行分组
   contacts.forEach(function(v){
    var k = v.name[0].toUpperCase();   
    if(!dict[k]){
       dict[k] = [];
    }
      dict[k].push(v) 

   })

   ////添加右侧组别
    var zimu = Object.keys(dict).sort();
    zimu.forEach(function(v){
      $ul.append('<li><a href="#'+v+'">'+v+'</a></li>');
    ////添加组别 title
      $contacts.append('<dt class="title" id="'+v+'">'+v+'</dt>');
      
    ////添加联系人
      dict[v].forEach(function(v){
        $contacts.append('<dd class="xinxi"><ul><li>'+v.name+'</li><li>'+v.phone+'</li></ul><a data-id="'+v.id+'"></a></dd>');
      })
      
    })
   $findlist.height($ul.outerHeight());
}

/////同步联系人
var $refresh = $(".refresh");
  $refresh.bind("click",function(){
    _.ajax("/php/huoqulianxiren.PHP",function(data){
      var temp = JSON.parse(data);
      if(contacts.length !== temp.length){
            contacts = temp;
            localStorage.contacts = contacts;
            render();
      }
    })
  })


  ////编辑页显示隐藏
 function show(){
    $tips.css({display:"block"});
 }
 function hide(){
    $tips.css({display:"none"});
    $shanchu.css({display:"inline-block"});
    $name.val('');
    $phone.val(''); 
    $beizhu.val('');
 }
 


  $add.bind("touchstart",function(){
  show();
  $shanchu.css({display:'none'});
  $card.addClass("adding");
  });
  $tips.bind("touchstart",hide);
  $card.bind("touchstart",function(e){
        e.stopPropagation();
  })
  $quxiao.bind("touchstart",hide);


//////新增

$submit.bind("touchstart",function(e){
    var name = $name.val();
    var phone = $phone.val();
    var beizhu = $beizhu.val();
    $submit.html('保存中...') 
  if( $card.hasClass("adding")){
    
    if(name !== '' || phone !== ''){
    var url = '/php/addlianxiren.php?name='+name+'&phone='+phone+'&beizhu='+beizhu;
     _.ajax(url,function(data){
     $submit.html('完成'); 
     hide();
     var _d = {id:data,name:name,phone:phone,beizhu:beizhu};
     contacts.push(_d);  
     localStorage.setItem("contacts",JSON.stringify(contacts));
     render(); 
   })
    }else{
      $submit.html('完成')
    }
  }else if($card.hasClass("editing")){
    if(name !== '' || phone !== ''){
      var ID = $shanchu.attr("data-id");
    var url = '/php/updatelianxiren.php?id='+ID+'&name='+name+'&phone='+phone+'&beizhu='+beizhu;
     _.ajax(url,function(data){
     $submit.html('完成');
     hide();
      if(data === 'success'){
      contacts.filter(function(v){
         if(v.id === ID){
          v.name = name;
          v.phone = phone;
          v.beizhu = beizhu;
         } 
       })
      } 
     localStorage.setItem("contacts",JSON.stringify(contacts));
     render(); 
   })
    }else{
      $submit.html('完成');
    }
  }
  
   
    
    
});


///删除一条联系人

//显示详细信息
$contacts.bind("touchstart",function(e){
   show();
    $card.addClass("editing");
   var el = e.target;
   var id = el.getAttribute("data-id");
   contacts.forEach(function(v){
     if(v.id === id){
      $name.val(v.name) ;
      $phone.val(v.phone) ;
      $beizhu.val(v.beizhu) ;
      $shanchu.attr("data-id",id);
     }
   })
})


// 二级页面删除联系人信息
$shanchu.bind("touchstart",function(){
  $shanchu.html('删除中....') ;
  var ID = $shanchu.attr("data-id");
  var url = '/php/shanchulianxiren.php?id='+ID
  _.ajax(url,function(data){  
      if(data === 'success'){
        contacts = contacts.filter(function(v){
         return v.id !== ID;
       })
         hide();
        $shanchu.html('删除') ;
        localStorage.setItem("contacts",JSON.stringify(contacts));
         render(); 
        
      }
  })
  
  
})`
})()
