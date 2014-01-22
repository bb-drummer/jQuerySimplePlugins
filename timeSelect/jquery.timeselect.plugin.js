/**
 * 
 */

(function( $ ){

	var oSettings = {
		start			:	new Date(),
		end				:	new Date(), // (new Date()).setHours( (new Date()).getHours()+4 ) ),
		selected		:	new Date(),
		step			:	1,
		
		// special settings
		wrapClass		:	'timeselect',
		hoursClass		:	'hours',
		minutesClass	:	'minutes',
		wrapTag			:	'span',
		hoursName		:	'hours',
		minutesName		:	'minutes'
	};
	
	var publicMethods = {
			
		/**
		 * constructor
		 * 
		 * @param	options
		 * @returns	jQuery.popupSubmit
		 */
		init : function( options ) {
			
			if ( options ) { 
				$.extend( oSettings, options );
			}
			
			return this.each(function(){
				if ( String(this.tagName).toLowerCase() != 'input' ) return;
		        var $this = $(this),
		         	data = $this.data('timeSelect'),
		         	timeSelect = oSettings;
		        // If the plugin hasn't been initialized yet

		    	if ( ! data ) {
					/*
					Do more setup stuff here
					*/
			        $(this).data('timeSelect', {
			        	target : $this,
			        	timeSelect : timeSelect
			        });
			        initPlugIn($this);
		        } else {
		        	//set();
		        }
		    	
			});

		},
		
		/**
		 * destructor
		 * @returns	jQuery
		 */
		destroy : function ( ) {
		    var $this = $(this),
	         	data = $this.data('timeSelect');

			return this.each(function(){
				$(this).unbind('.timeSelect');
				data.timeSelect.remove();
				$this.removeData('timeSelect');
			});

		},
		
		time : function ( timeToSet ) {
			var oTime = new Date();
			if (timeToSet) {
				oTime = setTimeSelected(timeToSet);
			} else {
				oTime = getTimeSelected();
			}
			return (oTime);
		},
		
		selected : function ( time ) {
			return publicMethods['time'].apply(this, time);
		},
		
		reset : function () {
			return initPlugIn(this);
		}
		
	};
	
	//
	// private
	//
	var $_super		=	this;
	
	/**
	 * init element plugin options, markup and/or events
	 * 
	 * @param	oElement
	 * @returns	jQuery.popupSubmit
	 */
	var initPlugIn	=	function ( oElement ) {
		if (oElement) {
			createMarkup(oElement);
		}
		setHoursMinutes(oElement);
		setTimeSelected( oSettings.selected, oElement);
		return (oElement);
	};

	var initEvents = function ( oContainer ) {
		
	};

	var createMarkup = function ( oContainer ) {
		var $this = jQuery(oContainer);
		if ($this.siblings('.'+oSettings.wrapClass).size() == 0) {
			var aTimeSelects = [
    		    '<', oSettings.wrapTag, ' class="', oSettings.wrapClass, '">',
    		    	'<select class="', oSettings.hoursClass, '" name="', oSettings.hoursName, '" size="1">','</select>',
    		    	':',
    		    	'<select class="', oSettings.minutesClass, '" name="', oSettings.minutesName, '" size="1">','</select>',
    		    	'h',
    		    '</', oSettings.wrapTag, '>'
    		];
    		var sTimeSelects = aTimeSelects.join('');
    		$this.parent().append(sTimeSelects);
    		$this.data('timeSelect', jQuery.extend($this.data('timeSelect'), {
    			wrap	:	$this.siblings('.'+oSettings.wrapClass+''),
    			hours	:	$this.parent().find('.'+oSettings.hoursClass),
    			minutes	:	$this.parent().find('.'+oSettings.minutesClass)
    		}));
		}
		return ($this);
	};

	var setHoursMinutes = function ( oContainer ) {
		var $this		=	jQuery(oContainer);
		var oHours		=	$this.parent().find('.'+oSettings.hoursClass);
		var oMinutes	=	$this.parent().find('.'+oSettings.minutesClass);
		var oStart		=	oSettings.start		||	new Date();
		var oEnd		=	oSettings.end		||	new Date();
		var oSelected	=	oSettings.selected	||	new Date();
		var iStep		=	oSettings.step		||	1;
		var aHours		=	[];
		var aMinutes	=	[];
		
		for ( oTime = oStart; oTime.getHours() < oEnd.getHours(); oTime.setHours(oTime.getHours()+1) ) {
			aHours.push(
				'<option value="', oTime.getHours(), '">', ((oTime.getHours() < 10) ? '0'+oTime.getHours() : oTime.getHours()), '</option>'
			);
		}
		for (iMinute = 0; iMinute < 60; iMinute += iStep) {
			aMinutes.push(
				'<option value="', iMinute, '">', ((iMinute < 10) ? '0'+iMinute : iMinute), '</option>'
			);
		}
		var sHours		=	aHours.join('');
		var sMinutes	=	aMinutes.join('');
		
		oHours.append(sHours);
		oMinutes.append(sMinutes);
			
		return ($this);
	};

	var setTimeSelected = function ( mTime, oContainer ) {
		var oTime		=	new Date(mTime);
		var $this		=	jQuery( (oContainer || this) );
		var oHour		=	$this.parent().find('.'+oSettings.hoursClass+'');
		var oMinute		=	$this.parent().find('.'+oSettings.minutesClass+'');
		var oHours		=	$this.parent().find('.'+oSettings.hoursClass+' OPTION');
		var oMinutes	=	$this.parent().find('.'+oSettings.minutesClass+' OPTION');
		var iHour		=	oTime.getHours();
		var iMinute		=	oTime.getMinutes();
		var iStep		= 	getStep(iMinute, (oSettings.step || 1));
		console.debug(iStep);
		if ( iStep == 0 ) {
			iHour++;
		}
		oHours.each(function ( iOption, oOPTION ) {
			if (jQuery(oOPTION).attr('value') == iHour) {
				jQuery(oOPTION).attr('selected', 'selected');
			} else {
				jQuery(oOPTION).attr('selected', false);
			}
		});
		oMinutes.each(function ( iOption, oOPTION ) {
			if (iOption == iStep) {
				jQuery(oOPTION).attr('selected', 'selected');
			} else {
				jQuery(oOPTION).attr('selected', false);
			}
		});
		saveTimeSelected( oTime, $this );
	};

	var saveTimeSelected = function ( mTime, oContainer ) {
		var oTime		=	new Date(mTime);
		var $this		=	jQuery( (oContainer || this) );
		var oHour		=	$this.parent().find('.'+oSettings.hoursClass+'');
		var oMinute		=	$this.parent().find('.'+oSettings.minutesClass+'');
		oTime.setHours( oHour.val() );
		oTime.setMinutes( oMinute.val() );
		oTime.setSeconds( 0, 0 );
		$this.data('timeSelect', jQuery.extend($this.data('timeSelect'), {
			timeSelected	:	oTime
		}));
	};

	var getTimeSelected = function ( oContainer ) {
		var $this		=	jQuery( (oContainer || this) 	);
		var oData		=	$this.data('timeSelect');
		if (oData) {
			return (oData.timeSelected);
		}
		return (false);
	};

	var getStep = function ( iMinutes, iStep, bLower ) {
		var a =  parseInt( iMinutes / iStep );
		var b =  parseInt( 60 / iStep );
		return ( (a >= b-1) ? 0 : ( a + ( (bLower) ? 0 : 1 ) ) );
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
	$.fn.timeSelect = function( method ) {
		
		// Method calling logic
		if ( publicMethods[method] ) {
			return publicMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return publicMethods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +	method + ' does not exist on jQuery.timeSelect' );
		}		
		return (this);
		
	};
	
	return ($);

})( jQuery );