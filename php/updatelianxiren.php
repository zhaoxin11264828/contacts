<?php
// updatelianxiren.php?id=4&shuxing=phone&zhi=321
$mysqli = new mysqli('localhost','root','','test');
$sql = "UPDATE `lianxiren` SET `name` = '{$_GET['name']}',`phone` = '{$_GET['phone']}',`beizhu` = '{$_GET['beizhu']}' WHERE `id` = '{$_GET['id']}'";
$mysqli -> query($sql);
echo 'success';
?>