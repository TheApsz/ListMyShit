import {restoreCardsToDOM, updateCardElementsFromData, saveAllCards } from '../BACKEND/save.js';

document.addEventListener('DOMContentLoaded', () => {
	restoreCardsToDOM();
	updateCardElementsFromData();
});

setInterval(() => {
	updateCardElementsFromData();
	saveAllCards();
}, 1000);

$(document).ready(function() {
	$('#spawnCard').on('click', function() {
        console.log('System | Panel | Spawn .card');
		// Card HTML
		const cardHtml = `
		<div class="card cardFree trans-med"
                    data-identifier=""
                    data-title="Card Title"
                    data-description="Card description text goes here"
                    data-posX="500"
                    data-posY="500"
                    >

                    <div class="cardEdit button">
                        <span class="material-symbols-rounded">edit</span>
                    </div>
                    <h3>Card title</h3>
                    <h2>Card description text goes here</h2>
                    <div class="cardLabel">
                        <div class="cardLabelLabel"></div>
                    </div>
                </div>`;

		// Append to #safe
		const $card = $(cardHtml).appendTo('#safe');

		// Center in viewport
		const winW = $(window).width();
		const winH = $(window).height();
		const cardW = 250; // match .cardFree width
		const cardH = $card.outerHeight();
		const posX = Math.round(winW / 2 - cardW / 2);
		const posY = Math.round(winH / 2 - cardH / 2);

		$card.attr('data-pos-x', posX);
		$card.attr('data-pos-y', posY);
		$card[0].style.setProperty('--card-pos-x', posX + 'px');
		$card[0].style.setProperty('--card-pos-y', posY + 'px');
	});
});
