$(document).ready(function() {
	$(document).on('contextmenu', function(e) {
		e.preventDefault();
        $('#panel').addClass('active');

        var safeRect = $('#safe')[0].getBoundingClientRect();
        var panelWidth = $('#panel').outerWidth();
        var panelHeight = $('#panel').outerHeight();

        var left = e.clientX - safeRect.left;
        var top = e.clientY - safeRect.top;

        left = Math.max(0, Math.min(left, safeRect.width - panelWidth));
        top = Math.max(0, Math.min(top, safeRect.height - panelHeight));

        $('#panel').css({
            left: left + 'px',
            top: top + 'px'
        });
        console.log('System | Panel | Active ', left, top);
	});

    $(document).on('mousedown', function(e) {
        if ($('#panel').hasClass('active') && !$(e.target).closest('#panel').length) {
            $('#panel').removeClass('active');
            console.log('System | Panel | Inactive');
        }
    });

    $('.button-close').on('click', function() {
        setTimeout(function() {
            $('#panel').removeClass('active');
            $('.panel-extend').removeClass('active');
            console.log('System | Panel | Force Inactive');
        }, 10); // 100ms delay
    });
    $('#panel-add-button').on('click', function() {
        $('#panel-add').toggleClass('active');
        console.log('System | Panel | Toggle | Extension');
    });
});