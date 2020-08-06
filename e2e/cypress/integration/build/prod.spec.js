/* globals context, cy */
/// <reference types="Cypress" />

context('wpackio-scripts serve', () => {
	beforeEach(() => {
		cy.visit('http://127.0.0.1:5000/prod');
	});

	describe('For JavaScript App', () => {
		it('main entry should mount', () => {
			cy.get('#main-app').should('have.text', 'This is main app');
		});
		it('dynamic import should work', () => {
			cy.get('#dyn-app').should('have.text', 'I am dynamically imported');
		});
		it('SASS should work', () => {
			cy.get('#blue').should('have.css', 'color', 'rgb(0, 0, 255)');
		});
		it('LESS should work', () => {
			cy.get('#green').should('have.css', 'color', 'rgb(0, 255, 0)');
		});
		it('Asset from CSS should work', () => {
			cy.wait(5000);
			cy.get('#bg-image').then(el => {
				const bg = el.css('background-image');
				const bgUrl = bg
					.replace('url(', '')
					.replace(')', '')
					.replace(/"/gi, '');
				cy.request(bgUrl);
			});
		});
		it('Asset from JS should work', () => {
			cy.get('#img-tag')
				.find('img')
				.then(el => {
					const imgUrl = el.attr('src');
					cy.request(`http://127.0.0.1:5000${imgUrl}`);
				});
		});
	});

	describe('For TypeScript App', () => {
		it('main entry should mount', () => {
			cy.get('#ts-app').should('have.text', 'I am ts app');
		});
		it('dynamic import should work', () => {
			cy.get('#ts-dyn-app').should(
				'have.text',
				'I am dynamically imported from ts module'
			);
		});
		it('SASS should work', () => {
			cy.get('#red').should('have.css', 'color', 'rgb(255, 0, 0)');
		});
		it('LESS should work', () => {
			cy.get('#yellow').should('have.css', 'color', 'rgb(255, 255, 0)');
		});
	});
});
