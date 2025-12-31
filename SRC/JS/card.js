// Enable drag-and-drop for .card elements between .cat containers
$(document).ready(function() {
	let $draggedCard = null;
	let $clone = null;
	let offsetX = 0, offsetY = 0;

	$(document).on('mousedown', '.card', function(e) {
		let dragThreshold = 30; // px
		let startX = e.pageX;
		let startY = e.pageY;
		let mouseX = e.pageX;
		let mouseY = e.pageY;
		let dragging = false;
		let $originalParent = null;
		let animInterval = null;

		function startDrag() {
			$draggedCard = $(e.currentTarget);
			$draggedCard.addClass('dragging');
			offsetX = mouseX - $draggedCard.offset().left;
			offsetY = mouseY - $draggedCard.offset().top;

			$clone = $draggedCard.clone()
				.addClass('trans-med')
				.css({
					position: 'absolute',
					pointerEvents: 'none',
					zIndex: 1000,
					width: $draggedCard.outerWidth(),
					left: mouseX - offsetX,
					top: mouseY - offsetY,
					opacity: 1
				})
				.appendTo('body');

			// Store original parent in case we need to revert
			$originalParent = $draggedCard.parent();

			// Move the card to #safe so it's not inside any .cat
			$('#safe').append($draggedCard);
			$draggedCard.addClass('cardFree');
            $draggedCard.addClass('trans-med');
			// Set initial position data and CSS vars
			let px = $draggedCard.position().left;
			let py = $draggedCard.position().top;
			$draggedCard.attr('data-pos-x', px);
			$draggedCard.attr('data-pos-y', py);
			$draggedCard[0].style.setProperty('--card-pos-x', px + 'px');
			$draggedCard[0].style.setProperty('--card-pos-y', py + 'px');
			$draggedCard.css('visibility', 'hidden');

			animInterval = setInterval(function() {
				$clone.css({
					left: mouseX - offsetX,
					top: mouseY - offsetY
				});
				// If card is in #safe, update its data-pos-x/y and CSS vars
				if ($draggedCard && $draggedCard.parent().attr('id') === 'safe') {
					$draggedCard.attr('data-pos-x', mouseX - offsetX);
					$draggedCard.attr('data-pos-y', mouseY - offsetY);
					$draggedCard[0].style.setProperty('--card-pos-x', (mouseX - offsetX) + 'px');
					$draggedCard[0].style.setProperty('--card-pos-y', (mouseY - offsetY) + 'px');
				}
			}, 0);
		}

		function stopDrag(ev) {
			$(document).off('.carddrag');
			if (animInterval) clearInterval(animInterval);
			if ($clone) $clone.remove();
			if ($draggedCard) $draggedCard.removeClass('dragging');

			// Find the .cat under the mouse
			var $targetCat = $(document.elementFromPoint(ev.clientX, ev.clientY)).closest('.cat');
			if ($draggedCard) {
				if ($targetCat.length) {
					$draggedCard.appendTo($targetCat);
					$draggedCard.removeClass('cardFree');
					$draggedCard.removeAttr('data-pos-x data-pos-y');
					$draggedCard[0].style.removeProperty('--card-pos-x');
					$draggedCard[0].style.removeProperty('--card-pos-y');
				} else {
					// If not dropped on a .cat, keep in #safe and ensure .cardFree
					$('#safe').append($draggedCard);
					$draggedCard.addClass('cardFree');
					// Keep last position and CSS vars
				}
				$draggedCard.css('visibility', '');
			}
			$draggedCard = null;
			$clone = null;
		}

		$(document).on('mousemove.carddrag', function(ev) {
			mouseX = ev.pageX;
			mouseY = ev.pageY;
			if (!dragging) {
				let dx = mouseX - startX;
				let dy = mouseY - startY;
				if (Math.sqrt(dx*dx + dy*dy) > dragThreshold) {
					dragging = true;
					startDrag();
				}
			}
		});

		$(document).on('mouseup.carddrag', function(ev) {
			if (dragging) {
				stopDrag(ev);
			} else {
				$(document).off('.carddrag');
			}
		});

		// Prevent text selection
		e.preventDefault();
	});
});
