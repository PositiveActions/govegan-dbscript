#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const initJs = require('./scripts/init_entries.js');
const addJs = require('./scripts/add_entries.js');

const cmdList = [{name: "init", value: "init"}, {name: "add", value: "add"}];
const cmdObj = {
    "init": {
        func: (apiUrl, apiKey) => initJs(apiUrl, apiKey)
    },
    "add": {
        func: (apiUrl, apiKey) => addJs(apiUrl, apiKey)
    }
}

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("Go Vegan", {
                font: "isometric1",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            name: "API URL",
            type: "input",
            message: "What is the api url to go vegan backend ?",
            validate: function(value) {
                return new Promise((resolve) => {
                    if (!value)  {
                        displayError("You need to provide the api url")
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            }
        },
        {
            name: "API KEY",
            type: "input",
            message: "What is the api key to access vegan backend ?",
            validate: function(value) {
                return new Promise((resolve) => {
                    if (!value)  {
                        displayError("You need to provide the api key")
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            }
        },
        {
            name: "CMD",
            type: "input",
            message: "What do you want to do ?",
            choices: [{name: "init", value: "init"}, {name: "add", value: "add"}],
            validate: function(value) {
                return new Promise((resolve) => {
                    if (!value)  {
                        displayError("You need to provide the a cmd")
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            }
        },
    ];
    return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
    const filePath = `${process.cwd()}/${filename}.${extension}`
    shell.touch(filePath);
    return filePath;
};

const displaySuccess = mess => {
    console.log(
        chalk.white.bgGreen.bold(mess)
    );
};

const displayError = (mess) => {
    console.log(
        chalk.white.bgRed.bold(mess)
    );
}

const run = async () => {
    // show script introduction
    init();

    // ask questions
    const answers = await askQuestions();
    const { apiUrl, apiKey, cmd } = answers;

    displaySuccess(`Executing ${cmd}`);
    // Execute the command
    cmdObj[cmd].func(apiUrl, apiKey);
    displaySuccess(`Finished man ! you are so cool`);
};

run();