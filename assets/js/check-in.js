$(function () {
  // 关闭弹窗
  $("body").on("click", ".close-qiandao", function () {
    $(this).parents(".qiandao-layer").fadeOut();
  });

  // 签到弹框
  $("#check-in-btn").on("click", function () {
    openLayer("qiandao-history-layer", myFun);

    function myFun() {
      console.log(1);
    }
  }); 

	$("#calendar-btn").on("click", function () {
		$(".calendar-box-layer").fadeIn();
	});

	$(".close-btn").on("click", function () {
		$(".calendar-box-layer").fadeOut();
	});

  function openLayer(a, Fun) {
    $("." + a).fadeIn(Fun);
  }

		// eq()方法：返回被选元素中带有指定索引号的元素。
		$('.menu li').on('click', function () {
			// 给当前选中的li添加一个选中的样式，除了点击当前的这个样式其他的删除样式
			$(this).addClass('active').siblings().removeClass('active');
			// 第一种写法
			// $('.boxs > div').hide().eq($('.tabs li').index(this)).show();
			// 第二种写法
			// siblings:除自己以外
			// 当前指向的上级父元素的下一个子元素的索引下标出现，让其他的消失
			$(this).parent().next().children().eq($(this).index()).css('display', 'block').siblings().css('display', 'none');
	})

});
