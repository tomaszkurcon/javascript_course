import {
  existsSync,
  writeFileSync,
  readFile,
  writeFile,
  readFileSync,
} from "node:fs";
import { argv } from "node:process";
import { exec, spawn } from "node:child_process";
import readline from "node:readline";

if (!existsSync("licznik.txt")) {
  writeFileSync("licznik.txt", "1");
}

const read_async = () => {
  readFile("licznik.txt", (err, data) => {
    if (err) throw err;
    let counter = parseInt(data);
    console.log("Liczba uruchomień: ", counter);
    counter += 1;
    writeFile("licznik.txt", counter.toString(), (err) => {
      if (err) throw err;
    });
  });
};
const read_sync = () => {
  let data = readFileSync("licznik.txt");
  let counter = parseInt(data);
  console.log("Liczba uruchomień: ", counter);
  counter += 1;
  writeFileSync("licznik.txt", counter.toString());
};

const execute_commands = () => {
  console.log(
    "Wprowadź komendy — naciśnięcie Ctrl+D kończy wprowadzanie danych"
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.prompt();

  rl.on("line", (line) => {
    console.log(line);
    exec(line, (err, output) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(output);
    });
    rl.prompt();
  }).on("close", () => {
    console.log("koniec");
    process.exit(0);
  });
};
switch (argv[2]) {
  case "--async":
    read_async();
    break;
  case "--sync":
    read_sync();
    break;
  default:
    execute_commands();
}
