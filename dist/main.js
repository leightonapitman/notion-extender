/*
    --------------------------------------------------------------------
    > Save your API secret in the .env file at root level: $NOTION_KEY
    --------------------------------------------------------------------
    > Execute main => npm run-script go
    --------------------------------------------------------------------
*/
import { Client as NotionClient } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();
const notion = new NotionClient({ auth: process.env.NOTION_KEY });
/*
    LP: TODO
    Fetch all daily To-Dos, get their checked statuses
    Write function to reset all Daily To-Dos
*/
const personalPageId = 'c4abc862c750443288e9726449f06bc0';
const dailyToDoIds = [
    '5a60b5a6d35b4ca59a6f7f9b50ad0bca',
    '2a3cc9365bf7408dae1fc9257413b81b',
    'b47878db6ee24e8bb782fed616acc99d',
    'b0fea8c2186c4e9c98d0b6daca48b7e1',
    '0ce045e726b84735a7861397d6f2996a',
];
const dailyToDoCount = dailyToDoIds.length;
let completedDailyToDos = 0;
// Get daily report
reportDailyToDos(dailyToDoIds);
// Reset daily To-Do blocks
resetAllDailyToDos(dailyToDoIds, false);
// Behaviors
function reportDailyToDos(dailyToDoIds) {
    const dailyToDoResponses = dailyToDoIds.map(toDoId => {
        return notion.blocks.retrieve({ block_id: toDoId });
    });
    Promise.all(dailyToDoResponses)
        .then((blockResults) => {
        blockResults.forEach(({ to_do: block }) => {
            if (block.checked) {
                completedDailyToDos++;
            }
        });
    })
        .then(() => {
        console.log(`You've completed ${completedDailyToDos} of ${dailyToDoCount} daily tasks.`);
    });
}
function resetDailyToDo(toDoId, isChecked) {
    return notion.blocks.update({
        block_id: toDoId,
        to_do: {
            checked: isChecked,
        },
    });
}
function resetAllDailyToDos(dailyToDoIds, isChecked) {
    resetDailyToDo(dailyToDoIds[0], isChecked)
        .then(() => resetDailyToDo(dailyToDoIds[1], isChecked))
        .then(() => resetDailyToDo(dailyToDoIds[2], isChecked))
        .then(() => resetDailyToDo(dailyToDoIds[3], isChecked))
        .then(() => resetDailyToDo(dailyToDoIds[4], isChecked));
}
