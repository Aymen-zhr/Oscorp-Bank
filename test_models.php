<?php
$apiKey = "AIzaSyBHfVUZ0ZN70IbslnHGyis1Yix1Nldk0dg";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$output = curl_exec($ch);
curl_close($ch);
echo $output;
