<?php
	$f = fopen("semafor","w");
	flock($f,LOCK_EX);

    $suroweDane = file_get_contents("php://input");
    $daneJSON = json_decode($suroweDane,true);

    $polecenie = intval($daneJSON['polecenie']);
        
    if($daneJSON['polecenie']  == "set" ){
        file_put_contents("dane",$suroweDane);
    }else if($daneJSON['polecenie']  == "get" ){
		$plik = fopen("dane", "r") or die("Bład odczytu pliku");
        $odczytPlik = fread($plik, filesize("dane"));
        fclose($plik);
        echo $odczytPlik;
    }else if($daneJSON['polecenie']  == "css" ){
        $user_agent = $_SERVER['HTTP_USER_AGENT'];

        if (strpos($user_agent, 'Windows')){
            echo 'styleWindows.css';
        }
        else if (strpos($user_agent, 'Android')){
            echo 'styleAndroid.css';
        }
        else if(strpos($user_agent, 'Mac')){
            echo 'styleIOS.css';
        }
         else{
            echo 'BRAK';
        }
    }
    flock($f, LOCK_UN); 
    fclose($f);
?>