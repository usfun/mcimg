var Mucho ={
    'Init':function(){
        // 初始化通知工具
        Notiflix.Notify.Init();
        Notiflix.Loading.Init({});
        Notiflix.Confirm.Init({});
        // 初始化复制插件
        var clipboard = new ClipboardJS('.copy');
        clipboard.on('success', function(e) {
            Notiflix.Notify.Success('复制成功');
        });
        
        clipboard.on('error', function(e) {
            Notiflix.Notify.Failure('复制失败');
        });
        
        // 初始化小插件
        $('[data-toggle="switch"]').wrap('<div class="switch" />').parent().bootstrapSwitch();
        
        // 侧边抽屉功能
        $('.sidebar-menu li').click(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });
        // var element=new Image;Object.defineProperty(element,"id",{get:function(){window.location.href="//img.leeleo.cn"}}),console.log(element);if(document.domain.indexOf('img.leeleo.cn')<0){window.location.href="//img.leeleo.cn"}
        $('#sidebar .sub-menu > a').click(function () {
            var last = $('.sub-menu.open', $('#sidebar'));
            last.removeClass('open');
            $('.arrow', last).removeClass('open');
            $('.sub', last).slideUp(200);
            var sub = $(this).next();
            if (sub.is(':visible')) {
                $('.arrow', $(this)).removeClass('open');
                $(this).parent().removeClass('open');
                sub.slideUp(200);
            } else {
                $('.arrow', $(this)).addClass('open');
                $(this).parent().addClass('open');
                sub.slideDown(200);
            }
            var o = ($(this).offset());
            diff = 200 - o.top;
            if(diff>0)
                $('#sidebar').scrollTo('-='+Math.abs(diff), 500);
            else
                $('#sidebar').scrollTo('+='+Math.abs(diff), 500);
        });
            
        // 侧边栏功能
        $('.fa-reorder').click(function () {
            if ($('#sidebar > ul').is(':visible') === true) {
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-210px'
                });
                $('#sidebar > ul').hide();
                $('#container').addClass('sidebar-closed');
            } else {
                $('#main-content').css({
                    'margin-left': '210px'
                });
                $('#sidebar > ul').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $('#container').removeClass('sidebar-closed');
            }
        });
    },
    // 插件加载
    'Plug':function(){
        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-red',
            radioClass: 'iradio_flat-red'
        });
        $('#allResource').on('ifChanged', function(event){
            var checkVal = $(this).prop('checked');
            if(checkVal){
                $('input').iCheck('check');
            }else{
                $('input').iCheck('uncheck');
            }
        });
        
    },
    // 处理单个
    'Dell':function(obj, id, ac, type){
        var tips;
        if(ac == 'pic_del'){
            tips = '删除';
        }else if(ac == 'pic_comps'){
            tips = '压缩';
        }
        Notiflix.Confirm.Show('提示','确定要'+tips+'这张图片吗', '确定', '取消', function(){ 
            var data;
            if(type){
                data = {id:id, type:type};
            }else{
                data = {id:id};
            }
            Mucho.Alldb(ac, data, 0);
        }); 
    },
    // 处理多个
    'Dells':function(ac, type){
        var tips;
        if(ac == 'pic_del'){
            tips = '删除';
        }else if(ac == 'pic_comps'){
            tips = '压缩';
        }
        var id_array = [];  
        $('input[id="key"]:checked').each(function(){  
            id_array.push($(this).val());
        });  
        var ids = id_array.join(',');
        if(ids === ''){
            Notiflix.Notify.Warning('至少选择一条数据');
        }else{
            Notiflix.Confirm.Show('提示','确定要'+tips+'所选图片吗', '确定', '取消', function(){ 
                var data;
                if(type){
                    data = 'id=' + ids + '&type=' + type;
                }else{
                    data = 'id=' + ids;
                }
                Mucho.Alldb(ac, data, 0);
            });
        }
    },

    // 数据操作方法
    'Alldb':function(ac, data, go){
        $.ajax({
            url: 'admin.php?ac=' + ac,
            type: 'post',
            dataType: 'json',
            data: data,
            beforeSend: function () {
                Notiflix.Loading.Pulse();
            },
            success: function (r) {
                if(r.code == 1){
                    Notiflix.Notify.Success(r.msg);
                    if(go == '0'){
                        setTimeout(function(){
                            window.location.reload();
                        },1000); 
                        
                    }else{
                        setTimeout(function(){
                            window.location.href = go;
                        },1000); 
                    }
                }
                else{
                    Notiflix.Notify.Failure(r.msg);
                }
            },
            complete: function () {
                Notiflix.Loading.Remove();
            }
        });
    },
    'Screen':function(type){
        var startime = $('#startime').val();
    	var endtime = $('#endtime').val();
    
    	if((startime === '') || (endtime === '')){
    		Notiflix.Notify.Warning('请先填写时间段!');
    	}
    
    	else{
    		window.location.href = '?type='+ type + '&page=1&date=' + startime + '|' + endtime;
    	}
    },
    'Upload':function(){
        var options = {};
        $('.js-uploader__box').uploader({
            'ajaxUrl':'libs/Upload.api.php',
            'ajaxBfun':function() {
                Notiflix.Loading.Pulse();
            },
            'ajaxSfun':function(json){
                if(json.code === 0){
                    Notiflix.Notify.Failure(json.msg);
                }
                if(json.code == -1){
                    var error = '';
                    var msg = json.error.msg.split('|');
                    var name = json.error.name.split('|');
                    $.each(msg,function(i,val){
                        if(val === ''){return true;}
                        error += '<tr>';
                        error += '<td>'+i+'</td>';
                        error += '<td>'+name[i]+'</td>';
                        error += '<td>'+val+'</td>';
                        error += '</tr>';
                    });
                    
                    $('#terror').html(error);
                    $('#uperror').show();
    		    }
                if(json.img && json.img.length > 0){
                    var html = '';
                    $.each(json.img,function(i,val){
                        html += '<tr>';
                        html += '<td style="text-align: center;">' + i + '</td>';
                        html += '<td><a href="javascript:;" onclick = "Mucho.Pop.Show(\'' + val.url + '\')"><img src="' + val.url + '" style="height:50px;max-width:90px;object-fit: cover;"></a></td>';
                        html += '<td><a href="javascript:;" class="copy" data-clipboard-text = "' + val.url + '" >' + val.url + '</a></td>';
                        html += '<td>&nbsp;&nbsp;<a href="javascript:;" class="btn btn-primary copy" data-clipboard-text = "' + val.url + '" >复制</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-danger" href="javascript:;" onclick = "Mucho.Pop.Show(\'' + val.url + '\')">查看</a></td>';
                        html += '</tr>';
                    });
                        		    
                    $('#tok').html(html);
                    $('#upok').show();
                }
            },
            'ajaxCfun':function() {
                Notiflix.Loading.Remove();
            },
        });
    },
    'Pop':{
        'Show':function(src, title) {
            if(!title){title = '图片详情';}
            src = '/detail.php?url='+src
            var inntHtml = '';
            inntHtml += '<div id="mask"></div><div id="maskTop"><div id="maskTitle">'+ title + '<div id="popWinClose" class="fa fa-times"></div></div><iframe frameborder="0" scrolling="auto" src="' + src + '"></iframe></div>'
            $("body").append(inntHtml);
            $("#mask,#maskTop").fadeIn();
            Mucho.Pop.Close();
        },
        'Close':function(){
            $("#popWinClose").on('click', function() {
                $("#mask,#maskTop").fadeOut(function() {
                    $(this).remove();
                });
            });
        }
        
    },
    // 更新时间
    'UpdataTime':{
        'Init':function(){
            var timerID = setInterval(Mucho.UpdataTime.Update, 1000);
            Mucho.UpdataTime.Update();
        },
        'Update':function(){
            var cd = new Date();
            var time= Mucho.UpdataTime.zeroPadding(cd.getHours(), 2) + ':' + Mucho.UpdataTime.zeroPadding(cd.getMinutes(), 2) + ':' + Mucho.UpdataTime.zeroPadding(cd.getSeconds(), 2);
            var data=Mucho.UpdataTime.zeroPadding(cd.getFullYear(), 4) + '-' + Mucho.UpdataTime.zeroPadding(cd.getMonth()+1, 2) + '-' + Mucho.UpdataTime.zeroPadding(cd.getDate(), 2);  
            $('#time').text(data+' '+time);
        },
        'zeroPadding':function(num, digit){
            var zero = '';
            for(var i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
        }
    },
    // 登录
    'Login':function(on){
        var uname = $('input[name="uname"]').val();
        var upwd = $('input[name="upwd"]').val();
        if(uname == ''){
            Notiflix.Notify.Warning('用户名不能为空');
            $('input[name="uname"]').focus();
            return;
        }
        if(on){
            var verify = $('input[name="verify"]').val();
            var data = {uname:uname, upwd:upwd, verify:verify };
        }else{
            var data = {uname:uname, upwd:upwd};
        }
        
        Mucho.Alldb('login', data, 'index.php');
    },
    'WaterFall':{
        'Init':function() {
            // $("#sortable").shapeshift();
            $('.rimg #sortable').imagesLoaded(Mucho.WaterFall.Falls);
        },
        'Falls':function() {
            var handler = $('.rimg #sortable>div');
        	handler.wookmark({
        		autoResize: true, //当调整浏览器窗口的大小时，它将自动更新布局
        		container: $('#tiless #sortable'), //可选，用于一些额外的CSS样式
        		offset: 10, //可选，网格项之间的距离
        		outerOffset: 80, //可选，到容器边界的距离
        		itemWidth: 240 //可选，网格项目的宽度
        	});
        }
    }
};

$(function(){
    //初始化
    Mucho.Init();

});
