/**
 * Created by Administrator on 2016-11-2.
 */
openerp.asset_management=function(instance){
    var _t=instance.web._t,
        _lt=instance.web._lt,
        QWeb=instance.web.qweb;
    instance.asset_management={};

    instance.asset_management.Widget=instance.web.Widget.extend({
        menuId:-1,//初始化菜单ID
        l:0,//用来保存不同用户的的差值
        init:function(){
            var self=this;
            var timer=setInterval(function(){
                var action_manager=instance.client.action_manager;
                if(action_manager){
                    var inner_action=action_manager.inner_action;
                    if(inner_action){
                        var display_name=inner_action.display_name;
                        if(display_name){
                            clearInterval(timer);
                            self.addAction(display_name);
                            watch(action_manager,"inner_action",function(pro,action,newVal,oldVal){
                                newVal&&self.addAction(newVal.display_name);
                            });
                        }
                    }
                }
            },100);
        },
        //视图加载完成后定义自己的动作
        addAction:function(title){
            var self=this;
            var timer=setInterval(function(){
                var targetSpan=$("#oe_main_menu_navbar ul.navbar-left>li.active>a>span.oe_menu_text");
                if(targetSpan.length){
                    clearInterval(timer);
                    var modelTitle=targetSpan.html().trim();
                    if(modelTitle=="Asset management"||modelTitle=="仓库管理"){
                        self.removeBtn(title);//删除按钮
                        self.menuId=targetSpan.parent("a").attr("data-menu");
                        //self.search(title);//添加搜索按钮
                        self.menuCounter();
                    }
                }
            },100);
        },
        removeBtn:function(display_name){
            var me=this;
            var uid=instance.session.uid;
            var n=(uid==1?2:0);
            this.l=n;
            var obj={
                "所有的设备":[1+n,2+n,3+n,5+n],
                "库存中的设备":[2+n,4+n,6+n,5+n],
                "借用设备":[5+n],
                "领用设备":[5+n],
                "实验室设备":[5+n],
                //"我的设备":[1+n],
                "待入库的设备":[1+n,3+n]
            };
            var timer=setInterval(function(){
                if($("li.oe_sidebar_action").length>3){
                    clearInterval(timer);
                    $("li.oe_sidebar_action").css("display","none");
                    $('a[data-index='+(1+me.l)+']').parent().css("display","none");
                    $(obj[display_name]).each(function(i,v){
                        $('a[data-index='+v+']').parent().css("display","block");
                    });
                }
            },100);
        },
        search:function(t){
            if(t=="所有的设备"||t=="库存中的设备"){
                var self=this;
                var seachKey="";
                var keys={"apply_ids":true, "create_uid":true, "create_date":false,
                    "get_ids":true, "id":false, "write_uid":true, "write_date":false,
                    "lend_ids":true, "storage_id":true, "company":false, "note":true,
                    "area":true, "machine_room":true, "floor":true, "sn":true, "seat":true,
                    "owner":true, "cabinet_number":true, "state":false, "firms":true,
                    "unit_type":true, "equipment_source":true, "equipment_status":false,
                    "equipment_use":false, "device_type":true, "asset_number":true,
                    "start_u_post":true};
                var $searchMH=$('<button type="button" class="fuzzy_search">模糊搜索</button>');
                $('.oe_view_manager_view_search').append($searchMH);
                $('.oe_view_manager_view_search div.oe_searchview').css({
                    "min-width":"300px"
                });
                $('.oe_view_manager_view_search div.oe_searchview>div.oe-autocomplete').css({
                    "width":"300px"
                });
                $('.oe_view_manager_view_search').on("keyup",".oe_searchview_input",function(){
                    seachKey=$(this).html();
                });
                $searchMH.click(function(){
                    var n=0;
                    $("form li:first .searchview_extended_prop_field option").each(function(i,v){
                        var optionVal= $(v).val();
                        if(keys[optionVal]){
                            $("form li:eq("+n+") .searchview_extended_prop_field").val(optionVal);
                            $("form li:eq("+n+") .searchview_extended_prop_field").trigger("change");
                            $("form li:eq("+n+") .searchview_extended_prop_op").val("ilike");
                            $("form li:eq("+n+") .searchview_extended_prop_value>input.field_char").val(seachKey);
                            $('.oe_add_condition').trigger("click");
                            n++;
                        }
                    });
                    $("form button.oe_apply:first").trigger("submit");
                });
            }
        },
        start:function(){
        //暂时不需要
        },
        menuCounter:function(){
            var timer = setInterval(function(){
                var mC=$("a>div.badge.pull-right");
                if(mC.length){
                    clearInterval(timer);
                    timer=0;
                    mC.each(function(i,v){
                        var parent = $(v).parents("ul.nav.nav-stacked")
                            .prev("div.oe_secondary_menu_section");
                        if(parent.find("div.badge").length){
                            parent.find("div.badge").html($(v).html());
                        }else{
                            parent.append('<div class="badge pull-right">'+$(v).html()+'</div>');
                        }
                    });
                }
            },100);
        }
    });
    instance.asset_management.widget=new instance.asset_management.Widget();
}
