$ErrorActionPreference = 'Stop'

$javaHome = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot'
$mavenHome = Join-Path $PSScriptRoot '.tools\apache-maven-3.9.9'

if (-not (Test-Path (Join-Path $javaHome 'bin\java.exe'))) {
    throw "Java 21 was not found at $javaHome."
}

$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$mavenHome\bin;$env:Path"

& (Join-Path $mavenHome 'bin\mvn.cmd') spring-boot:run
