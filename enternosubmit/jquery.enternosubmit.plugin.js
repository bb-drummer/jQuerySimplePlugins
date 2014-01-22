/**
 *	enterNoSubmit jQuery plug-in
 *
 *  a simple plug-in, intended to prevent submitting a form when hitting the "enter" key
 *	-	if focused on some input element the plug-in will apply directly to this element
 *  -	if focused on any other element the plug-in will try to select all (input) elements inside 
 *		this element and apply itself to each of them, default: 'INPUT[type=text]'
 *	-	triggers on one of these DOM key events:  'down', 'up' or 'press', default: 'down' 
 *	-	you can provide a callback, which is triggered, if event propagation has stopped
 *
 *	usage:
 *	<code>
 *		<script type="text/javascript" src="/path/to/jquery-1.4.2.min.js"></script>
 *		<script type="text/javascript" src="/path/to/jquery.enternosubmit.plugin.min.js"></script>
 *
 *		...
 *
 *		<script>
 *		jQuery(document).ready(function(){
 *
 *			// default configuration: <input class="otherinput" /> or <any class="otherinput">...<input type=text />...</any>, key-down, no callback
 *			jQuery('.otherinput').enterNoSubmit();
 *
 *			// default configuration: <form class="myform">...<input type="text" />...</form>, key-down, no callback
 *			jQuery('FORM.myForm').enterNoSubmit();
 *
 *			// custom configuration
 *			jQuery('#ePopupForm UL').enterNoSubmit({
 *				//	the key's event which triggers submitting prevention: 'down', 'up' or 'press', default: 'down' 
 *				keyevent	:	'press',
 *				//	supposed to be your custom function triggered when submitting is prevented
 *				callback	:	function (oEvent) { console.debug(this); console.debug(oEvent); },
 *				//	selector for any elements inside any other element this plug-in is applied on and provides DOM key events, default: 'INPUT[type=text]'
 *				inputs		:	'.input1'
 *			});
 *
 *		});
 *		</script>
 *
 *	</code>
 *
 *	@package		enterNoSubmit jQuery plug-in
 * 
 *	@copyright		(c) 2009 Bjoern Bartels [http://dragon-projects.net, info@dragon-projects.net]
 *	@author			Bjoern Bartels [http://dragon-projects.net, info@dragon-projects.net]
 *	@created		03/2009
 *	@version		1.0
 */

(function( $ ){

	var oDefaults = {
		//	the key's event which triggers submitting prevention: 'down', 'up' or 'press', default: 'down' 
		keyevent	:	'down',				
		//	supposed to be your custom function triggered when submitting is prevented
		callback	:	false,				 
		//	selector for any elements inside any other element this plug-in is applied on and provides DOM key events, default: 'INPUT[type=text]'
		inputs		:	'INPUT[type=text]'	,
        // set to true to let the plug-in also invoke on the element itself if it is not an input element
		applyOnSelf	:	false
	};
	
	var methods = {
		/**
		 * constructor
		 * 
		 * @access	public
		 * @param	options
		 * @returns	jQuery.enterNoSubmit
		 */
		init : function( options ) {
			var config = {};
			
			if ( options ) { 
				$.extend( config, settings, options );
			}
			
			return this.each(function(){
				
		        var $this = $(this),
		         	data = $this.data('enterNoSubmit'),
		         	enterNoSubmit = config;

		    	isInput = String(this.tagName).toLowerCase() == 'input';
		    	
		    	if (!isInput) {
		    		// handle all (text)input elements inside this element
		    		var aInputs;
		    		if (config.inputs && (config.inputs != '')) {
		    			aInputs = $this.find(config.inputs);
		    		} else {
		    			aInputs = $this.find(oDefaults.inputs);
		    		}
		    		aInputs.each(function () {
		    			jQuery(this).enterNoSubmit(options);
		    		});
			        if ( !data && config.applyOnSelf ) {
				        $(this).data('enterNoSubmit', {
				        	target : $this,
				        	config : enterNoSubmit
				        });
				        initEvents($this);
			        }
		    	} else {
		    		// handle single (text)input element
			        if ( ! data ) {
				        $(this).data('enterNoSubmit', {
				        	target : $this,
				        	config : enterNoSubmit
				        });
				        initEvents($this);
			        }
		    	}
		    	
			});

		},
		
		/**
		 * destructor
		 * 
		 * @access	public
		 * @returns	jQuery
		 */
		destroy : function( ) {
		    var $this = $(this),
	         	data = $this.data('enterNoSubmit');

			return this.each(function(){
				$(this).unbind('.enterNoSubmit');
				data.enterNoSubmit.remove();
				$this.removeData('enterNoSubmit');
			});

		}
		
	};
	
	//
	// private
	//
	var $_super		=	this;
	
	/**
	 * init element plugin events
	 * 
	 * @access	private
	 * @param	oElement
	 * @returns	jQuery.enterNoSubmit
	 */
	var initEvents	=	function ( oElement ) {
		var aAllowedEvents	=	['down', 'up', 'press'];
		if (oElement) {
			var oConfig = oElement.data('enterNoSubmit').config;
			var sEvent	=	String(oConfig.keyevent).toLowerCase();
			if (aAllowedEvents.indexOf(sEvent) == -1) {
				sEvent	=	'down';
			}
			oElement.bind('key'+sEvent+'.enterNoSubmit', doNotSubmit);
		};
		return (oElement);
	};

	/**
	 * in fact stop propagation of the original event triggered an d, if a callback is provided, execute it
	 * 
	 * @access	private
	 * @param	oElement
	 * @returns	jQuery.enterNoSubmit
	 */
	var doNotSubmit	=	function ( oEvent ) {
		var $this = $(this);
		if (oEvent && oEvent.which == 13) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			var oConfig = $this.data('enterNoSubmit').config;
			if (oConfig.callback && (typeof oConfig.callback == 'function')) {
				oConfig.callback.apply($this, [oEvent]);
			}
			return (false);
		}
	};
	
	//
	// plugIn init
	//
	/**
	 * initialize jQuery plugIn
	 * 
	 * @param	methos
	 * @returns	jQuery.enterNoSubmit
	 */
	$.fn.enterNoSubmit = function( method ) {
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +	method + ' does not exist on jQuery.enterNoSubmit' );
		}		
		return (this);
		
	};
	
	return ($);

})( jQuery );