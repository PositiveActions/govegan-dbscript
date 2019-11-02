#!/usr/bin/env node

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const initJs = require('./scripts/init_entries.js');
const addJs = require('./scripts/add_entries.js');

const cmdList = ["init", "add"];
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
            name: "API_URL",
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
            name: "API_KEY",
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
            type: "list",
            message: "What do you want to do ?",
            choices: cmdList
        },
    ];
    return inquirer.prompt(questions);
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
    const { API_URL, API_KEY, CMD } = answers;
    console.log('answers', answers);
    displaySuccess(`Executing ${CMD}`);
    // Execute the command
    try {
        await cmdObj[CMD].func(API_URL, API_KEY);
        displaySuccess(`Finished man ! you are so cool`);
        process.exit();
    } catch(err) {
        displayError(err);
        process.exit(1);
    }
};

run();