find . -name "*.png"|sed 's/.png//'|xargs -n1 -I {} mv {}.png {}.jpg
find ./ -regex '.*jpg' -exec convert -resize 640x480 -quality 70 {} {} \;

'.*\(jpg\|JPG\|png\|jpeg\)'