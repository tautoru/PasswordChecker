;(function ( $, window, document, undefined ) {

    var pluginName = "PasswordStrengthManager",
    defaults = {
        password: "",
        blackList : [],
        minChars : "",
        maxChars : "",
        advancedStrength : false
    };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();

        this.info = '';
    }

    Plugin.prototype = {
        init: function () {

			
			function switchOffCell(number) {
				var cell = document.getElementById('s' + number);
				cell.className = 'cell';
			}

			function switchOnCell(number) {
				var cell = document.getElementById('s' + number);
				cell.className = 'cell on';
			}
			
			function switchOffAllCells() {
				switchOffCell(0);
				switchOffCell(1);
				switchOffCell(2);
				switchOffCell(3);
				switchOffCell(4);
				switchOffCell(5);
			}
			
			
		    var errors = this.customValidators();
            if('' == this.settings.password){
				
				switchOffAllCells();
                this.info = 'Please type a pass phrase or password';
				
            }

             else if(errors == 0){
                var strength =  '';
                strength = zxcvbn(this.settings.password, this.settings.blackList);
				
				console.log(strength);
				
                switch(strength.score){
                    case 0:
						switchOnCell(0);
						switchOffCell(1);
						switchOffCell(2);
						switchOffCell(3);
						switchOffCell(4);
						switchOffCell(5);
                        this.info = 'Unacceptable password quality';
                        break;
                    case 1:
						switchOnCell(0);
						switchOnCell(1);
						switchOffCell(2);
						switchOffCell(3);
						switchOffCell(4);
						switchOffCell(5);
                        this.info = 'Very weak - password can be cracked in seconds';
                        break;
                    case 2:
						switchOnCell(0);
						switchOnCell(1);
						switchOnCell(2);
						switchOffCell(3);
						switchOffCell(4);
						switchOffCell(5);
                        this.info = 'Weak - password can be cracked in minutes';
                        break;
                    case 3:
						switchOnCell(0);
						switchOnCell(1);
						switchOnCell(2);
						switchOnCell(3);
						switchOffCell(4);
						switchOffCell(5);
                        this.info = 'Compliant - password is adequate but consider making it stronger';
                        break;
                    case 4:

                        if(this.settings.advancedStrength){
                            var crackTime = String(strength.crack_time_display);

                            if (crackTime.indexOf("years") !=-1) {
                                this.info = 'Strong - password would take '+ crackTime +' to crack';
								switchOnCell(0);
								switchOnCell(1);
								switchOnCell(2);
								switchOnCell(3);
								switchOnCell(4);
								switchOffCell(5);
                            }else if(crackTime.indexOf("centuries") !=-1){
                                this.info = 'Very Strong - password would take '+ crackTime +' to crack';
								switchOnCell(0);
								switchOnCell(1);
								switchOnCell(2);
								switchOnCell(3);
								switchOnCell(4);
								switchOnCell(5);
                            }
                        }else{
                        this.info = 'Strong';
                        }
                        break;
                }

            }

            $(this.element).html(this.info);

        },
        minChars: function () {
            if(this.settings.password.length < this.settings.minChars){
                this.info = 'Password should have at least '+ this.settings.minChars  + ' characters';
				switchOffAllCells();
                return false;
            }else{
                return true;
            }
        },
        maxChars: function () {
            if(this.settings.password.length > this.settings.maxChars){
                this.info = 'Password should have maximum of '+ this.settings.maxChars  + ' characters';
				switchOffAllCells();
                return false;
            }else{
                return true;
            }
        },
        customValidators : function () {

            var err = 0;
            if(this.settings.minChars != ''){
                if(!(this.minChars())){
                    err++;
                }
            }

            if(this.settings.maxChars != ''){
                if(!(this.maxChars())){
                    err++;
                }
            }

            return err;
        }

    };

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            //if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            //}
        });
        return this;
    };

})( jQuery, window, document );
