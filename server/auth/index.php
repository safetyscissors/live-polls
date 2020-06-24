<?php
    require './config.php';
    require './vendor/autoload.php';

  $options = array(
    'cluster' => $cluster,
    'useTLS' => false
  );
  $pusher = new Pusher\Pusher(
    $key,
    $secret,
    $appId,
    $options
  );
  echo $pusher->socket_auth($_POST['channel_name'],$_POST['socket_id']);
?>