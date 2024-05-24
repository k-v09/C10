import inquirer from 'inquirer';
import fs from 'fs';


const { writeFile } = fs.promises;

inquirer.prompt([
    {
        type: 'input',
        name: 'text',
        message: 'Enter the text for the logo (up to 3 characters):',
        validate: input => input.length <= 3 || 'Text must be 3 characters or less'
    },
    {
        type: 'input',
        name: 'tc',
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
        name: 'sc',
        message: 'Enter the color for the shape:'
    }
]).then(answers => {
    const SVGc = gSVG(answers);
    return writeFile('logo.svg', SVGc);
}).then(() => {
    console.log('Generated logo.svg');
}).catch(error => {
    console.error('Error:', error);
});

function gSVG({ text, tc, shape, sc }) {
    let sEL;
    switch (shape) {
        case 'Circle':
            sEL = `<circle cx="150" cy="100" r="80" fill="${sc}" />`;
            break;
        case 'Square':
            sEL = `<rect x="70" y="20" width="160" height="160" fill="${sc}" />`;
            break;
        case 'Triangle':
            sEL = `<polygon points="150,20 280,180 20,180" fill="${sc}" />`;
            break;
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
        ${sEL}
        <text x="150" y="125" font-size="60" text-anchor="middle" fill="${tc}">${text}</text>
    </svg>`;
}
