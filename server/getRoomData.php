<?php
    require './auth/config.php';
    require './auth/vendor/autoload.php';

    if (!isset($_GET['room'])) {
        echo 'NONAME';
        return;
    }
    $room = $_GET['room'];

    $options = array(
        'cluster' => 'us3',
        'useTLS' => false
    );
    $pusher = new Pusher\Pusher(
        $key,
        $secret,
        $appId,
        $options
    );

    $info = $pusher->get_channel_info($room);
    if ($DEBUG) {
        var_dump($info);
    }
    if ($info->occupied) {
        echo 'INUSE';
    } else {
        echo 'OPEN';
    }
?>