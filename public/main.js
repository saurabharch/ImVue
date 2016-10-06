'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
});

// This app.run is for listening to errors broadcasted by ui-router, usually originating from resolves
app.run(function ($rootScope) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, thrownError) {
        console.info('The following error was thrown by ui-router while transitioning to state "' + toState.name + '". The origin of this error is probably a resolve function:');
        console.error(thrownError);
    });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });
});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });
});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);
});

app.controller('CameraCtrl', function ($scope, CameraFactory) {

    CameraFactory.streamCamera();
});
app.factory('CameraFactory', function ($log) {

    function streamCamera() {

        var video = document.querySelector("#videoElement");

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: {
                    frameRate: {
                        ideal: 5,
                        max: 10
                    }
                }
            }, handleVideo, videoError);
        }

        function handleVideo(stream) {
            video.src = window.URL.createObjectURL(stream);
        }

        function videoError(e) {
            console.log("Throwing error");
            // do something
        }
    }

    // Factory service object to return

    return {
        streamCamera: streamCamera
    };
});
app.config(function ($stateProvider) {
    $stateProvider.state('docs', {
        url: '/docs',
        templateUrl: 'js/docs/docs.html'
    });
});

(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.

    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function responseError(response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptor');
        }]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        function onSuccessfulLogin(response) {
            var user = response.data.user;
            Session.create(user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return user;
        }

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.getLoggedInUser = function (fromServer) {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.

            // Optionally, if true is given as the fromServer parameter,
            // then this cached value will not be used.

            if (this.isAuthenticated() && fromServer !== true) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });
        };

        this.login = function (credentials) {
            return $http.post('/login', credentials).then(onSuccessfulLogin).catch(function () {
                return $q.reject({ message: 'Invalid login credentials.' });
            });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.user = null;

        this.create = function (user) {
            this.user = user;
        };

        this.destroy = function () {
            this.user = null;
        };
    });
})();

app.controller('geoLocationCtrl', function ($scope, $log, geoLocationFactory) {

    $scope.update = function () {
        console.log("calling update");
        navigator.geolocation.getCurrentPosition(function (position) {
            $scope.pos = position.coords;
            $scope.$evalAsync();
        });

        // $scope.pos = geoLocationFactory.updateLocation().coords
        // .then(function(position){
        // 	$scope.pos = position.coords;
        // })
        //    .catch($log)

        //    geoLocationFactory.updateOrientation()
        // .then(function(heading){
        //        // trueHeading doesn't work for iphone
        //        // reading about android it just returns magnetic for true
        // 	$scope.heading = heading.magneticHeading;
        // })
        // .catch($log)

    };
});

app.factory('geoLocationFactory', function ($http, $log) {

    // var posOptions = {timeout: 10000, enableHighAccuracy: true};
    // var posOptions = {enableHighAccuracy: true};
    var watchOptions = { timeout: 500, enableHighAccuracy: true };
    var geoLocationPos;

    var geoLocationFactory = {};

    geoLocationFactory.updateLocation = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            return geoLocationPos = position;
        });
        return geoLocationPos;
    };
    // geoLocationFactory.updateOrientation = () => {
    //     return $cordovaDeviceOrientation.getCurrentHeading()
    //         .then( heading => heading )
    //         .catch($log)
    // }

    return geoLocationFactory;
});
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html'
    });
});

app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });
    };
});

app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        template: '<img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />',
        controller: function controller($scope, SecretStash) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
            });
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });
});

app.factory('SecretStash', function ($http) {

    var getStash = function getStash() {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };
});

