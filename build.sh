rm build/client_win_ie.zip
mkdir build/tmp
cp src/client/* build/tmp/
cp tools/IECapt/IECapt.exe build/tmp/
zip -r build/client_win_ie.zip build/tmp/*
rm -rf build/tmp/