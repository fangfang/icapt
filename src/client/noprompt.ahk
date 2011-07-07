Loop
{
IFWinExist, IECapt.exe
	Sleep, 500
	WinKill
	
IFWinExist, IECapt.exe
	Sleep, 500
	WinKill

Sleep, 3000
}
