// Native Javascript for Bootstrap 3 | Button
// by dnp_theme

(function(factory){

	// CommonJS/RequireJS and "native" compatibility
	if(typeof module !== "undefined" && typeof exports == "object") {
		// A commonJS/RequireJS environment
		if(typeof window != "undefined") {
			// Window and document exist, so return the factory's return value.
			module.exports = factory();
		} else {
			// Let the user give the factory a Window and Document.
			module.exports = factory;
		}
	} else {
		// Assume a traditional browser.
		window.Button = factory();
	}

})(function(){

	// BUTTON DEFINITION
	// ===================
	var Button = function( element, option ) {
		this.btn = typeof element === 'object' ? element : document.querySelector(element);
		this.option = typeof option === 'string' ? option : null;

		this.init();
	};

	// BUTTON METHODS
	// ================
	Button.prototype = {

		init : function() {
			var self = this;
			this.actions();

			if ( /btn/.test(this.btn.className) ) {
				if ( this.option && this.option !== 'reset' ) {

					this.state = this.btn.getAttribute('data-'+this.option+'-text') || null;

					!this.btn.getAttribute('data-original-text') && this.btn.setAttribute('data-original-text',self.btn.innerHTML.replace(/^\s+|\s+$/g, ''));
					this.setState();

				} else if ( this.option === 'reset' ) {
					this.reset();
				}
			}

			if ( /btn-group/.test(this.btn.className) ) {
				this.btn.addEventListener('click', this.toggle, false);
			}
		},

		actions : function() {
			var self = this;
			// The built in event that will be triggered on demand
			var changeEvent;
			if ( Event !== undefined && typeof Event === 'function' && typeof Event !== 'object' ) {
				changeEvent = new Event('change');
			} else { // define event type, new Event('type') does not work in any IE
				changeEvent = document.createEvent('HTMLEvents');
				changeEvent.initEvent('change', true, true);
			}

			// assign event to a trigger function
			function triggerChange(t) { t.dispatchEvent(changeEvent) }

			this.setState = function() {
				if ( this.option === 'loading' ) {
					this.addClass(this.btn,'disabled');					
					this.btn.setAttribute('disabled','disabled');
				}
				this.btn.innerHTML = this.state;
			},

			this.reset = function() {
				if ( /disabled/.test(self.btn.className) || self.btn.getAttribute('disabled') === 'disabled' ) {
					this.removeClass(this.btn,'disabled');	
					self.btn.removeAttribute('disabled');
				}
				self.btn.innerHTML = self.btn.getAttribute('data-original-text');
			},

			this.toggle = function(e) {
				var parent = e.target.parentNode,
					label = e.target.tagName === 'LABEL' ? e.target : parent.tagName === 'LABEL' ? parent : null; // the .btn label
				
				if ( !label ) return; //react if a label or its immediate child is clicked
				
				var target = this, //e.currentTarget || e.srcElement; // the button group, the target of the Button function
					labels = target.querySelectorAll('.btn'), ll = labels.length, i = 0, // all the button group buttons
					input = label.getElementsByTagName('INPUT')[0];
					
				if ( !input ) return; //return if no input found

				//manage the dom manipulation
				if ( input.type === 'checkbox' ) { //checkboxes
					if ( !input.checked || !input.getAttribute('checked'))  {
						self.addClass(label,'active');
						input.setAttribute('checked','checked');
					} else {
						self.removeClass(label,'active');
						input.removeAttribute('checked');
					}
					triggerChange(input); //trigger the change for the input
					triggerChange(self.btn) //trigger the change for the btn-group
				}

				if ( input.type === 'radio' ){ // radio buttons

					if ( !input.checked || !input.getAttribute('checked') ) { // don't trigger if already active
						self.addClass(label,'active');
						input.setAttribute('checked','checked');

						triggerChange(input); //trigger the change
						triggerChange(self.btn);

						for (i;i<ll;i++) {
							var l = labels[i];
							if ( l !== label && /active/.test(l.className) )  {
								var inp = l.getElementsByTagName('INPUT')[0];
								self.removeClass(l,'active');
								inp.removeAttribute('checked');				
								triggerChange(inp)	//trigger the change
							}				
						}
					}
				}
			},
			this.addClass = function(el,c) { // where modern browsers fail, use classList	
				if (el.classList) { el.classList.add(c); } else { el.className += ' '+c; }
			},
			this.removeClass = function(el,c) {
				if (el.classList) { el.classList.remove(c); } else { el.className = el.className.replace(c,'').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,''); }
			}
		}
    }

	// BUTTON DATA API
	// =================
    var Buttons = document.querySelectorAll('[data-toggle=button]'), i = 0, btl = Buttons.length;
	for (i;i<btl;i++) {
		new Button(Buttons[i]);
	}
	
    var ButtonGroups = document.querySelectorAll('[data-toggle=buttons]'), j = 0, bgl = ButtonGroups.length;
	for (j;j<bgl;j++) {
		new Button(ButtonGroups[j]);
	}

	return Button;

});