app.controller('SketchCtrl', function ($scope, SketchFactory) {

    SketchFactory.initialize(window, document);

    $scope.savePng = function () {
        SketchFactory.saveImg();
    };

    $scope.loadPng = function () {
        SketchFactory.loadImg();
    };
});
app.factory('SketchFactory', function ($http, $log, geoLocationFactory) {

    var SketchFactory = {};

    var workspace;
    var doc;

    var canvas;
    var ctx;
    var color;
    var colorElements;
    var canvasPoints = [];

    var currentMousePosition = { x: 0, y: 0 };
    var lastMousePosition = { x: 0, y: 0 };

    var drawing = false;

    /* ---------------- SKETCH FACTORY ACCESSABLE FUNCTIONS ---------------- */

    SketchFactory.initialize = function (init_workspace, init_doc) {
        workspace = init_workspace;
        doc = init_doc;

        initializeCanvas();
        initializeColorElements();
    };

    SketchFactory.saveImg = function () {
        // Clearn the canvas to show the user a response
        // Could change this later to display a button that says saved \
        // and they can click it to acknowledge?
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var canvasPointsString = canvasPoints.join(",");

        geoLocationFactory.updateLocation().then(function (position) {
            $http.post('http://192.168.5.251:1337/api/drawings', { image: canvasPointsString, longitude: position.coords.longitude, latitude: position.coords.latitude });
        }).then(function (response) {
            // Dont care about the response here
            // Our log below will let us know if something didn't go correctly 
            // Leaving this here for now in case we want to do something later
        }).catch($log);
    }; /* End of saveImg Function */

    SketchFactory.loadImg = function () {

        var drawing = doc.getElementById('paint');

        $http.get('http://192.168.5.251:1337/api/drawings/21').then(function (response) {
            return response.data.image;
        }).then(function (canvasString) {

            var canvasArray = canvasString.split(",");
            for (var i = 0; i < canvasArray.length; i += 5) {

                canvas.draw( /* Start Point */
                { x: canvasArray[i],
                    y: canvasArray[i + 1]
                },
                /* End Point */
                {
                    x: canvasArray[i + 2],
                    y: canvasArray[i + 3]
                },
                /* Color */
                canvasArray[i + 4]);
            }
        }).catch($log);
    }; /* End of load image function */

    /* ---------------- SKETCH FACTORY HELPER FUNCTIONS ---------------- */

    /* -------------------- CANVAS FUNCTIONS -------------------- */

    function initializeCanvas() {

        canvas = doc.getElementById('paint');
        ctx = canvas.getContext('2d');

        resizeCanvas();
        workspace.addEventListener('resize', resizeCanvas);

        // Touch screen event handlers
        canvas.addEventListener('touchstart', mDown);
        canvas.addEventListener('touchend', mUp);
        canvas.addEventListener('touchmove', mMove);

        // Keyboard event handlers
        //canvas.addEventListener('mousedown', mDown);
        //canvas.addEventListener('mouseup', mUp);
        //canvas.addEventListener('mousemove', mMove);

        canvas.draw = function (start, end, strokeColor) {
            ctx.beginPath();
            ctx.strokeStyle = strokeColor || 'black';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.closePath();
        };
    }

    function resizeCanvas() {
        // Unscale the canvas (if it was previously scaled)
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // The device pixel ratio is the multiplier between CSS pixels
        // and device pixels
        var pixelRatio = workspace.devicePixelRatio || 1;

        // Allocate backing store large enough to give us a 1:1 device pixel
        // to canvas pixel ratio.
        var w = canvas.clientWidth * pixelRatio,
            h = canvas.clientHeight * pixelRatio;
        if (w !== canvas.width || h !== canvas.height) {
            // Resizing the canvas destroys the current content.
            // So, save it...
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            canvas.width = w;canvas.height = h;

            // ...then restore it.
            ctx.putImageData(imgData, 0, 0);
        }

        // Scale the canvas' internal coordinate system by the device pixel
        // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
        // backing store is larger.
        ctx.scale(pixelRatio, pixelRatio);

        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    // Event functions for canvas

    function mDown(e) {
        e.preventDefault();

        drawing = true;
        currentMousePosition.x = e.changedTouches[0].pageX - this.offsetLeft;
        currentMousePosition.y = e.changedTouches[0].pageY - this.offsetTop;
    }

    function mUp() {
        drawing = false;
    }

    function mMove(e) {
        e.preventDefault();

        if (!drawing) return;

        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;

        currentMousePosition.x = e.changedTouches[0].pageX - this.offsetLeft;
        currentMousePosition.y = e.changedTouches[0].pageY - this.offsetTop;

        // Push our points into an array
        canvasPoints.push(lastMousePosition.x + "," + lastMousePosition.y + "," + currentMousePosition.x + "," + currentMousePosition.y + "," + color);

        canvas.draw(lastMousePosition, currentMousePosition, color);
    }

    /* -------------------- COLOR ELEMENT FUNCTIONS -------------------- */

    function initializeColorElements() {

        colorElements = [].slice.call(doc.querySelectorAll('.marker'));

        colorElements.forEach(function (el) {

            // Set the background color of this element
            // to its id (purple, red, blue, etc).
            el.style.backgroundColor = el.id;

            // Attach a click handler that will set our color variable to
            // the elements id, remove the selected class from all colors,
            // and then add the selected class to the clicked color.
            function pickColor() {
                color = this.id;
                doc.querySelector('.selected').classList.remove('selected');
                this.classList.add('selected');
            }

            el.addEventListener('click', pickColor);
            el.addEventListener('tap', pickColor);
        });
    }

    return SketchFactory;
});
app.factory('FullstackPics', function () {
    return ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large', 'https://pbs.twimg.com/media/CE-T75lWAAAmqqJ.jpg:large', 'https://pbs.twimg.com/media/CEvZAg-VAAAk932.jpg:large', 'https://pbs.twimg.com/media/CEgNMeOXIAIfDhK.jpg:large', 'https://pbs.twimg.com/media/CEQyIDNWgAAu60B.jpg:large', 'https://pbs.twimg.com/media/CCF3T5QW8AE2lGJ.jpg:large', 'https://pbs.twimg.com/media/CAeVw5SWoAAALsj.jpg:large', 'https://pbs.twimg.com/media/CAaJIP7UkAAlIGs.jpg:large', 'https://pbs.twimg.com/media/CAQOw9lWEAAY9Fl.jpg:large', 'https://pbs.twimg.com/media/B-OQbVrCMAANwIM.jpg:large', 'https://pbs.twimg.com/media/B9b_erwCYAAwRcJ.png:large', 'https://pbs.twimg.com/media/B5PTdvnCcAEAl4x.jpg:large', 'https://pbs.twimg.com/media/B4qwC0iCYAAlPGh.jpg:large', 'https://pbs.twimg.com/media/B2b33vRIUAA9o1D.jpg:large', 'https://pbs.twimg.com/media/BwpIwr1IUAAvO2_.jpg:large', 'https://pbs.twimg.com/media/BsSseANCYAEOhLw.jpg:large', 'https://pbs.twimg.com/media/CJ4vLfuUwAAda4L.jpg:large', 'https://pbs.twimg.com/media/CI7wzjEVEAAOPpS.jpg:large', 'https://pbs.twimg.com/media/CIdHvT2UsAAnnHV.jpg:large', 'https://pbs.twimg.com/media/CGCiP_YWYAAo75V.jpg:large', 'https://pbs.twimg.com/media/CIS4JPIWIAI37qu.jpg:large'];
});

app.factory('RandomGreetings', function () {

    var getRandomFromArray = function getRandomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.', 'こんにちは、ユーザー様。', 'Welcome. To. WEBSITE.', ':D', 'Yes, I think we\'ve met before.', 'Gimme 3 mins... I just grabbed this really dope frittata', 'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!'];

    return {
        greetings: greetings,
        getRandomGreeting: function getRandomGreeting() {
            return getRandomFromArray(greetings);
        }
    };
});

app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function link(scope) {

            scope.items = [{ label: 'Home', state: 'home' }, { label: 'About', state: 'about' }, { label: 'Documentation', state: 'docs' }, { label: 'Members Only', state: 'membersOnly', auth: true }];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                    $state.go('home');
                });
            };

            var setUser = function setUser() {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function removeUser() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
        }

    };
});

app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});

