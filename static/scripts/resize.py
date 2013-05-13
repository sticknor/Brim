##############
# NODE CODE
##############
#var child_process = require('child_process');
#child_process.exec('python filter.py india.jpeg',function(error,stdout,stderr){});


import math;
import sys;
import Image;

imageFile = sys.argv[1]; # Gets file path from inline arguments
path = imageFile.split('/');
imageName = path[-1];

# Given an image, returns a resized version
# with dimensions of less than or equal to
# 84 pixels. Uses bicubic interpolation
def resizeImageForUpload(imageFile):
	import Image;
	image = Image.open(imageFile);
	height = image.size[1];
	width = image.size[0];
	scale = (max(height,width)+419)/420;
	newHeight = height/scale
	newWidth = width/scale;
	resizeImage = image.resize((newWidth,newHeight),Image.BICUBIC);
	#resizeImage.save(imageName);
	resizeImage.save("/".join(path[:-1]+["resize"+imageName]));
	return;
	

resizeImageForUpload(imageFile);
