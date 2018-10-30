/* eslint-disable spaced-comment */
/* globals context, cy */
/// <reference types="Cypress" />

context('wpackio-scripts serve', () => {
	beforeEach(() => {
		cy.visit('http://127.0.0.1:3000');
	});
	describe('webpack-dev-server should serve', () => {
		it('compiled JS', () => {
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/app/runtime.js'
			);
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/app/vendors~main.js'
			);
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/app/main.js'
			);
		});

		it('compiled TS', () => {
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/tsapp/runtime.js'
			);
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/tsapp/vendors~main.js'
			);
			cy.request(
				'http://127.0.0.1:3000/wp-content/plugins/e2e-plug/dist/tsapp/main.js'
			);
		});
	});

	describe('For JavaScript App', () => {
		it('main entry should mount', () => {
			cy.get('#main-app').should('have.text', 'This is main app');
		});
		it('dynamic import should work', () => {
			cy.get('#dyn-app').should('have.text', 'I am dynamically imported');
		});
		it('HMR should work', () => {
			cy.get('#dyn-app').should('have.text', 'I am dynamically imported');
			cy.task('hmrJs').then(() => {
				cy.get('#dyn-app').should('have.text', 'I am HMRed');
				cy.task('hmrJsRestore').then(() => {
					cy.get('#dyn-app').should('have.text', 'I am HMRed');
				});
			});
		});
		it('SASS should work', () => {
			cy.get('#blue').then(el => {
				expect(el).to.have.css('color', 'rgb(0, 0, 255)');
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
		it('HMR should work', () => {
			cy.get('#ts-app').should('have.text', 'I am ts app');
			cy.task('hmrTs').then(() => {
				cy.get('#ts-app').should('have.text', 'I am HMRed');
				cy.task('hmrTsRestore').then(() => {
					cy.get('#ts-app').should('have.text', 'I am HMRed');
				});
			});
		});
		it('SASS should work', () => {
			cy.get('#red').then(el => {
				expect(el).to.have.css('color', 'rgb(255, 0, 0)');
			});
		});
	});
});
