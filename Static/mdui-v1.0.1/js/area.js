(function ($) {
    'use strict';
    /* ***********************
    :: 1.0 Fullscreen Code
    ************************ */

    $(window).on('resizeEnd', function () {
        $(".welcome_area, .welcome_slides .single_slide, .single_slide").height($(window).height());
    });

    $(window).on('resize', function () {
        if (this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function () {
            $(this).trigger('resizeEnd');
        }, 300);
    }).trigger("resize");

    /* *******************************************
    :: 2.0 Welcome and Advisor Slider active code
    ******************************************* */

    if ($.fn.owlCarousel) {
        $(".welcome_slides, .single_advisor_profile").owlCarousel({
            items: 1,
            margin: 0,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
            dots: false,
            autoplay: true,
            autoplayTimeout: 6000,
            smartSpeed: 300,
            autoplayHoverPause: true,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn'
        });
    }

    var owl = $('.welcome_slides');
    owl.owlCarousel();
    owl.on('translate.owl.carousel', function (event) {
        $('.owl-item .single_slide .slide_text h2').removeClass('animated').hide();
        $('.owl-item .single_slide .slide_text h3').removeClass('animated').hide();
        $('.owl-item .single_slide .slide_text .btn').removeClass('animated').hide();
    })

    owl.on('translated.owl.carousel', function (event) {
        $('.owl-item.active .single_slide .slide_text h2').addClass('animated fadeInDown').show();
        $('.owl-item.active .single_slide .slide_text h3').addClass('animated fadeInRight').show();
        $('.owl-item.active .single_slide .slide_text .btn').addClass('animated fadeInUp').show();
    })



})(jQuery);