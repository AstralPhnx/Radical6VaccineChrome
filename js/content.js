
	( function main () {
		
		function EventHub ( hub_name ) {
			
			var private = {
				
				events: {},
		
				add_one: function ( name, observer ) {
				
					if ( typeof private.events[ name ] === 'undefined' ) {
					
						private.events[ name ] = [];

					}
					
					private.events[ name ].push( observer );
				
				},
				
				remove: function ( name ) {

					private.events[ name ] = undefined;

				}
			
			};
		
			var public =  {
		
				add: function ( observers ) {
			
					Object.keys( observers ).forEach( function ( name ) {

						private.add_one( name, observers[ name ] );

					});
				
				},
				
				fire: function ( name, data ) {
					
					if ( typeof private.events[ name ] !== 'undefined' ) {
						
						private.events[ name ].forEach( function ( observer ) {
						
							observer( data );
						
						});
					
					};
					
				},

				stop: function () {

					public.fire = function () {}

				}
				
			};

			return public;
			
		};
		
		function Scanner () {

			var public = {

				get_matches_amount: function ( text, phrases ) {
					
					var matches_amount = 0;
					text = text.toLowerCase();

					phrases.forEach( function ( phrase ) {
						if ( text.indexOf( phrase ) > -1 ) matches_amount++
					});

					return matches_amount;

				}
				
			};

			return public;

		};

		function Overlay ( document, event_hub ) {

			var private = {

				element: null

			};

			var public = {

				add: function ( warning_message ) {

					private.element = document.createElement( "div" );
					private.element.id = "spoilers_blocker_overlay";

					private.element.innerHTML = 
						"<div>"+
							"<div id = 'spoiler_blocker_header' >possible spoiler alert!</div>"+
							"<div id = 'spoiler_blocker_warning_message' >"+warning_message+"</div>"+
							"<div class = 'spoilers_blocker_overlay_button' id = 'spoilers_blocker_continue_button' >Continue anyway</div>"+
							"<div class = 'spoilers_blocker_overlay_button' id = 'spoilers_blocker_dont_block_button' >Don't block this page in the future</div>"+
						"</div>";

					document.body.appendChild( private.element );

					private.element.querySelector("#spoilers_blocker_continue_button").addEventListener( "click", function () {
						event_hub.fire( "continue_button_click" );
					});

					private.element.querySelector("#spoilers_blocker_dont_block_button").addEventListener( "click", function () {
						event_hub.fire( "dont_block_button_click" );
					});

				},

				hide: function () {

					private.element.parentElement.removeChild( private.element );

				}
				
			};

			return public;

		};
		
		function Controller ( scanner, overlay, event_hub, storage, banned_phrases, instant_spoiler_phrases, warning_messages ) {

			event_hub.add({

				"continue_button_click": function () {
					overlay.hide();
				},

				"dont_block_button_click": function () {

					storage.local.get( null, function ( items ) {

						if ( !items[ "whitelisted_urls" ] ) items[ "whitelisted_urls" ] = [];
						
						items[ "whitelisted_urls" ].push( window.location.href );

						storage.local.set({ "whitelisted_urls": items[ "whitelisted_urls" ] });

						overlay.hide();

					});

				}

			});

			( function constructor () {

				storage.local.get( null, function ( items ) {

					var banned_phrases_amount = scanner.get_matches_amount( window.document.body.innerText, banned_phrases );
					var instant_spoiler_phrases_amount = scanner.get_matches_amount( window.document.body.innerText, instant_spoiler_phrases );

					if (
						banned_phrases_amount >= 4
						|| ( instant_spoiler_phrases_amount >= 1 && banned_phrases_amount >= 1 )
					) {
						if ( !items[ "whitelisted_urls" ] || items[ "whitelisted_urls" ].indexOf( window.location.href ) === -1 ) {
							if ( items.enabled || items.enabled === undefined ) {
								overlay.add( warning_messages[ Math.floor( Math.random() * warning_messages.length ) ] );
							}
						}
					}

				});

			} () )

		};

		( function constructor () {

			var event_hub = new EventHub();

			var warning_messages = [
				"Apologise to the Funyarinpa!"
			];

			var spoiler_phrases = [
				"ztd",
                                "zero time dilemma",
                                "zero escape",
                                "zero escape 3",
                                "ze3",
                                "junpei",
                                "sigma",
                                "phi",
                                "akane",
                                "q",
                                "carlos",
                                "diana",
                                "mira",
                                "eric",
                                "zero",
                                "brother",
                                "decision game",
                                "radical-6",
                                "c",
                                "d"
			];

			var instant_spoiler_phrases = [
				"potential spoilers",
				"zero time dilemma spoiler",
				"zero time dilemma spoilers",
                                "ztd spoiler",
                                "ztd spoilers",
				"spoiler alert",
				"spoiler ahead",
				"spoilers ahead",
				"#spoiler"
			];

			new Controller(
				new Scanner(),
				new Overlay( document, event_hub ),
				event_hub,
				chrome.storage,
				spoiler_phrases,
				instant_spoiler_phrases,
				warning_messages
			)

		} () )

	} () )

