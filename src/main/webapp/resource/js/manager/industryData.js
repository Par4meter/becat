layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        id : "id",
        elem: '#userList',
        url : '/console/indusPage.shtml',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        id : "indusListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'title', title: '标题', minWidth:100, align:"center"},
            {field: 'createtime', title: '创建时间', minWidth:100, align:'center'},
            {field: 'major', title: '优化词', align:'center'},
            {field: 'remark', title: '备注',  minWidth:200, align:'center'},
            {field: 'name', title: '所属分类', align:'center'},
            {field: 'source', title: '来源', align:'center',minWidth:150},
            {field: 'hot', title: '热点文章', align:'center',minWidth:100,templet:function(d){
                return d.hot == "0" ? "否" : "是";
            }},
            {title: '操作', minWidth:175, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        table.reload("indusListTable",{
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                title : $(".searchVal").val(),
                category : $("#search").val()
            }
        })
    });

    //加载所有文章分类
    $.ajax({
        url : "/console/initIndusAllCategory.shtml",
        type : "get",
        cache:true,
        dataType : "json",
        success : function(data){
            if(data.status==200){
                var categoryHtml = '<option value="-1">全部</option>';
                $.each(data.data,function(i,v){
                    categoryHtml += '<option value="'+v.id+'">'+v.title+'</option>';
                });
                $("#search").append(categoryHtml);
                form.render('select');
            }else{
                layer.msg(data.msg);
            }
        }
    })

    $(".addNews_btn").click(function(){
        addIndus();
    })

    //添加用户
    function addIndus(edit){
        var index = layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "userAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".userName").val(edit.userName);  //登录名
                    body.find(".userEmail").val(edit.userEmail);  //邮箱
                    body.find(".userSex input[value="+edit.userSex+"]").prop("checked","checked");  //性别
                    body.find(".userGrade").val(edit.userGrade);  //会员等级
                    body.find(".userStatus").val(edit.userStatus);    //用户状态
                    body.find(".userDesc").text(edit.userDesc);    //用户简介
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(index);
        })
    }

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('indusListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的文章？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url : "/console/deleteIndusSingleOrBatch.shtml",
                    type : "post",
                    data: {ids:newsId.toString()},
                    success : function(data){
                        if(data.status==200){
                            layer.msg(data.msg);
                            layer.close(index);
                            tableIns.reload();
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                })
            })
        }else{
            layer.msg("请选择需要删除的文章");
        }
    })

    //列表操作
    table.on('tool(userList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addIndus(data);
        }else if(layEvent === 'usable'){ //启用禁用
            var _this=$(this),
                usableText = "是否确定禁用此文章？",
                btnText = "已禁用",status=0;
            if(data.status==0){
                usableText = "是否确定启用此文章？",
                btnText = "已启用";
                status=1;
            }
            layer.confirm(usableText,{
                icon: 3,
                title:'系统提示',
                cancel : function(index){
                    layer.close(index);
                }
            },function(index){
                _this.text(btnText);
                layer.close(index);
                $.ajax({
                    url : "/console/updateIndusStatus.shtml",
                    type : "post",
                    data: {id:data.id,status:status},
                    success : function(data){
                        if(data.status==200){
                            layer.msg(data.msg);
                            layer.close(index);
                            tableIns.reload();
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                })
            },function(index){
                layer.close(index);
            });
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        }
    });

})