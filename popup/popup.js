
	( function () {

		$("#extension_switch").click( function () {
			chrome.storage.local.get( null, function ( items ) {

				// if items.enabled is undefined, it means that it has not been toggled yet
				if ( items.enabled === undefined ) items.enabled = true;

				items.enabled = !items.enabled;

				chrome.storage.local.set({ enabled: items.enabled });
				$("#extension_switch").text( ( items.enabled ? "Radical-6 Vaccine is ON": "Radical-6 Vaccine is OFF" ) );
			
			});
		});

		$("#whitelist_switch").click( function () {
			chrome.tabs.query({ active: true }, function ( tabs ) {
				chrome.storage.local.get( null, function ( items ) {

					//create a new whitelist if there is curently no whitelist
					if ( !items.whitelisted_urls ) items.whitelisted_urls = [];
					
					var index_of_url = items.whitelisted_urls.indexOf( tabs[0].url );
					
					if ( index_of_url === -1 ) {
						items.whitelisted_urls.push( tabs[0].url );
					} else {
						items.whitelisted_urls.splice( index_of_url, 1 );
					}

					chrome.storage.local.set({ whitelisted_urls: items.whitelisted_urls });
					$("#whitelist_switch").text( ( ( index_of_url === -1 ) ? "Remove this page from whitelist": "Add this page to whitelist" ) );

				});
			});
		});

			chrome.storage.local.get( null, function ( items ) {

				// if items.enabled is undefined, it means that it has not been toggled yet
				if ( items.enabled === undefined ) items.enabled = true;

				chrome.storage.local.set({ enabled: items.enabled });
				$("#extension_switch").text( ( items.enabled ? "Radical-6 Vaccine is ON": "Radical-6 Vaccine is OFF" ) );
			
			});


			chrome.tabs.query({ active: true }, function ( tabs ) {
				chrome.storage.local.get( null, function ( items ) {

					//create a new whitelist if there is curently no whitelist
					if ( !items.whitelisted_urls ) items.whitelisted_urls = [];
					
					var index_of_url = items.whitelisted_urls.indexOf( tabs[0].url );

					chrome.storage.local.set({ whitelisted_urls: items.whitelisted_urls });
					$("#whitelist_switch").text( ( ( index_of_url > -1 ) ? "Remove this page from whitelist": "Add this page to whitelist" ) );

				});
			});
		

	} () )