app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function link(scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiY2FtZXJhL2NhbWVyYS5jb250cm9sbGVyLmpzIiwiY2FtZXJhL2NhbWVyYS5mYWN0b3J5LmpzIiwiZG9jcy9kb2NzLmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJnZW9Mb2NhdGlvbi9nZW8ubG9jYXRpb24uY29udHJvbGxlci5qcyIsImdlb0xvY2F0aW9uL2dlby5sb2NhdGlvbi5mYWN0b3J5LmpzIiwiaG9tZS9ob21lLmpzIiwibG9naW4vbG9naW4uanMiLCJtZW1iZXJzLW9ubHkvbWVtYmVycy1vbmx5LmpzIiwic2tldGNoL3NrZXRjaC5jb250cm9sbGVyLmpzIiwic2tldGNoL3NrZXRjaC5mYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9GdWxsc3RhY2tQaWNzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJhcHAiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIiwiJHVybFJvdXRlclByb3ZpZGVyIiwiJGxvY2F0aW9uUHJvdmlkZXIiLCJodG1sNU1vZGUiLCJvdGhlcndpc2UiLCJ3aGVuIiwibG9jYXRpb24iLCJyZWxvYWQiLCJydW4iLCIkcm9vdFNjb3BlIiwiJG9uIiwiZXZlbnQiLCJ0b1N0YXRlIiwidG9QYXJhbXMiLCJmcm9tU3RhdGUiLCJmcm9tUGFyYW1zIiwidGhyb3duRXJyb3IiLCJjb25zb2xlIiwiaW5mbyIsIm5hbWUiLCJlcnJvciIsIkF1dGhTZXJ2aWNlIiwiJHN0YXRlIiwiZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCIsInN0YXRlIiwiZGF0YSIsImF1dGhlbnRpY2F0ZSIsImlzQXV0aGVudGljYXRlZCIsInByZXZlbnREZWZhdWx0IiwiZ2V0TG9nZ2VkSW5Vc2VyIiwidGhlbiIsInVzZXIiLCJnbyIsIiRzdGF0ZVByb3ZpZGVyIiwidXJsIiwiY29udHJvbGxlciIsInRlbXBsYXRlVXJsIiwiJHNjb3BlIiwiRnVsbHN0YWNrUGljcyIsImltYWdlcyIsIl8iLCJzaHVmZmxlIiwiQ2FtZXJhRmFjdG9yeSIsInN0cmVhbUNhbWVyYSIsImZhY3RvcnkiLCIkbG9nIiwidmlkZW8iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJuYXZpZ2F0b3IiLCJnZXRVc2VyTWVkaWEiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIm9HZXRVc2VyTWVkaWEiLCJmcmFtZVJhdGUiLCJpZGVhbCIsIm1heCIsImhhbmRsZVZpZGVvIiwidmlkZW9FcnJvciIsInN0cmVhbSIsInNyYyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImUiLCJsb2ciLCJFcnJvciIsImlvIiwib3JpZ2luIiwiY29uc3RhbnQiLCJsb2dpblN1Y2Nlc3MiLCJsb2dpbkZhaWxlZCIsImxvZ291dFN1Y2Nlc3MiLCJzZXNzaW9uVGltZW91dCIsIm5vdEF1dGhlbnRpY2F0ZWQiLCJub3RBdXRob3JpemVkIiwiJHEiLCJBVVRIX0VWRU5UUyIsInN0YXR1c0RpY3QiLCJyZXNwb25zZUVycm9yIiwicmVzcG9uc2UiLCIkYnJvYWRjYXN0Iiwic3RhdHVzIiwicmVqZWN0IiwiJGh0dHBQcm92aWRlciIsImludGVyY2VwdG9ycyIsInB1c2giLCIkaW5qZWN0b3IiLCJnZXQiLCJzZXJ2aWNlIiwiJGh0dHAiLCJTZXNzaW9uIiwib25TdWNjZXNzZnVsTG9naW4iLCJjcmVhdGUiLCJmcm9tU2VydmVyIiwiY2F0Y2giLCJsb2dpbiIsImNyZWRlbnRpYWxzIiwicG9zdCIsIm1lc3NhZ2UiLCJsb2dvdXQiLCJkZXN0cm95Iiwic2VsZiIsImdlb0xvY2F0aW9uRmFjdG9yeSIsInVwZGF0ZSIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCIkZXZhbEFzeW5jIiwid2F0Y2hPcHRpb25zIiwidGltZW91dCIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsImdlb0xvY2F0aW9uUG9zIiwidXBkYXRlTG9jYXRpb24iLCJzZW5kTG9naW4iLCJsb2dpbkluZm8iLCJ0ZW1wbGF0ZSIsIlNlY3JldFN0YXNoIiwiZ2V0U3Rhc2giLCJzdGFzaCIsIlNrZXRjaEZhY3RvcnkiLCJpbml0aWFsaXplIiwic2F2ZVBuZyIsInNhdmVJbWciLCJsb2FkUG5nIiwibG9hZEltZyIsIndvcmtzcGFjZSIsImRvYyIsImNhbnZhcyIsImN0eCIsImNvbG9yIiwiY29sb3JFbGVtZW50cyIsImNhbnZhc1BvaW50cyIsImN1cnJlbnRNb3VzZVBvc2l0aW9uIiwieCIsInkiLCJsYXN0TW91c2VQb3NpdGlvbiIsImRyYXdpbmciLCJpbml0X3dvcmtzcGFjZSIsImluaXRfZG9jIiwiaW5pdGlhbGl6ZUNhbnZhcyIsImluaXRpYWxpemVDb2xvckVsZW1lbnRzIiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJjYW52YXNQb2ludHNTdHJpbmciLCJqb2luIiwiaW1hZ2UiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImdldEVsZW1lbnRCeUlkIiwiY2FudmFzU3RyaW5nIiwiY2FudmFzQXJyYXkiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJkcmF3IiwiZ2V0Q29udGV4dCIsInJlc2l6ZUNhbnZhcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtRG93biIsIm1VcCIsIm1Nb3ZlIiwic3RhcnQiLCJlbmQiLCJzdHJva2VDb2xvciIsImJlZ2luUGF0aCIsInN0cm9rZVN0eWxlIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlIiwiY2xvc2VQYXRoIiwic2V0VHJhbnNmb3JtIiwicGl4ZWxSYXRpbyIsImRldmljZVBpeGVsUmF0aW8iLCJ3IiwiY2xpZW50V2lkdGgiLCJoIiwiY2xpZW50SGVpZ2h0IiwiaW1nRGF0YSIsImdldEltYWdlRGF0YSIsInB1dEltYWdlRGF0YSIsInNjYWxlIiwibGluZVdpZHRoIiwibGluZUpvaW4iLCJsaW5lQ2FwIiwiY2hhbmdlZFRvdWNoZXMiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwYWdlWSIsIm9mZnNldFRvcCIsInNsaWNlIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWwiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImlkIiwicGlja0NvbG9yIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwiZ2V0UmFuZG9tRnJvbUFycmF5IiwiYXJyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZ3JlZXRpbmdzIiwiZ2V0UmFuZG9tR3JlZXRpbmciLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwibGluayIsIml0ZW1zIiwibGFiZWwiLCJhdXRoIiwiaXNMb2dnZWRJbiIsInNldFVzZXIiLCJyZW1vdmVVc2VyIiwiUmFuZG9tR3JlZXRpbmdzIiwiZ3JlZXRpbmciXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBQSxPQUFBQyxHQUFBLEdBQUFDLFFBQUFDLE1BQUEsQ0FBQSx1QkFBQSxFQUFBLENBQUEsYUFBQSxFQUFBLFdBQUEsRUFBQSxjQUFBLEVBQUEsV0FBQSxDQUFBLENBQUE7O0FBRUFGLElBQUFHLE1BQUEsQ0FBQSxVQUFBQyxrQkFBQSxFQUFBQyxpQkFBQSxFQUFBO0FBQ0E7QUFDQUEsc0JBQUFDLFNBQUEsQ0FBQSxJQUFBO0FBQ0E7QUFDQUYsdUJBQUFHLFNBQUEsQ0FBQSxHQUFBO0FBQ0E7QUFDQUgsdUJBQUFJLElBQUEsQ0FBQSxpQkFBQSxFQUFBLFlBQUE7QUFDQVQsZUFBQVUsUUFBQSxDQUFBQyxNQUFBO0FBQ0EsS0FGQTtBQUdBLENBVEE7O0FBV0E7QUFDQVYsSUFBQVcsR0FBQSxDQUFBLFVBQUFDLFVBQUEsRUFBQTtBQUNBQSxlQUFBQyxHQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFB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QUFDQVQsa0JBQUEsR0FEQTtBQUVBakwscUJBQUEseURBRkE7QUFHQW1MLGNBQUEsY0FBQUQsS0FBQSxFQUFBO0FBQ0FBLGtCQUFBUyxRQUFBLEdBQUFELGdCQUFBWCxpQkFBQSxFQUFBO0FBQ0E7QUFMQSxLQUFBO0FBUUEsQ0FWQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ2ZzYVByZUJ1aWx0JywgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJ10pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgLy8gVHJpZ2dlciBwYWdlIHJlZnJlc2ggd2hlbiBhY2Nlc3NpbmcgYW4gT0F1dGggcm91dGVcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbignL2F1dGgvOnByb3ZpZGVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG59KTtcblxuLy8gVGhpcyBhcHAucnVuIGlzIGZvciBsaXN0ZW5pbmcgdG8gZXJyb3JzIGJyb2FkY2FzdGVkIGJ5IHVpLXJvdXRlciwgdXN1YWxseSBvcmlnaW5hdGluZyBmcm9tIHJlc29sdmVzXG5hcHAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCB0aHJvd25FcnJvcikge1xuICAgICAgICBjb25zb2xlLmluZm8oYFRoZSBmb2xsb3dpbmcgZXJyb3Igd2FzIHRocm93biBieSB1aS1yb3V0ZXIgd2hpbGUgdHJhbnNpdGlvbmluZyB0byBzdGF0ZSBcIiR7dG9TdGF0ZS5uYW1lfVwiLiBUaGUgb3JpZ2luIG9mIHRoaXMgZXJyb3IgaXMgcHJvYmFibHkgYSByZXNvbHZlIGZ1bmN0aW9uOmApO1xuICAgICAgICBjb25zb2xlLmVycm9yKHRocm93bkVycm9yKTtcbiAgICB9KTtcbn0pO1xuXG4vLyBUaGlzIGFwcC5ydW4gaXMgZm9yIGNvbnRyb2xsaW5nIGFjY2VzcyB0byBzcGVjaWZpYyBzdGF0ZXMuXG5hcHAucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAvLyBUaGUgZ2l2ZW4gc3RhdGUgcmVxdWlyZXMgYW4gYXV0aGVudGljYXRlZCB1c2VyLlxuICAgIHZhciBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG5cbiAgICAvLyAkc3RhdGVDaGFuZ2VTdGFydCBpcyBhbiBldmVudCBmaXJlZFxuICAgIC8vIHdoZW5ldmVyIHRoZSBwcm9jZXNzIG9mIGNoYW5naW5nIGEgc3RhdGUgYmVnaW5zLlxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbmNlbCBuYXZpZ2F0aW5nIHRvIG5ldyBzdGF0ZS5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHVzZXIgaXMgcmV0cmlldmVkLCB0aGVuIHJlbmF2aWdhdGUgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAvLyAodGhlIHNlY29uZCB0aW1lLCBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSB3aWxsIHdvcmspXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIGlmIG5vIHVzZXIgaXMgbG9nZ2VkIGluLCBnbyB0byBcImxvZ2luXCIgc3RhdGUuXG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyh0b1N0YXRlLm5hbWUsIHRvUGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dENvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Fib3V0L2Fib3V0Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgRnVsbHN0YWNrUGljcykge1xuXG4gICAgLy8gSW1hZ2VzIG9mIGJlYXV0aWZ1bCBGdWxsc3RhY2sgcGVvcGxlLlxuICAgICRzY29wZS5pbWFnZXMgPSBfLnNodWZmbGUoRnVsbHN0YWNrUGljcyk7XG5cbn0pO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ0NhbWVyYUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENhbWVyYUZhY3RvcnkpIHtcblx0XG5cdENhbWVyYUZhY3Rvcnkuc3RyZWFtQ2FtZXJhKClcblxufSk7IiwiYXBwLmZhY3RvcnkoJ0NhbWVyYUZhY3RvcnknLCBmdW5jdGlvbiAoJGxvZykge1xuXG5cdGZ1bmN0aW9uIHN0cmVhbUNhbWVyYSgpIHtcbiAgICBcblx0XHRcdHZhciB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdmlkZW9FbGVtZW50XCIpO1xuICAgICAgXG5cdFx0XHRuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID1cblx0XHRcdFx0bmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fFxuXHRcdFx0XHRuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8XG5cdFx0XHRcdG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHxcblx0XHRcdFx0bmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhIHx8XG5cdFx0XHRcdG5hdmlnYXRvci5vR2V0VXNlck1lZGlhO1xuXG5cdFx0XHRpZiAobmF2aWdhdG9yLmdldFVzZXJNZWRpYSkge1xuXHRcdFx0XHRuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKHtcblx0XHRcdFx0XHR2aWRlbzoge1xuXHRcdFx0XHRcdFx0ZnJhbWVSYXRlOiB7XG5cdFx0XHRcdFx0XHRcdGlkZWFsOiA1LFxuXHRcdFx0XHRcdFx0XHRtYXg6IDEwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBoYW5kbGVWaWRlbywgdmlkZW9FcnJvcik7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGhhbmRsZVZpZGVvKHN0cmVhbSkge1xuXHRcdFx0XHR2aWRlby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiB2aWRlb0Vycm9yKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUaHJvd2luZyBlcnJvclwiKVxuXHRcdFx0XHQvLyBkbyBzb21ldGhpbmdcblx0XHRcdH1cblxuXHR9XG5cblx0Ly8gRmFjdG9yeSBzZXJ2aWNlIG9iamVjdCB0byByZXR1cm5cblxuXHRyZXR1cm4ge1xuXHRcdHN0cmVhbUNhbWVyYTogc3RyZWFtQ2FtZXJhLFxuXHR9XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2RvY3MnLCB7XG4gICAgICAgIHVybDogJy9kb2NzJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9kb2NzL2RvY3MuaHRtbCdcbiAgICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ1NvY2tldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgICB9KTtcblxuICAgIC8vIEFVVEhfRVZFTlRTIGlzIHVzZWQgdGhyb3VnaG91dCBvdXIgYXBwIHRvXG4gICAgLy8gYnJvYWRjYXN0IGFuZCBsaXN0ZW4gZnJvbSBhbmQgdG8gdGhlICRyb290U2NvcGVcbiAgICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUodXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKGZyb21TZXJ2ZXIpIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIGV4aXN0cywgd2VcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAgIC8vIGFsd2F5cyBpbnRlcmZhY2Ugd2l0aCB0aGlzIG1ldGhvZCBhc3luY2hyb25vdXNseS5cblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgaWYgdHJ1ZSBpcyBnaXZlbiBhcyB0aGUgZnJvbVNlcnZlciBwYXJhbWV0ZXIsXG4gICAgICAgICAgICAvLyB0aGVuIHRoaXMgY2FjaGVkIHZhbHVlIHdpbGwgbm90IGJlIHVzZWQuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpICYmIGZyb21TZXJ2ZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoeyBtZXNzYWdlOiAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KCkpO1xuIiwiYXBwLmNvbnRyb2xsZXIoJ2dlb0xvY2F0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvZywgZ2VvTG9jYXRpb25GYWN0b3J5KXtcblxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcImNhbGxpbmcgdXBkYXRlXCIpXG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oIChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnBvcyA9IHBvc2l0aW9uLmNvb3JkcztcbiAgICAgICAgICAgICRzY29wZS4kZXZhbEFzeW5jKCk7IFxuICAgICAgICB9KVxuXG4gICAgXHQvLyAkc2NvcGUucG9zID0gZ2VvTG9jYXRpb25GYWN0b3J5LnVwZGF0ZUxvY2F0aW9uKCkuY29vcmRzXG4gICAgXHQvLyAudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgXHQvLyBcdCRzY29wZS5wb3MgPSBwb3NpdGlvbi5jb29yZHM7XG4gICAgXHQvLyB9KVxuICAgICAvLyAgICAuY2F0Y2goJGxvZylcblxuICAgICAvLyAgICBnZW9Mb2NhdGlvbkZhY3RvcnkudXBkYXRlT3JpZW50YXRpb24oKVxuICAgIFx0Ly8gLnRoZW4oZnVuY3Rpb24oaGVhZGluZyl7XG4gICAgIC8vICAgICAgICAvLyB0cnVlSGVhZGluZyBkb2Vzbid0IHdvcmsgZm9yIGlwaG9uZVxuICAgICAvLyAgICAgICAgLy8gcmVhZGluZyBhYm91dCBhbmRyb2lkIGl0IGp1c3QgcmV0dXJucyBtYWduZXRpYyBmb3IgdHJ1ZVxuICAgIFx0Ly8gXHQkc2NvcGUuaGVhZGluZyA9IGhlYWRpbmcubWFnbmV0aWNIZWFkaW5nO1xuICAgIFx0Ly8gfSlcbiAgICBcdC8vIC5jYXRjaCgkbG9nKVxuXG5cdCAgICBcbiAgICB9XG5cbn0pOyIsIlxuXG5hcHAuZmFjdG9yeSgnZ2VvTG9jYXRpb25GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICRsb2cpe1xuXG5cdC8vIHZhciBwb3NPcHRpb25zID0ge3RpbWVvdXQ6IDEwMDAwLCBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWV9O1xuICAgIC8vIHZhciBwb3NPcHRpb25zID0ge2VuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZX07XG4gICAgdmFyIHdhdGNoT3B0aW9ucyA9IHt0aW1lb3V0OiA1MDAsIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZX07XG4gICAgdmFyIGdlb0xvY2F0aW9uUG9zO1xuXG4gICAgdmFyIGdlb0xvY2F0aW9uRmFjdG9yeSA9IHt9XG5cbiAgICBnZW9Mb2NhdGlvbkZhY3RvcnkudXBkYXRlTG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKCBwb3NpdGlvbiA9PiBnZW9Mb2NhdGlvblBvcyA9IHBvc2l0aW9uIClcbiAgICAgICAgIHJldHVybiBnZW9Mb2NhdGlvblBvc1xuICAgIH1cbiAgICAvLyBnZW9Mb2NhdGlvbkZhY3RvcnkudXBkYXRlT3JpZW50YXRpb24gPSAoKSA9PiB7XG4gICAgLy8gICAgIHJldHVybiAkY29yZG92YURldmljZU9yaWVudGF0aW9uLmdldEN1cnJlbnRIZWFkaW5nKClcbiAgICAvLyAgICAgICAgIC50aGVuKCBoZWFkaW5nID0+IGhlYWRpbmcgKVxuICAgIC8vICAgICAgICAgLmNhdGNoKCRsb2cpXG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIGdlb0xvY2F0aW9uRmFjdG9yeTtcblxufSkiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCdcbiAgICB9KTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG5cbiAgICAkc2NvcGUubG9naW4gPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNlbmRMb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkluZm8pIHtcblxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJztcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVtYmVyc09ubHknLCB7XG4gICAgICAgIHVybDogJy9tZW1iZXJzLWFyZWEnLFxuICAgICAgICB0ZW1wbGF0ZTogJzxpbWcgbmctcmVwZWF0PVwiaXRlbSBpbiBzdGFzaFwiIHdpZHRoPVwiMzAwXCIgbmctc3JjPVwie3sgaXRlbSB9fVwiIC8+JyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgU2VjcmV0U3Rhc2gpIHtcbiAgICAgICAgICAgIFNlY3JldFN0YXNoLmdldFN0YXNoKCkudGhlbihmdW5jdGlvbiAoc3Rhc2gpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3Rhc2ggPSBzdGFzaDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGRhdGEuYXV0aGVudGljYXRlIGlzIHJlYWQgYnkgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgLy8gdGhhdCBjb250cm9scyBhY2Nlc3MgdG8gdGhpcyBzdGF0ZS4gUmVmZXIgdG8gYXBwLmpzLlxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1NlY3JldFN0YXNoJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICB2YXIgZ2V0U3Rhc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbWVtYmVycy9zZWNyZXQtc3Rhc2gnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRTdGFzaDogZ2V0U3Rhc2hcbiAgICB9O1xuXG59KTtcbiIsImFwcC5jb250cm9sbGVyKCdTa2V0Y2hDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTa2V0Y2hGYWN0b3J5KSB7XG5cblx0U2tldGNoRmFjdG9yeS5pbml0aWFsaXplKHdpbmRvdywgZG9jdW1lbnQpIFxuXG5cdCRzY29wZS5zYXZlUG5nID0gZnVuY3Rpb24oKXtcblx0XHRTa2V0Y2hGYWN0b3J5LnNhdmVJbWcoKVxuXHR9XG5cblx0JHNjb3BlLmxvYWRQbmcgPSBmdW5jdGlvbigpe1xuXHRcdFNrZXRjaEZhY3RvcnkubG9hZEltZygpXG5cdH1cblxufSk7IiwiYXBwLmZhY3RvcnkoJ1NrZXRjaEZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJGxvZywgZ2VvTG9jYXRpb25GYWN0b3J5ICl7XG5cbiAgICB2YXIgU2tldGNoRmFjdG9yeSA9IHt9XG5cbiAgICB2YXIgd29ya3NwYWNlO1xuICAgIHZhciBkb2M7XG5cbiAgICB2YXIgY2FudmFzO1xuICAgIHZhciBjdHg7XG4gICAgdmFyIGNvbG9yO1xuICAgIHZhciBjb2xvckVsZW1lbnRzO1xuICAgIHZhciBjYW52YXNQb2ludHMgPSBbXTtcblxuICAgIHZhciBjdXJyZW50TW91c2VQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuICAgIHZhciBsYXN0TW91c2VQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gICAgdmFyIGRyYXdpbmcgPSBmYWxzZTtcblxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0gU0tFVENIIEZBQ1RPUlkgQUNDRVNTQUJMRSBGVU5DVElPTlMgLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgU2tldGNoRmFjdG9yeS5pbml0aWFsaXplID0gZnVuY3Rpb24oaW5pdF93b3Jrc3BhY2UsIGluaXRfZG9jKXtcbiAgICAgICAgd29ya3NwYWNlID0gaW5pdF93b3Jrc3BhY2U7XG4gICAgICAgIGRvYyA9IGluaXRfZG9jO1xuXG4gICAgICAgIGluaXRpYWxpemVDYW52YXMoKTtcbiAgICAgICAgaW5pdGlhbGl6ZUNvbG9yRWxlbWVudHMoKTtcbiAgICB9XG5cbiAgICBTa2V0Y2hGYWN0b3J5LnNhdmVJbWcgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBDbGVhcm4gdGhlIGNhbnZhcyB0byBzaG93IHRoZSB1c2VyIGEgcmVzcG9uc2VcbiAgICAgICAgLy8gQ291bGQgY2hhbmdlIHRoaXMgbGF0ZXIgdG8gZGlzcGxheSBhIGJ1dHRvbiB0aGF0IHNheXMgc2F2ZWQgXFxcbiAgICAgICAgLy8gYW5kIHRoZXkgY2FuIGNsaWNrIGl0IHRvIGFja25vd2xlZGdlP1xuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgdmFyIGNhbnZhc1BvaW50c1N0cmluZyA9IGNhbnZhc1BvaW50cy5qb2luKFwiLFwiKVxuXG4gICAgICAgIGdlb0xvY2F0aW9uRmFjdG9yeS51cGRhdGVMb2NhdGlvbigpXG4gICAgICAgIC50aGVuKCAocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vMTkyLjE2OC41LjI1MToxMzM3L2FwaS9kcmF3aW5ncycsIHtpbWFnZTogY2FudmFzUG9pbnRzU3RyaW5nLCBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsIGxhdGl0dWRlOnBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZX0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgIC50aGVuKCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIC8vIERvbnQgY2FyZSBhYm91dCB0aGUgcmVzcG9uc2UgaGVyZVxuICAgICAgICAgICAgLy8gT3VyIGxvZyBiZWxvdyB3aWxsIGxldCB1cyBrbm93IGlmIHNvbWV0aGluZyBkaWRuJ3QgZ28gY29ycmVjdGx5IFxuICAgICAgICAgICAgLy8gTGVhdmluZyB0aGlzIGhlcmUgZm9yIG5vdyBpbiBjYXNlIHdlIHdhbnQgdG8gZG8gc29tZXRoaW5nIGxhdGVyXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgkbG9nKSAgICBcblxuICAgIH0gLyogRW5kIG9mIHNhdmVJbWcgRnVuY3Rpb24gKi9cblxuICAgIFNrZXRjaEZhY3RvcnkubG9hZEltZyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGRyYXdpbmcgPSBkb2MuZ2V0RWxlbWVudEJ5SWQoJ3BhaW50JylcblxuICAgICAgICAkaHR0cC5nZXQoJ2h0dHA6Ly8xOTIuMTY4LjUuMjUxOjEzMzcvYXBpL2RyYXdpbmdzLzIxJylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuaW1hZ2U7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKGNhbnZhc1N0cmluZyl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjYW52YXNBcnJheSA9IGNhbnZhc1N0cmluZy5zcGxpdChcIixcIilcbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgY2FudmFzQXJyYXkubGVuZ3RoOyBpICs9IDUgKXtcblxuICAgICAgICAgICAgICAgIGNhbnZhcy5kcmF3KCAgLyogU3RhcnQgUG9pbnQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB4OiBjYW52YXNBcnJheVtpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBjYW52YXNBcnJheVtpKzFdIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW5kIFBvaW50ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogY2FudmFzQXJyYXlbaSArIDJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBjYW52YXNBcnJheVtpICsgM11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29sb3IgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FudmFzQXJyYXlbaSArIDRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKCRsb2cpXG5cbiAgICB9IC8qIEVuZCBvZiBsb2FkIGltYWdlIGZ1bmN0aW9uICovXG5cbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tIFNLRVRDSCBGQUNUT1JZIEhFTFBFUiBGVU5DVElPTlMgLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ0FOVkFTIEZVTkNUSU9OUyAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbGl6ZUNhbnZhcygpe1xuXG4gICAgICAgIGNhbnZhcyA9IGRvYy5nZXRFbGVtZW50QnlJZCgncGFpbnQnKTtcbiAgICAgICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgcmVzaXplQ2FudmFzKClcbiAgICAgICAgd29ya3NwYWNlLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbnZhcylcblxuICAgICAgICAvLyBUb3VjaCBzY3JlZW4gZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBtRG93bik7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG1VcCk7XG4gICAgICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBtTW92ZSk7IFxuXG4gICAgICAgIC8vIEtleWJvYXJkIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIC8vY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1Eb3duKTtcbiAgICAgICAgLy9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1VcCk7XG4gICAgICAgIC8vY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1Nb3ZlKTtcblxuICAgICAgICBjYW52YXMuZHJhdyA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCBzdHJva2VDb2xvcikge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3IgfHwgJ2JsYWNrJztcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oc3RhcnQueCwgc3RhcnQueSk7XG4gICAgICAgICAgICBjdHgubGluZVRvKGVuZC54LCBlbmQueSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xuICAgICAgICAvLyBVbnNjYWxlIHRoZSBjYW52YXMgKGlmIGl0IHdhcyBwcmV2aW91c2x5IHNjYWxlZClcbiAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gaXMgdGhlIG11bHRpcGxpZXIgYmV0d2VlbiBDU1MgcGl4ZWxzXG4gICAgICAgIC8vIGFuZCBkZXZpY2UgcGl4ZWxzXG4gICAgICAgIHZhciBwaXhlbFJhdGlvID0gd29ya3NwYWNlLmRldmljZVBpeGVsUmF0aW8gfHwgMTsgICAgXG4gICAgICAgIFxuICAgICAgICAvLyBBbGxvY2F0ZSBiYWNraW5nIHN0b3JlIGxhcmdlIGVub3VnaCB0byBnaXZlIHVzIGEgMToxIGRldmljZSBwaXhlbFxuICAgICAgICAvLyB0byBjYW52YXMgcGl4ZWwgcmF0aW8uXG4gICAgICAgIHZhciB3ID0gY2FudmFzLmNsaWVudFdpZHRoICogcGl4ZWxSYXRpbyxcbiAgICAgICAgICAgIGggPSBjYW52YXMuY2xpZW50SGVpZ2h0ICogcGl4ZWxSYXRpbztcbiAgICAgICAgaWYgKHcgIT09IGNhbnZhcy53aWR0aCB8fCBoICE9PSBjYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAvLyBSZXNpemluZyB0aGUgY2FudmFzIGRlc3Ryb3lzIHRoZSBjdXJyZW50IGNvbnRlbnQuXG4gICAgICAgICAgICAvLyBTbywgc2F2ZSBpdC4uLlxuICAgICAgICAgICAgdmFyIGltZ0RhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodClcblxuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdzsgY2FudmFzLmhlaWdodCA9IGg7XG5cbiAgICAgICAgICAgIC8vIC4uLnRoZW4gcmVzdG9yZSBpdC5cbiAgICAgICAgICAgIGN0eC5wdXRJbWFnZURhdGEoaW1nRGF0YSwgMCwgMClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNjYWxlIHRoZSBjYW52YXMnIGludGVybmFsIGNvb3JkaW5hdGUgc3lzdGVtIGJ5IHRoZSBkZXZpY2UgcGl4ZWxcbiAgICAgICAgLy8gcmF0aW8gdG8gZW5zdXJlIHRoYXQgMSBjYW52YXMgdW5pdCA9IDEgY3NzIHBpeGVsLCBldmVuIHRob3VnaCBvdXJcbiAgICAgICAgLy8gYmFja2luZyBzdG9yZSBpcyBsYXJnZXIuXG4gICAgICAgIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcbiAgICAgICAgXG4gICAgICAgIGN0eC5saW5lV2lkdGggPSA1XG4gICAgICAgIGN0eC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gICAgICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJzsgICAgIFxuICAgIH1cblxuICAgIC8vIEV2ZW50IGZ1bmN0aW9ucyBmb3IgY2FudmFzXG5cbiAgICBmdW5jdGlvbiBtRG93bihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGRyYXdpbmcgPSB0cnVlO1xuICAgICAgICAgICAgY3VycmVudE1vdXNlUG9zaXRpb24ueCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVggLSB0aGlzLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBjdXJyZW50TW91c2VQb3NpdGlvbi55ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSAtIHRoaXMub2Zmc2V0VG9wO1xuXG4gICAgICAgIH1cblxuICAgIGZ1bmN0aW9uIG1VcCgpIHtcbiAgICAgICAgZHJhd2luZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1Nb3ZlKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICghZHJhd2luZykgcmV0dXJuO1xuXG4gICAgICAgIGxhc3RNb3VzZVBvc2l0aW9uLnggPSBjdXJyZW50TW91c2VQb3NpdGlvbi54O1xuICAgICAgICBsYXN0TW91c2VQb3NpdGlvbi55ID0gY3VycmVudE1vdXNlUG9zaXRpb24ueTtcblxuICAgICAgICBjdXJyZW50TW91c2VQb3NpdGlvbi54ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCAtIHRoaXMub2Zmc2V0TGVmdDtcbiAgICAgICAgY3VycmVudE1vdXNlUG9zaXRpb24ueSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVkgLSB0aGlzLm9mZnNldFRvcDtcblxuICAgICAgICAvLyBQdXNoIG91ciBwb2ludHMgaW50byBhbiBhcnJheVxuICAgICAgICBjYW52YXNQb2ludHMucHVzaChcbiAgICAgICAgICAgIGxhc3RNb3VzZVBvc2l0aW9uLnggKyBcIixcIiArIFxuICAgICAgICAgICAgbGFzdE1vdXNlUG9zaXRpb24ueSArIFwiLFwiICsgXG4gICAgICAgICAgICBjdXJyZW50TW91c2VQb3NpdGlvbi54ICsgXCIsXCIgK1xuICAgICAgICAgICAgY3VycmVudE1vdXNlUG9zaXRpb24ueSArIFwiLFwiICsgXG4gICAgICAgICAgICBjb2xvclxuICAgICAgICApXG5cbiAgICAgICAgY2FudmFzLmRyYXcobGFzdE1vdXNlUG9zaXRpb24sIGN1cnJlbnRNb3VzZVBvc2l0aW9uLCBjb2xvcik7XG4gICAgfVxuXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ09MT1IgRUxFTUVOVCBGVU5DVElPTlMgLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgIGZ1bmN0aW9uIGluaXRpYWxpemVDb2xvckVsZW1lbnRzKCl7XG5cbiAgICAgICAgY29sb3JFbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYXJrZXInKSk7XG5cbiAgICAgICAgY29sb3JFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhpcyBlbGVtZW50XG4gICAgICAgICAgICAvLyB0byBpdHMgaWQgKHB1cnBsZSwgcmVkLCBibHVlLCBldGMpLlxuICAgICAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZWwuaWQ7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBhIGNsaWNrIGhhbmRsZXIgdGhhdCB3aWxsIHNldCBvdXIgY29sb3IgdmFyaWFibGUgdG9cbiAgICAgICAgICAgIC8vIHRoZSBlbGVtZW50cyBpZCwgcmVtb3ZlIHRoZSBzZWxlY3RlZCBjbGFzcyBmcm9tIGFsbCBjb2xvcnMsXG4gICAgICAgICAgICAvLyBhbmQgdGhlbiBhZGQgdGhlIHNlbGVjdGVkIGNsYXNzIHRvIHRoZSBjbGlja2VkIGNvbG9yLlxuICAgICAgICAgICAgZnVuY3Rpb24gcGlja0NvbG9yKCkge1xuICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5pZDtcbiAgICAgICAgICAgICAgICBkb2MucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGlja0NvbG9yKTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RhcCcsIHBpY2tDb2xvcik7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFNrZXRjaEZhY3RvcnlcblxufSkiLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCAkc3RhdGUpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcblxuICAgICAgICAgICAgc2NvcGUuaXRlbXMgPSBbXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgICAgICAgICAgeyBsYWJlbDogJ0Fib3V0Jywgc3RhdGU6ICdhYm91dCcgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnRG9jdW1lbnRhdGlvbicsIHN0YXRlOiAnZG9jcycgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnTWVtYmVycyBPbmx5Jywgc3RhdGU6ICdtZW1iZXJzT25seScsIGF1dGg6IHRydWUgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHNjb3BlLmlzTG9nZ2VkSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNldFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciByZW1vdmVVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSBudWxsO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2V0VXNlcigpO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MsIHNldFVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgcmVtb3ZlVXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgcmVtb3ZlVXNlcik7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
