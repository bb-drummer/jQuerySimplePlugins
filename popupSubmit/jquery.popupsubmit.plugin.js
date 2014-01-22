/**
 * 
 */

(function( $ ){

	var settings = {
		'location'	:	'',
		'target'	:	'',
		'popup'		:	{
			'width'		:	400,
			'height'	:	300,
			'pos'		:	'center',
			'name'		:	'popupSubmitWindow',
			'options'	:	'none'
		}
	};
	
	var methods = {
		/**
		 * constructor
		 * 
		 * @param	options
		 * @returns	jQuery.popupSubmit
		 */
		init : function( options ) {
			
			if ( options ) { 
				$.extend( settings, options );
			}
			
			if (settings.target == '') {
				if ( '' == settings.popup.name) {
					settings.target = settings.popup.name;
				}
				settings.target = settings.popup.name;
			}

			return this.each(function(){
		        var $this = $(this),
		         	data = $this.data('popupSubmit'),
		         	popupSubmit = settings;
		        // If the plugin hasn't been initialized yet

		    	isForm = String(this.tagName).toLowerCase() == 'form';
		        if ( ! data ) {
					/*
					Do more setup stuff here
					*/
			        $(this).data('popupSubmit', {
			        	target : $this,
			        	popupSubmit : popupSubmit
			        });
			        initPlugIn($this);
		        }
			});

		},
		/**
		 * destructor
		 * @returns	jQuery
		 */
		destroy : function( ) {
		    var $this = $(this),
	         	data = $this.data('popupSubmit');

			return this.each(function(){
				$(this).unbind('.popupSubmit');
				data.popupSubmit.remove();
				$this.removeData('popupSubmit');
			});

		},

		link : function ( oEvent ) {
			// das folgende liegt hier eigendlich falsch ;)
			// das gehört in 'initPlugIn', gell?
			// die einzelnen Actions mappen nach tagName: 
			// actions['form'] : function ( oForm, ... ) {...}
			// actions['a'] : function ( oLink, ... ) {...}
			if (!oEvent) return;
			var oElement = $(oEvent.currentTarget);
			var sLink = String( oElement.attr('href') );
			var sFormSelector = String( oElement.attr('rel') );
			if ( (sLink == '#') && ( (sFormSelector != '') || oElement.hasClass('popuptrigger') ) ) {
				// open external form
				if ( (sFormSelector == '') && oElement.hasClass('popuptrigger') ) {
					var oForm = oElement.parents('FORM.popupSubmit');
					if (oForm.size() == 1) {
						sFormSelector = oForm;
					}
				} else {
					var oForm = $(sFormSelector);
				}
				console.log('open external form: '+sFormSelector);
				//submitForm(oForm, oEvent);
			} else if ( (sLink != '#') && (sLink != '') && oElement.hasClass('popuptrigger') ) {
				// open external form by standalone trigger
				if ( (sFormSelector == '') ) {
					var oForm = oElement.parents('FORM');
					if (oForm.size() == 1) {
						sFormSelector = oForm;
					} 
				} else {
					var oForm = $(sFormSelector);
				}
				console.log('open external form by standalone trigger: '+sFormSelector);
				//submitForm(oForm, oEvent);
			} else if ( (sLink != '#') && (sLink != '') && !oElement.hasClass('popuptrigger') ) {
				// assume normal popup link
				console.log('open link');
				//openLink(this);
			}

			oEvent.preventDefault();
			oEvent.stopPropagation();
			return (false);		
		},
		
		submit : function ( oEvent ) {
			console.log('open form');
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return (false);		
		}
		
	};
	
	//
	// private
	//
	var $_super		=	this;
	var isForm		=	String(this.tagName).toLowerCase() == 'form';
	
	/**
	 * init element plugin events
	 * 
	 * @param	oElement
	 * @returns	jQuery.popupSubmit
	 */
	var initPlugIn	=	function ( oElement ) {
		if (isForm && oElement) {
			oElement.bind('submit.popupSubmit', methods.submit);
			var aTriggers = oElement.find('.popuptrigger');
			aTriggers.each(function(){
				$(this).bind('click.popupSubmit', methods.link);
			});
		} else if (oElement) {
			switch ( String(oElement.tagName).toLowerCase() ) {
				case 'SELECT' : 
					oElement.bind('change.popupSubmit', methods.submit);
				break;
				default : 
					oElement.bind('click.popupSubmit', methods.link);
				break;
			}
		}
		return (oElement)
	};

	/**
	 *	creates new browser window and loads given URL
	 * 
	 *	@param		STRING				url
	 *	@param		STRING				name
	 *	@param		STRING				features
	 *	@param		INTEGER				myWidth
	 *	@param		INTEGER				myHeight
	 *	@param		BOOLEAN				isCenter
	 *	@returns	OBJECT|window
	 */
	var openFlexWindow = function (url, name, features, myWidth, myHeight, isCenter) {

		if (name == '') {
			name		=		'yetanotherwindow';
		}

		// Replace evtl. spaces with underscores
		name = name.replace(/ /g, "_");

		if ( (myHeight == '') || (myHeight == 0) )		 myHeight		=		500;
		if ( (myWidth == '') || (myWidth == 0) )		 myWidth				=		500;

		if ( (features == "none") || (features == '') ) {
			features = "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes";
		} else {
			if (features == "all") {
				features = "toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes";
			}
		}

		if (window.screen) {
			if ((isCenter != '') && (isCenter != 'false')) {
				var offset			=	30;
				var bottom_offset	=	70;
				switch (isCenter) {
					case 'top-left':
							var myLeft	=	offset;
							var myTop	=	offset;
					break;
					case 'top-right':
							var myLeft	=	screen.availWidth - myWidth - offset;
							var myTop	=	offset;
					break;
					case 'top-middle':
							var myLeft	=	(screen.availWidth - myWidth) / 2;
							var myTop	=	offset;
					break;
					case 'mid-left':
							var myLeft	=	offset;
							var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
					break;
					case 'mid-right':
							var myLeft	=	(screen.availWidth - myWidth) - offset;
							var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
					break;
					case 'bottom-left':
							var myLeft	=	offset;
							var myTop	=	screen.availHeight - myHeight - bottom_offset;
					break;
					case 'bottom-middle':
							var myLeft	=	(screen.availWidth - myWidth) / 2;
							var myTop	=	screen.availHeight - myHeight - bottom_offset;
					break;
					case 'bottom-right':
								var myLeft	=	screen.availWidth - myWidth - offset;
								var myTop	=	screen.availHeight - myHeight - bottom_offset;
						break;
					default:
							var myLeft	=	(screen.availWidth - myWidth) / 2;
							var myTop	=	( (screen.availHeight - myHeight) / 2) - offset;
					break;
				}
				features	+=	(features != '') ? ',' : '';
				features	+=	'left=' + myLeft + ',top=' + myTop;
			}
		}

		features		=	(features != '') ? features + ',width=' + myWidth + ',height=' + myHeight : 'width=' + myWidth + ',height=' + myHeight;
		var popupWin	=	window.open (url, name, features);
		if (popupWin) {
			popupWin.focus();
		}
		return (popupWin);
	};


	
	//
	// plugIn init
	//
	/**
	 * initialize jQuery plugIn
	 * 
	 * @param	methos
	 * @returns	jQuery.popupSubmit
	 */
	$.fn.popupSubmit = function( method ) {
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +	method + ' does not exist on jQuery.popupSubmit' );
		}		
		return (this);
		
	};
	
	return ($);

})( jQuery );