var Mucho={Init:function(){Notiflix.Notify.Init();Notiflix.Loading.Init({});Notiflix.Confirm.Init({});var b=new ClipboardJS(".copy");b.on("success",function(a){Notiflix.Notify.Success("\u590d\u5236\u6210\u529f")});b.on("error",function(a){Notiflix.Notify.Failure("\u590d\u5236\u5931\u8d25")});$('[data-toggle\x3d"switch"]').wrap('\x3cdiv class\x3d"switch" /\x3e').parent().bootstrapSwitch();$(".sidebar-menu li").click(function(){$(this).addClass("active").siblings().removeClass("active")});$("#sidebar .sub-menu \x3e a").click(function(){var a=$(".sub-menu.open",$("#sidebar"));a.removeClass("open");$(".arrow",a).removeClass("open");$(".sub",a).slideUp(200);a=$(this).next();a.is(":visible")?($(".arrow",$(this)).removeClass("open"),$(this).parent().removeClass("open"),a.slideUp(200)):($(".arrow",$(this)).addClass("open"),$(this).parent().addClass("open"),a.slideDown(200));diff=200-$(this).offset().top;0<diff?$("#sidebar").scrollTo("-\x3d"+Math.abs(diff),500):$("#sidebar").scrollTo("+\x3d"+Math.abs(diff),500)});$(".fa-reorder").click(function(){!0===$("#sidebar \x3e ul").is(":visible")?($("#main-content").css({"margin-left":"0px"}),$("#sidebar").css({"margin-left":"-210px"}),$("#sidebar \x3e ul").hide(),$("#container").addClass("sidebar-closed")):($("#main-content").css({"margin-left":"210px"}),$("#sidebar \x3e ul").show(),$("#sidebar").css({"margin-left":"0"}),$("#container").removeClass("sidebar-closed"))})},Plug:function(){$("input").iCheck({checkboxClass:"icheckbox_flat-red",radioClass:"iradio_flat-red"});$("#allResource").on("ifChanged",function(b){$(this).prop("checked")?$("input").iCheck("check"):$("input").iCheck("uncheck")})},Dell:function(b,a,c,e){var d;"pic_del"==c?d="\u5220\u9664":"pic_comps"==c&&(d="\u538b\u7f29");Notiflix.Confirm.Show("\u63d0\u793a","\u786e\u5b9a\u8981"+d+"\u8fd9\u5f20\u56fe\u7247\u5417","\u786e\u5b9a","\u53d6\u6d88",function(){Mucho.Alldb(c,e?{id:a,type:e}:{id:a},0)})},Dells:function(b,a){var c;"pic_del"==b?c="\u5220\u9664":"pic_comps"==b&&(c="\u538b\u7f29");var e=[];$('input[id\x3d"key"]:checked').each(function(){e.push($(this).val())});var d=e.join(",");""===d?Notiflix.Notify.Warning("\u81f3\u5c11\u9009\u62e9\u4e00\u6761\u6570\u636e"):Notiflix.Confirm.Show("\u63d0\u793a","\u786e\u5b9a\u8981"+c+"\u6240\u9009\u56fe\u7247\u5417","\u786e\u5b9a","\u53d6\u6d88",function(){Mucho.Alldb(b,a?"id\x3d"+d+"\x26type\x3d"+a:"id\x3d"+d,0)})},Alldb:function(b,a,c){$.ajax({url:"admin.php?ac\x3d"+b,type:"post",dataType:"json",data:a,beforeSend:function(){Notiflix.Loading.Pulse()},success:function(a){1==a.code?(Notiflix.Notify.Success(a.msg),"0"==c?setTimeout(function(){window.location.reload()},1E3):setTimeout(function(){window.location.href=c},1E3)):Notiflix.Notify.Failure(a.msg)},complete:function(){Notiflix.Loading.Remove()}})},Screen:function(b){var a=$("#startime").val(),c=$("#endtime").val();""===a||""===c?Notiflix.Notify.Warning("\u8bf7\u5148\u586b\u5199\u65f6\u95f4\u6bb5!"):window.location.href="?type\x3d"+b+"\x26page\x3d1\x26date\x3d"+a+"|"+c},Upload:function(){$(".js-uploader__box").uploader({ajaxUrl:"libs/Upload.api.php",ajaxBfun:function(){Notiflix.Loading.Pulse()},ajaxSfun:function(b){0===b.code&&Notiflix.Notify.Failure(b.msg);if(-1==b.code){var a="",c=b.error.msg.split("|"),e=b.error.name.split("|");$.each(c,function(b,c){if(""===c)return!0;a+="\x3ctr\x3e";a+="\x3ctd\x3e"+b+"\x3c/td\x3e";a+="\x3ctd\x3e"+e[b]+"\x3c/td\x3e";a+="\x3ctd\x3e"+c+"\x3c/td\x3e";a+="\x3c/tr\x3e"});$("#terror").html(a);$("#uperror").show()}if(b.img&&0<b.img.length){var d="";$.each(b.img,function(a,b){d+="\x3ctr\x3e";d+='\x3ctd style\x3d"text-align: center;"\x3e'+a+"\x3c/td\x3e";d+='\x3ctd\x3e\x3ca href\x3d"javascript:;" onclick \x3d "Mucho.Pop.Show(\''+b.url+'\')"\x3e\x3cimg src\x3d"'+b.url+'" style\x3d"height:50px;max-width:90px;object-fit: cover;"\x3e\x3c/a\x3e\x3c/td\x3e';d+='\x3ctd\x3e\x3ca href\x3d"javascript:;" class\x3d"copy" data-clipboard-text \x3d "'+b.url+'" \x3e'+b.url+"\x3c/a\x3e\x3c/td\x3e";d+='\x3ctd\x3e\x26nbsp;\x26nbsp;\x3ca href\x3d"javascript:;" class\x3d"btn btn-primary copy" data-clipboard-text \x3d "'+b.url+'" \x3e\u590d\u5236\x3c/a\x3e\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;\x3ca class\x3d"btn btn-danger" href\x3d"javascript:;" onclick \x3d "Mucho.Pop.Show(\''+b.url+"')\"\x3e\u67e5\u770b\x3c/a\x3e\x3c/td\x3e";d+="\x3c/tr\x3e"});$("#tok").html(d);$("#upok").show()}},ajaxCfun:function(){Notiflix.Loading.Remove()}})},Pop:{Show:function(b,a){a||(a="\u56fe\u7247\u8be6\u60c5");var c;c=""+('\x3cdiv id\x3d"mask"\x3e\x3c/div\x3e\x3cdiv id\x3d"maskTop"\x3e\x3cdiv id\x3d"maskTitle"\x3e'+a+'\x3cdiv id\x3d"popWinClose" class\x3d"fa fa-times"\x3e\x3c/div\x3e\x3c/div\x3e\x3ciframe frameborder\x3d"0" scrolling\x3d"auto" src\x3d"'+("/detail.php?url\x3d"+b)+'"\x3e\x3c/iframe\x3e\x3c/div\x3e');$("body").append(c);$("#mask,#maskTop").fadeIn();Mucho.Pop.Close()},Close:function(){$("#popWinClose").on("click",function(){$("#mask,#maskTop").fadeOut(function(){$(this).remove()})})}},UpdataTime:{Init:function(){setInterval(Mucho.UpdataTime.Update,1E3);Mucho.UpdataTime.Update()},Update:function(){var b=new Date,a=Mucho.UpdataTime.zeroPadding(b.getHours(),2)+":"+Mucho.UpdataTime.zeroPadding(b.getMinutes(),2)+":"+Mucho.UpdataTime.zeroPadding(b.getSeconds(),2),b=Mucho.UpdataTime.zeroPadding(b.getFullYear(),4)+"-"+Mucho.UpdataTime.zeroPadding(b.getMonth()+1,2)+"-"+Mucho.UpdataTime.zeroPadding(b.getDate(),2);$("#time").text(b+" "+a)},zeroPadding:function(b,a){for(var c="",e=0;e<a;e++)c+="0";return(c+b).slice(-a)}},Login:function(b){var a=$('input[name\x3d"uname"]').val(),c=$('input[name\x3d"upwd"]').val();""==a?(Notiflix.Notify.Warning("\u7528\u6237\u540d\u4e0d\u80fd\u4e3a\u7a7a"),$('input[name\x3d"uname"]').focus()):(b?(b=$('input[name\x3d"verify"]').val(),a={uname:a,upwd:c,verify:b}):a={uname:a,upwd:c},Mucho.Alldb("login",a,"index.php"))},WaterFall:{Init:function(){$(".rimg #sortable").imagesLoaded(Mucho.WaterFall.Falls)},Falls:function(){$(".rimg #sortable\x3ediv").wookmark({autoResize:!0,container:$("#tiless #sortable"),offset:10,outerOffset:80,itemWidth:240})}}};$(function(){Mucho.Init()});