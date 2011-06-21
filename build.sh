# start
rm -rf build/*
mkdir temp

# ie
cp src/client/* temp/
cp tools/IECapt/IECapt.exe temp/
zip -r build/client-win-ie.zip temp/*
rm -rf temp/*

# webkit
cp src/client/* temp/
cp tools/PhantomJS/* temp/
zip -r build/client-macos-webkit.zip temp/*
rm -rf temp/*

# clear
rm -rf temp/
