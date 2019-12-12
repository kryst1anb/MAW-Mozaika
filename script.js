
        window.onload = function() {

            ruch(window.innerWidth, window.innerHeight);
            odswiez();

            document.getElementById('rozdzielczosc').innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
            css();
        }

        function ruch(width, height) {
            var obs = document.querySelectorAll('.mozaika');
            var x, y, that;
            var zatrzymaj = function(e) {
                e.stopPropagation();
                e.preventDefault();
            }

            var startRuchu = function(e, That) {
                x = e.pageX;
                y = e.pageY;
                that = That;
                zatrzymaj(e);
            }

            var startRuchuDotknieciem = function(e) {
                if (e.changedTouches.length > 0)
                    startRuchu(e.changedTouches[0], this);
            }

            var startRuchuMyszka = function(e) {
                window.addEventListener('mousemove', ruchMyszkaLubDotykiem, true);
                window.addEventListener('mouseup', koniecRuchuMyszka, true);
                startRuchu(e, this);
            }

            var ruchMyszkaLubDotykiem = function(e) {
                var dx = e.pageX - x;
                var dy = e.pageY - y;
                x = e.pageX;
                y = e.pageY;
                that.style.top = (that.offsetTop + dy) + 'px';
                that.style.left = (that.offsetLeft + dx) + 'px';
                wyslijNaSerwer();
            }

            var koniecRuchuMyszka = function(e) {
                window.removeEventListener('mouseup', koniecRuchuMyszka, true);
                window.removeEventListener('mousemove', ruchMyszkaLubDotykiem, true);
                zatrzymaj(e);
            }

            var ruchDotykiem = function(e) {
                if (e.changedTouches.length > 0) {
                    ruchMyszkaLubDotykiem(e.changedTouches[0]);
                }
                zatrzymaj(e);
            }

            var koniecRuchuDotknieciem = function(e) {
                zatrzymaj(e);
            };

            for (var i = 0; i < obs.length; i++) {
                var ob = obs[i];
                ob.addEventListener('mousedown', startRuchuMyszka, true);
                ob.addEventListener('touchstart', startRuchuDotknieciem, false);
                ob.addEventListener('touchmove', ruchDotykiem, false);
                ob.addEventListener('touchend', koniecRuchuDotknieciem, false);
            }
        }

        function wyslijNaSerwer() {
            var kolox_ = document.getElementById("kolo").style.top;
            var koloy_ = document.getElementById("kolo").style.left;
            var trojkatx_ = document.getElementById("trojkat").style.top;
            var trojkaty_ = document.getElementById("trojkat").style.left;
            var kwadratx_ = document.getElementById("kwadrat").style.top;
            var kwadraty_ = document.getElementById("kwadrat").style.left;

            var log = JSON.stringify({
                polecenie: "set",
                "kolox": kolox_,
                "koloy": koloy_,
                "trojkatx": trojkatx_,
                "trojkaty": trojkaty_,
                "kwadratx": kwadratx_,
                "kwadraty": kwadraty_
            });

            var request = new XMLHttpRequest();
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(log);
        }

        function odswiez() {
            var request = new XMLHttpRequest();
            var log = JSON.stringify({
                polecenie: "get"
            });
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);

                    document.getElementById("kolo").style.top = response.kolox;
                    document.getElementById("kolo").style.left = response.koloy;

                    document.getElementById("trojkat").style.top = response.trojkatx;
                    document.getElementById("trojkat").style.left = response.trojkaty;

                    document.getElementById("kwadrat").style.top = response.kwadratx;
                    document.getElementById("kwadrat").style.left = response.kwadraty;
                }
            }
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(log);
        }

        function css() {
            var request = new XMLHttpRequest();
            var log = JSON.stringify({
                polecenie: "css"
            });

            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = this.responseText;
                    console.log("Ustawiony CSS:" + response);
                    document.getElementById("pagestyle").setAttribute("href", response);
                }
            }

            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.send(log);
        }
        var time = setInterval(odswiez, 2000);
    