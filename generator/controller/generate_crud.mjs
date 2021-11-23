import fs from "fs";
import lodash from "lodash";
// eslint-disable-next-line import/no-extraneous-dependencies
import inquirer from "inquirer";

const CUR_DIR = process.cwd();
const QUESTIONS = [
    {
        name: "controller-names",
        type: "input",
        message: "Enter Controller names separated by commas:",
    },
];

function capitalizeFirstLetter(input) {
    return input[0].toUpperCase() + input.slice(1);
}

const generateCrud = async () => {
    const answers = await inquirer.prompt(QUESTIONS);
    const input = answers["controller-names"];

    const controllerNames = input.split(",");
    controllerNames.forEach(controllerName => {
        const camelCase = lodash.camelCase(controllerName);
        const pascalCase = capitalizeFirstLetter(camelCase);
        const lowerCaseName = controllerName.trim().toLowerCase();
        const snakeCase = lodash.snakeCase(lowerCaseName);
        const controllerFileName = `${snakeCase}_controller`;
        const routerFileName = `${snakeCase}_router`;

        const templatePath = `${CUR_DIR}/generator/controller`;

        const controllerPath = `${templatePath}/controller`;
        let controllerContents = fs.readFileSync(controllerPath, "utf8");
        controllerContents = controllerContents
            .replace(/##NAME##/g, pascalCase)
            .replace(/##name##/g, lowerCaseName)
            .replace(/##modelName##/g, snakeCase);
        const controllerWritePath = `${CUR_DIR}/src/controllers/custom/${controllerFileName}.js`;
        fs.writeFileSync(controllerWritePath, controllerContents, "utf8");

        const routerPath = `${templatePath}/router`;
        let routerContents = fs.readFileSync(routerPath, "utf8");
        routerContents = routerContents
            .replace(/##snakename##/g, snakeCase)
            .replace(/##NAME##/g, pascalCase)
            .replace(/##name##/g, lowerCaseName)
            .replace(/##modelName##/g, snakeCase);
        const routerWritePath = `${CUR_DIR}/src/routes/custom/${routerFileName}.js`;
        fs.writeFileSync(routerWritePath, routerContents, "utf8");

        const routerImportPath = `${templatePath}/router_import`;
        let routerImportContents = fs.readFileSync(routerImportPath, "utf8");
        routerImportContents = routerImportContents
            .replace(/##snakename##/g, `${snakeCase}`)
            .replace(/##name##/g, `${lowerCaseName}`);

        const routerRegisterPath = `${templatePath}/router_register`;
        let routerRegisterContents = fs.readFileSync(
            routerRegisterPath,
            "utf8",
        );
        routerRegisterContents = routerRegisterContents.replace(
            /##name##/g,
            `${lowerCaseName}`,
        );

        const mainRouterWritePath = `${CUR_DIR}/src/routes/router.js`;
        let routerOldContents = fs.readFileSync(mainRouterWritePath, "utf8");
        routerOldContents = routerOldContents.replace(
            /\n\/\/CUSTOM/,
            `${routerImportContents}\n//CUSTOM`,
        );
        routerOldContents = routerOldContents.replace(
            /\/\/NEW_REGISTER/,
            `${routerRegisterContents}\n//NEW_REGISTER`,
        );
        fs.writeFileSync(mainRouterWritePath, routerOldContents, "utf8");
    });
};

generateCrud();
