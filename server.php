<?php
	$f = fopen("semafor","w");
	flock($f,LOCK_EX);

    $suroweDane = file_get_contents("php://input");
    $daneJSON = json_decode($suroweDane,true);

    $polecenie = intval($daneJSON['polecenie']);

    if(isset($daneJSON['polecenie']))
    {
        $polecenie = intval($daneJSON['polecenie']);
        switch($polecenie)
        {
            case 1: 
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
            break;

            case 2: 
                $plik = fopen("dane", "r") or die("Bład odczytu pliku");
                $odczytPlik = fread($plik, filesize("dane"));
                fclose($plik);
                echo $odczytPlik; 
            break;

            case 3: 
                file_put_contents("dane",$suroweDane);
            break;
            default: 
                $wynik = array('status' => false, 'kod' => 3, 'wartosc' => 'Podane zostało złe polecenie');
        }
    }

    flock($f, LOCK_UN); 
    fclose($f);
?>