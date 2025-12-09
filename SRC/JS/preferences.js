$(document).ready(function() {
    $('#preferences-close').on('click', function() {
        $('#preferences').removeClass('active');
        console.log('System | Preferences | Inactive');
    });

    // Modular range slider logic without variables
    $('.rangeslider .range').each(function() {
        function updateSlider() {
            var min = parseFloat($(this).attr('min')) || 0;
            var max = parseFloat($(this).attr('max')) || 100;
            var val = parseFloat($(this).val());
            var percent = ((val - min) / (max - min)) * 100;
            $(this).closest('.rangeslider').find('.value h3').text(val + ($(this).closest('.rangeslider').find('.value h3 span').length ? $(this).closest('.rangeslider').find('.value h3 span').text() : 'px'));
            $(this).closest('.rangeslider').find('.value').css('width', percent + '%');
            // Position value text so it never leaves .rangeslider
            var sliderWidth = $(this).closest('.rangeslider').width();
            var valueWidth = $(this).closest('.rangeslider').find('.value h3').outerWidth();
            var leftPx = (percent / 100) * sliderWidth;
            var edgePx = sliderWidth - valueWidth - 0;
            leftPx = Math.min(leftPx, edgePx);
            $(this).closest('.rangeslider').find('.value h3').css('left', leftPx + 'px');

            // Change color to black if at edge
            if (leftPx >= edgePx) {
                $(this).closest('.rangeslider').find('.value h3').css('color', 'black');
            } else {
                $(this).closest('.rangeslider').find('.value h3').css('color', '');
            }
            
            $(':root').css('--br', val + 'px');
        }
        $(this).on('input change', updateSlider);
        updateSlider.call(this);
    });
});