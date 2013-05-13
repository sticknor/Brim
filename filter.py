##############
# NODE CODE
##############
#var child_process = require('child_process');
#child_process.exec('python filter.py india.jpeg',function(error,stdout,stderr){});


import math;
import sys;
import Image;

imageFile = sys.argv[1]; # Gets file path from inline arguments

outFile = sys.argv[2]; # Sets output file path and name

filterNum = sys.argv[3]; # Gets number of filter used

brailleText = [' ','a','@','c','1','b','i','f','"','e','^','d','3','h','j','g',"'",'k','/','m','2','l','s','p','9','o','>','n','6','r','t','q',',','*','.','%','5','<','[','$',';',':','_','?','4','\\','w',']','-','u','+','x','8','v','!','&','0','z','#','y','7','(',')','='];


# Given a pixel with values for RGB returns 
# the Photometric Brightness which is a sort 
# of average of the colors, except they are 
# weigthed differently
def findPixelBrightness(pixel):
	if (type(pixel) == type(0)):
		return pixel;
	else:
		return  ((0.2126*pixel[0]) + (0.7152*pixel[1]) + (0.0722*pixel[2]));
		
# Given an image, returns a resized version
# with dimensions of less than or equal to
# 84 pixels. Uses bicubic interpolation
def resizeImage(image):
	height = image.size[1];
	width = image.size[0];
	scale = (max(height,width)+83)/84;
	newHeight = height/scale
	newWidth = width/scale;
	resizeImage = image.resize((newWidth,newHeight),Image.BICUBIC);
	return resizeImage;

def findThreshold(image, thresh):
	pix = image.load();
	height = image.size[1];
	width = image.size[0];
	numPixels = width*height;
	setATot = 0;
	setBTot = 0;
	for r in xrange(height):
		for c in xrange(width):
			brightness = findPixelBrightness(pix[c,r]);
			if (brightness >= thresh):
				setATot += brightness;
			
			else:
				setBTot += brightness; 

	setAAvg = setATot/numPixels;
	setBAvg = setBTot/numPixels;

	return (setAAvg+setBAvg)/2;

def imageToBinaryArray(image,thresh):
	pix = image.load();
	height = image.size[1];
	width = image.size[0];
	finalArray = [];
	for r in xrange(height):
		rowArray = [];
		for c in xrange(width):
			brightness = findPixelBrightness(pix[c,r]);
			if (brightness >= thresh):
				if (type(pix[c,r]) == type(0)):
					pix[c,r] = 255;
				else:
					pix[c,r] = (255,255,255);
				rowArray += [False];
			else:
				if (type(pix[c,r]) == type(0)):
					pix[c,r] = 0;
				else:
					pix[c,r] = (0,0,0);
				rowArray += [True];
				
		finalArray += [rowArray];	
	#image.show();
	return finalArray;


def thresholdingfilter(imageFile):
	import Image

	image = Image.open(imageFile);
	resizeImg = resizeImage(image);
	Ti = 127; #half posible brightness(initial threshold)
	Tf = -1; #arbitrary initial number
	while (Tf != Ti):
		Tf = findThreshold(resizeImg,Ti);
		if (Tf != Ti):
			Ti = Tf; # change Ti to be new threshold
			Tf = -1; # change Tf to be arbitraty number

	binArray = imageToBinaryArray(resizeImg,Tf);

	return binArray;

def blacklinefilter(imageFile):
	import Image
	import ImageFilter

	image = Image.open(imageFile);



	resizeImg = resizeImage(image);

	imageArray = imageToBinaryArray(resizeImg,200);

	#resizeImg.show();
	return imageArray;

def findEdges(imageFile):
	import Image
	import ImageFilter

	image = Image.open(imageFile);

	filt1Image = image.filter(ImageFilter.SHARPEN);

	#filt2Image = filt1Image.filter(ImageFilter.EDGE_ENHANCE_MORE);

	resizeImg = resizeImage(filt1Image);

	filtImage = resizeImg.filter(ImageFilter.CONTOUR);

	imageArray = imageToBinaryArray(filtImage,200);

	#filtImage.show();
	return imageArray;


def automatedfilter(imageFile):
	import matplotlib.pyplot as plt
	import numpy as np
	from skimage import data, io, color, exposure, filter, transform
	from skimage.filter import threshold_otsu

	imageThresh = io.imread(imageFile);
	image = Image.open(imageFile);
	thresh = threshold_otsu(imageThresh);
	resizeImg = resizeImage(image);
	imageArray = imageToBinaryArray(resizeImg,thresh);
	return imageArray;


def padImage(imArray):
	rows = len(imArray);
	cols = len(imArray[0]);
	addRows = [];
	addCols = [];
	if (cols%2)>0:
		addCols = [False]*(6-(cols%6));
	for r in xrange(rows):
		imArray[r]+= addCols;
	newCols = len(imArray[0]);
	
	if (rows%3)>0:
		addRows = [[False]*newCols]*(6-(rows%6));
	
	imArray += addRows;

def makeText(imArray):
	padImage(imArray);
	string = "";
	f = open(outFile,'w');
	rows = len(imArray);
	cols = len(imArray[0]);

	for rBlock in xrange(rows/3):
		for cBlock in xrange(cols/2):
			total = 0;
			for r in xrange(3):
				for c in xrange(2):
					placeInBlock = r*2+c;
					row = rBlock*3+r;
					col = cBlock*2+c;
					if (imArray[row][col]==True):
						total+=math.pow(2,placeInBlock);
			f.write(brailleText[int(total)]);
		f.write("\n");
	f.close();
	print outFile;

if (filterNum == '1'): 
	imArray = thresholdingfilter(imageFile);
elif (filterNum == '2'): 
	imArray = blacklinefilter(imageFile);
elif (filterNum == '4'): 
	imArray = automatedfilter(imageFile);
elif (filterNum == '3'): 
	imArray = findEdges(imageFile);
else:
	#print filterNum;
	raise Exception("Invalid Input!");
makeText(imArray);
