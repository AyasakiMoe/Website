// JavaScript Document
function init(_el){
	function start(_this){
		$(_el).each(function(i){
			$(this).css("animation-delay",`${++i * 0.2}s`);
			let _this = $(this);
			let windowHeight = $(window).height();
			let windowScrollTop = $(window).scrollTop();
			if(windowHeight + windowScrollTop > parseInt(_this.offset().top)){
				_this.addClass(_this.data().animation);
			}
		})
	}
	$(window).on("scroll",function(){
		start(_el)
	})
	start(_el)
}