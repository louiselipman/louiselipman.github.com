<!doctype html>
<html>
<head>
<title>Image Upload</title>
</head>
<body>
<form action="<?php echo $PHP_SELF; ?>" method="post">
<p>Image name: <select name="fileName">
<?php
if ($handle = opendir("../images")) {
	while (($entry = readdir($handle)) == true) {
		if ($entry != "." && $entry != "..") { ?>
			<option value=
			<?php echo "\"" . $entry . "\"" ?>
			>
			<?php echo $entry ?>
			</option>
		<?php }
	}
	closedir($handle);
}
?>
</select></p>
<p>Title: <input type="text" name="title" /></p>
<p>Artist: <input type="text" name="artist" /></p>
<p><input type="submit" value="Submit" name="submit" /></p>
<?php
if (isset($_POST["submit"])) {
	$jsonFile = "imgarray.json";
	$handle = fopen($jsonFile, "r+") or die("can't open file");
	$data = fread($handle, filesize($jsonFile));
	$json = json_decode($data, true);
	$fileName = $_POST["fileName"];
	$title = $_POST["title"];
	$artist = $_POST["artist"];
	$isNewImage = true;
	foreach ($json as $image) {
		if ($image["fileName"] == $fileName) {
			$isNewImage = false;
		}
	}
	if (!$isNewImage) {
		echo "Did not add " . $fileName . " because it was added previously";
	} else {
		if ($title == "") {
			echo "Did not add " . $fileName . " because the title field was empty";
		} else if ($artist == "") {
			echo "Did not add " . $fileName . " because the artist field was empty";
		} else {
			$newImage = array(
				fileName => $fileName,
				title => $title,
				artist => $artist,
			);
			array_push($json, $newImage);
			rewind($handle);
			$json = json_encode($json);
			fwrite($handle, $json) or die("can't write to file");
			echo "Successfully added " . $fileName . ": " . $title . " by " . $artist;
		}
	}
	fclose($handle);
}
?>
</form>
</body>
</html>