/**
 * @license Copyright (c) 2014-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'fr',
		name: 'QuickFix',
		callback: function( QuickFix ) {

			var emptyWhitespaceRegExp = /^[\s\n\r]+$/g;

			/**
			 * Fixes the image with missing alt attribute.
			 *
			 * @constructor
			 */
			function ImgAlt( issue ) {
				QuickFix.call( this, issue );
			}

			/**
			 * Maximal count of characters in the alt. It might be changed to `0` to prevent
			 * length validation.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix.AttributeRename
			 * @static
			 */
			ImgAlt.altLengthLimit = 100;

			ImgAlt.prototype = new QuickFix();
			ImgAlt.prototype.constructor = ImgAlt;

			ImgAlt.prototype.display = function( form ) {
				form.setInputs( {
					alt: {
						type: 'text',
						label: this.lang.altLabel,
						value: this.issue.element.getAttribute( 'alt' ) || ''
					}
				} );
			};

			ImgAlt.prototype.fix = function( formAttributes, callback ) {
				this.issue.element.setAttribute( 'alt', formAttributes.alt );

				if ( callback ) {
					callback( this );
				}
			};

			ImgAlt.prototype.validate = function( formAttributes ) {
				var ret = [],
					proposedAlt = formAttributes.alt + '',
					imgElem = this.issue && this.issue.element,
					lang = this.lang;

				// Test if the alt has only whitespaces.
				if ( proposedAlt.match( emptyWhitespaceRegExp ) ) {
					ret.push( lang.errorWhitespace );
				}

				// Testing against exceeding max length.
				if ( ImgAlt.altLengthLimit && proposedAlt.length > ImgAlt.altLengthLimit ) {
					var errorTemplate = new CKEDITOR.template( lang.errorTooLong );

					ret.push( errorTemplate.output( {
						limit: ImgAlt.altLengthLimit,
						length: proposedAlt.length
					} ) );
				}

				if ( imgElem ) {
					var fileName = String( imgElem.getAttribute( 'src' ) ).split( '/' ).pop();
					if ( fileName == proposedAlt ) {
						ret.push( lang.errorSameAsFileName );
					}
				}

				return ret;
			};

			ImgAlt.prototype.lang = {"altLabel":"Text alternatif","errorTooLong":"Le texte alternatif est trop long. Il ne doit pas d�passer {limit} caract�res alors que vous en avez {length}","errorWhitespace":"Le texte alternatif ne peut pas contenir que des espaces","errorSameAsFileName":"Le text ne doit pas �tre identique au nom du fichier"};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'fr/ImgAlt', ImgAlt );
		}
	} );
}() );
