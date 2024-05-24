import inquirer from 'inquirer';
import { writeFile, readFile } from 'fs/promises';
import { exec } from 'child_process';

function generateSVG({ text, textColor, shape, shapeColor }) {
    let shapeElement;
    switch (shape) {
        case 'Circle':
            shapeElement = `<circle cx="150" cy="100" r="80" fill="${shapeColor}" />`;
            break;
        case 'Square':
            shapeElement = `<rect x="70" y="20" width="160" height="160" fill="${shapeColor}" />`;
            break;
        case 'Triangle':
            shapeElement = `<polygon points="150,20 280,180 20,180" fill="${shapeColor}" />`;
            break;
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
        ${shapeElement}
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="${textColor}">${text}</text>
    </svg>`;
}

inquirer.prompt([
    {
        type: 'input',
        name: 'text',
        message: 'Enter the text for the logo (up to 3 characters):',
        validate: input => input.length <= 3 || 'Text must be 3 characters or less'
    },
    {
        type: 'input',
        name: 'textColor',
        message: 'Enter the color for the text:'
    },
    {
        type: 'list',
        name: 'shape',
        message: 'Choose a shape for the logo:',
        choices: ['Circle', 'Square', 'Triangle']
    },
    {
        type: 'input',
        name: 'shapeColor',
        message: 'Enter the color for the shape:'
    }
]).then(answers => {
    const svgContent = generateSVG(answers);
    return writeFile('logo.svg', svgContent).then(() => svgContent);
}).then(svgContent => {
    console.log('Generated logo.svg');
    exec('svg-term --input logo.svg', (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log(stdout);
    });
}).catch(error => {
    console.error('Error:', error);
});
