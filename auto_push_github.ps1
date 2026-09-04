Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class CredentialHelper {
    [DllImport("Advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("Advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    public static extern void CredFree(IntPtr credentialPtr);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public long LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    public static string GetPassword(string target) {
        IntPtr credPtr;
        if (CredRead(target, 1, 0, out credPtr)) {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            byte[] passwordBytes = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, passwordBytes, 0, cred.CredentialBlobSize);
            CredFree(credPtr);
            return Encoding.Unicode.GetString(passwordBytes);
        }
        return null;
    }
}
"@

$token = [CredentialHelper]::GetPassword("git:https://github.com");
if ($token) {
    Write-Host "Found token for git:https://github.com! Length: " $token.Length;
    # Execute upload_to_github.js directly with the token!
    & "agy-node" "upload_to_github.js" $token
} else {
    Write-Host "Could not retrieve token from Windows Credential Manager.";
}
