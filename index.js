import { execSync } from 'child_process';
import dotenv from 'dotenv';

function execArp() {
  console.log('--- execArp ---');

  return execSync('arp-scan -I eth0 -l').toString();
}

function getMacAddresses(stdout) {
  console.log('--- getMacAddresses ---');

  const macAddresses = stdout.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g);
  if (macAddresses === null) {
    return [];
  }
  console.log(macAddresses);

  return macAddresses;
}

async function sendMacAddresses(macAddresses) {
  console.log('--- sendMacAddresses ---');

  await fetch(process.env.REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ MACAddresses: macAddresses }),
  });
}

function main() {
  dotenv.config();

  const stdout = execArp();
  const macAddresses = getMacAddresses(stdout);
  void sendMacAddresses(macAddresses);
}

main();
