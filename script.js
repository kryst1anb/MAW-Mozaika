window.onload = function() {
    ruch(window.innerWidth, window.innerHeight);
    odswiez();

    document.getElementById('rozdzielczosc').innerHTML = window.innerWidth + "px x " + window.innerHeight + "px";
    css();
}

function ruch(width, height) {
    var obiekty = document.querySelectorAll('.mozaika');
    var pozycjaX, pozycjaY, that;
    function startRuchu(zdarzenie, That) {
        pozycjaX = zdarzenie.pageX;
        pozycjaY = zdarzenie.pageY;
        that = That;
    }
    function startRuchuDotknieciem(zdarzenie) {
        if (zdarzenie.changedTouches.length > 0){
            startRuchu(zdarzenie.changedTouches[0], this);
        }
    }
    function startRuchuMyszka(zdarzenie) {
        window.addEventListener('mousemove', ruchMyszkaLubDotykiem, true);
        window.addEventListener('mouseup', koniecRuchuMyszka, true);
        startRuchu(zdarzenie, this);
    }
    function ruchMyszkaLubDotykiem(zdarzenie) {
        var poprawionaPozycjaX = zdarzenie.pageX - pozycjaX;
        var poprawionaPozycjaY = zdarzenie.pageY - pozycjaY;
        pozycjaX = zdarzenie.pageX;
        pozycjaY = zdarzenie.pageY;
        that.style.top = (that.offsetTop + poprawionaPozycjaY) + 'px';
        that.style.left = (that.offsetLeft + poprawionaPozycjaX) + 'px';
        wyslijNaSerwer();
    }
    function koniecRuchuMyszka() {
        window.removeEventListener('mouseup', koniecRuchuMyszka, true);
        window.removeEventListener('mousemove', ruchMyszkaLubDotykiem, true);
    }
    function ruchDotykiem(zdarzenie) {
        if (zdarzenie.changedTouches.length > 0) {
            ruchMyszkaLubDotykiem(zdarzenie.changedTouches[0]);
        }
        zdarzenie.preventDefault();
        zdarzenie.stopPropagation();
    }
    for (var i = 0; i < obiekty.length; i++) {
        var obiekt = obiekty[i];
        obiekt.addEventListener('mousedown', startRuchuMyszka, true);
        obiekt.addEventListener('touchstart', startRuchuDotknieciem, false);
        obiekt.addEventListener('touchmove', ruchDotykiem, false);
    }
}

function wyslijNaSerwer() {
    var request = new XMLHttpRequest();
    request.open("POST", "server.php", true);
    request.send(JSON.stringify({
        polecenie: 3,
        "kolox": document.getElementById("kolo").style.top,
        "koloy": document.getElementById("kolo").style.left,

        "trojkatx": document.getElementById("trojkat").style.top,
        "trojkaty": document.getElementById("trojkat").style.left,

        "kwadratx": document.getElementById("kwadrat").style.top,
        "kwadraty": document.getElementById("kwadrat").style.left,

        "trapezoidx": document.getElementById("trapezoid").style.top,
        "trapezoidy": document.getElementById("trapezoid").style.left
    }));
}

function odswiez() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            document.getElementById("kolo").style.top = response.kolox;
            document.getElementById("kolo").style.left = response.koloy;
            
            document.getElementById("trojkat").style.top = response.trojkatx;
            document.getElementById("trojkat").style.left = response.trojkaty;
            
            document.getElementById("kwadrat").style.top = response.kwadratx;
            document.getElementById("kwadrat").style.left = response.kwadraty;
            
            document.getElementById("trapezoid").style.top = response.trapezoidx;
            document.getElementById("trapezoid").style.left = response.trapezoidy;
        }
    }
    request.open("POST", "server.php", true);
    request.send(JSON.stringify({
        polecenie: 2
    }));
}

function css() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            console.log("Ustawiony CSS:" + response);
            document.getElementById("pagestyle").setAttribute("href", response);
        }
    }
    request.open("POST", "server.php", true);
    request.send(JSON.stringify({ 
        polecenie: 1
    }));
}
setInterval(odswiez, 700);
    