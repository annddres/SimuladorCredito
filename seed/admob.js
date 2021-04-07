//plugin: https://github.com/floatinghotpot/cordova-plugin-admob

function initAdmob() {
    initAd();
    // display the banner at startup
    window.plugins.AdMob.createBannerView();
    // display the interstitial at startup
    //window.plugins.AdMob.createInterstitialView();
}

function initAd(){
    try{
    if ( window.plugins && window.plugins.AdMob ) {
    	var ad_units = {
			ios : {
				banner: 'xxx',
				interstitial: 'xxx'
			},
			android : {
				banner: 'xxx',
				interstitial: 'xxx'
			}
    	};
    	var admobid = "";
    	if( /(android)/i.test(navigator.userAgent) ) {
    	    admobid = ad_units.android;
    	} else if(/(iphone|ipad)/i.test(navigator.userAgent)) {
    	    admobid = ad_units.ios;
    	} else {
    	    admobid = ad_units.wp8;
    	}
        window.plugins.AdMob.setOptions( {
            publisherId: admobid.banner,
            interstitialAdId: admobid.interstitial,
            bannerAtTop: false, // set to true, to put banner at top
            overlap: false, // set to true, to allow banner overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });
        registerAdEvents();   
    } else {
        alert( 'admob plugin not ready' );
    }
    }
    catch(err){
        alert(err.message)
    }
}

// optional, in case respond to events
function registerAdEvents() {
    document.addEventListener('onReceiveAd', function(){});
    document.addEventListener('onFailedToReceiveAd', function(data){});
    document.addEventListener('onPresentAd', function(){});
    document.addEventListener('onDismissAd', function(){ });
    document.addEventListener('onLeaveToAd', function(){ });
    document.addEventListener('onReceiveInterstitialAd', function(){ });
    document.addEventListener('onPresentInterstitialAd', function(){ });
    document.addEventListener('onDismissInterstitialAd', function(){ });
}
