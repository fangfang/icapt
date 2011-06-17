Welcome to Mewsoft Snapshotter
==============================
The websites screenshot and thumbnail command line maker tool
Copyrights (c) Mewsoft Corporation 2007. All rights reserved.
Website address: www.mewsoft.com
Support: support@mewsoft.com

Installation
=============
Before you start using the program, you need to register the program DLLs.
To register the program DLLs, run the file registerdlls.bat once which exists
in the same program folder. You need to run this file once only.

Starting
========
To get the program help, just start the program from the command prompt:

C:\Snapshotter\Snapshotter
 Snapshotter Version 2.0.0. Copyrights (c) 2007-2011 Mewsoft Corporation www.mewsoft.com. All rights reserved.

Usage:
======
Example single website:

Snapshotter -u "http://www.mewsoft.com" -o "C:\mewsoft.jpg" -w 120 -h 90

Batch URL File:

Snapshotter -l "URLs.txt -o %m  -w 120 -h 90

 Switch       Description:
 ------------------------------------------------------
-u     Website URL
-o     Output filename:
		%m      URL MD5 Hash (Default). Created in the current folder.
		%d      URL Domain name. Created in the current folder.
		%h      URL Hostname. Created in the current folder.
		%f      URL Filename. Created in the current folder.
		other   Creats the filename with entered string in the path specfied.
-p     Output directory. Default is the application directory.
-fp    Filename prefix. Prepends this to the the filename.
-fs    Filename suffix. Append this to the filename.
-fd    Filename date time format suffix. Append string with date time formating switchs.
       Date time switchs are %y=Year, %m=Month, %d=Day, %h=Hour, %n=Minute, %s=Second,
       %dd Day of the year 1-366, %w=Weekday 1-7, %ww=Week 1-53, %mn=Month name, %wn=Weekday name.
       Example: -fd ""-%y-%m-%d_%h-%n-%s"".
-ft    Filename contains date time formating switchs. Default 0 (0 = disabled, 1 = enabled).
       Use all the switches of the -fd option to format the filename.
       Example: -o ""mewsoft.com-%y-%m-%d.jpg"" -ft 1.
-w     Image width. Default is the full browser width.
-h     Image height. Default is the full browser height.
-bw    Browser width. Default Automatically determined (Set to 0 for default).
-bh    Browser height. Default Automatically determined (Set to 0 for default).
-cw    Clip width only. Clip image width, Default 0 (0 = full image width).
-ch    Clip height only. Clip image height, Default 0 (0 = full image height)
-c     Clip rectangle. Clip image rectangle, Default 0,0,0,0 (note, no spaces).
        Format: -c "x|y|w|h" no spaces. Use -1 for full width or full height.
        Example: -c "0|0|-1|800" to clip the image to height 800 with full width.

-g     Make gray or black and white images. (0 = black and white only, 1= gray).


-z     Zoon ratio of the html page between 1 and 5.
               
-sm    Smoothing mode of resizing. 0 = Default, 1 = HighSpeed, 2 = HighQuality, 3 = None, 4 = AntiAlias.
               
-im    Interpolation mode of resizing. 0 = Default, 1 = LQ, 2 = HQ, 3 = Bilinear, 4 = Bicubic.
         5 = NearestNeighbor, 6 = HQBilinear, 7 = HQBicubic.
                    
-xdpi  Set the image resolution on x axis. Formats like TIFF support DPI.
-ydpi  Set the image resolution on y axis. Formats like TIFF support DPI.
               
-k     Draw watermark text on the snapped image at the specificed position with the given size, color and font.
         Format: -k "x|y|Text|FontSize|FontColorHex|FonyName".
         Example: -k "0|0|Mewsoft|72|FF00FF|Arial".
         With Shadow Format: -k "x|y|Text|FontSize|FontColorHex|FonyName|dx|dy|ShadowColorHex".
         Example: -k "0|0|Mewsoft|72|FF00FF|Arial|15|12|FFFFFF".
    
-login Set the user name and password. Useful on IIS with ASP or ASP.Net etc.
         Format: -login "userName|domainName|passwd".
    
-realm Set the http authentication user name and password Realm.
            Format: -realm ""userName|passWord"".
                    
-proxy Allow to set custom proxy for IE.
         Format: -proxy "Host|userName|passWord|autoConfig".
         Host can be IP:Port pair and autoConfig eithre 0 or 1.

-t     Browser timeout (in milliseconds). Default 40000 ms
-i     Image type extension (allowed values: jpg gif png bmp tiff). Default jpg
-q     JPEG image quality (0 to 100) .Default 85.
-r     Keep thumbnail image aspect ration. Default 1 (0 = disabled, 1 = enabled)
-d     Set image size as browser size, Default 0 (0 = disabled, 1 = enabled)
-f     Force snapshot if time out, Default 0 (0 = disabled, 1 = enabled)
-a     Enable ActiveX, Default 0 (0 = disabled, 1 = enabled)
-j     Enable Java, Default 0 (0 = disabled, 1 = enabled)
-s     Enable Script, Default 0 (0 = disabled, 1 = enabled)
-w     Wait time (milliseconds) after the html document is downloaded (default 1000).
-l     URL list text file, each URL on one line for batch processing.

You can use the switchs with or without the  dash -, for example u or -u or /u are the same.

Also you can use full swith name instead of the shortcut, most commands have full name like this:

u=url, o=out, w=width, h=height, bw=bwidth, bh=bheight, q=quality, t=timeout, x=wait, i=image,
a=activex, j=java, s=script, f=force, d=dimension, r=ratio, c=clip, cw=clipwidth, ch=clipheight, h=help,
fp=filenameprefix, fs=filenamesuffix, fd=filenamedate, ft=filenametime, g=gray, k=Watermark, im=interpolationmode, sm=smoothingmode, z=zoom