'use strict';

(function (angular) {
    angular
        .module('soundCloudPluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'soundCloudAPI','$rootScope',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, soundCloudAPI,$rootScope) {
                console.log('WidgetHomeCtrl Controller Loaded-------------------------------------');
                var WidgetHome = this, view = null;

                /*declare the device width heights*/
                WidgetHome.deviceHeight = window.innerHeight;
                WidgetHome.deviceWidth = window.innerWidth;

                WidgetHome.SoundCloudInfoContent = new DB(COLLECTIONS.SoundCloudInfo);


                WidgetHome.showDescription = function () {
                    if (WidgetHome.info.data.content.description == '<p>&nbsp;<br></p>' || WidgetHome.info.data.content.description == '<p><br data-mce-bogus="1"></p>')
                        return false;
                    else
                        return true;
                };

                /// load items
                function loadItems(carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    if (view)
                        view.loadItems(carouselItems);
                }

                var initCarousel = function () {

                    if (WidgetHome.info && WidgetHome.info.data.content.images.length) {
                        loadItems(WidgetHome.info.data.content.images);
                    } else {
                        loadItems([]);
                    }

                };

                WidgetHome.SoundCloudInfoContent.get().then(function success(result) {
                        console.log('result-----------------------------------------in Widget', result);
                        if (result && result.data && result.id) {
                            /*result = DEFAULT_DATA.SOUND_CLOUD_INFO;*/
                            WidgetHome.info = result;
                            if (WidgetHome.info.data.content.link && WidgetHome.info.data.content.soundcloudClientID) {
                                soundCloudAPI.getTracks(WidgetHome.info.data.content.link, WidgetHome.info.data.content.soundcloudClientID)
                                    .then(function (data) {
                                        WidgetHome.tracks = data;
                                        console.log('WidgetHome.tracks---------------------', WidgetHome.tracks);
                                    }, function () {

                                    });
                                console.log('WidgetHome.tracks---------------------', WidgetHome.tracks);
                            }
                        }
                        else {
                            WidgetHome.info = DEFAULT_DATA.SOUND_CLOUD_INFO;
                        }
                    },
                    function fail() {
                        WidgetHome.info = DEFAULT_DATA.SOUND_CLOUD_INFO;
                    }
                );

                WidgetHome.goToTrack = function (track) {
                    $rootScope.playTrack=true;
                    WidgetHome.currentTrack=track;
                };

                $scope.$on("Carousel:LOADED", function () {
                    if (!view) {
                        view = new window.buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                    }
                    if (view && WidgetHome.info && WidgetHome.info.data) {
                        initCarousel();
                    }
                    else {
                        view.loadItems([]);
                    }
                });
            }]);
})(window.angular);